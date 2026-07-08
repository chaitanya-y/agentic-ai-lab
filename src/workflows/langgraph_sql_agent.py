"""Custom SQL agent workflow built directly with LangGraph.

Docs source:
https://docs.langchain.com/oss/python/langgraph/sql-agent

This module follows the LangGraph SQL agent tutorial structure:
- list database tables with a deterministic tool call
- ask the model to choose relevant table schemas
- ask the model to generate a SQL query
- ask the model to check the SQL query before execution
- execute a read-only SQL query
- generate a final answer from query results

Repo adaptations:
- shared local Qwen / hosted OpenAI model configuration
- read-only SQLite connections and SELECT-only query guardrails
- one-query default limit for predictable demos
- dedicated final-answer node instead of an open-ended query loop
- OpenAI token and cost reporting controlled by SHOW_TOKEN_USAGE

Token budget note:
- LANGGRAPH_SQL_MAX_TOKENS controls the model output budget for each SQL workflow
  LLM call.
- Hosted reasoning models may spend part of this budget on hidden reasoning tokens,
  so this workflow defaults to 4096. Increase it further if the model fails to
  emit a tool call or answers before a sql_db_query tool result appears.
"""

from __future__ import annotations

import os
import pathlib
import sqlite3
import sys
from typing import Literal

import requests
from dotenv import load_dotenv
from langchain.tools import tool
from langchain_core.messages import AIMessage
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode

PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC_ROOT = PROJECT_ROOT / "src"
sys.path.insert(0, str(SRC_ROOT))

from agents.model_config import build_chat_model
from utils.token_usage import TokenUsage, print_openai_usage_report

DATABASE_PATH = PROJECT_ROOT / "data" / "Chinook.db"
CHINOOK_URL = "https://storage.googleapis.com/benchmarks-artifacts/chinook/Chinook.db"

load_dotenv(PROJECT_ROOT / ".env")


def enabled(env_var: str, default: bool = False) -> bool:
    """Return True when an env var is truthy, with a configurable default."""
    value = os.getenv(env_var)
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "on"}


def log_line(message: str = "") -> None:
    """Print a labeled line so demo output is easy to scan."""
    print(f">> {message}" if message else ">>")


def log_block(title: str, content: str) -> None:
    """Print a labeled multi-line block."""
    print(f"\n>> {title}")
    for line in content.splitlines():
        print(f">>   {line}")
    print(f">> End {title}\n")


def ensure_database() -> None:
    """Download the Chinook sample database if it is not already present."""
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if DATABASE_PATH.exists():
        log_line(f"{DATABASE_PATH} already exists, skipping download.")
        return

    log_line(f"Downloading Chinook database to {DATABASE_PATH}")
    response = requests.get(CHINOOK_URL, timeout=60)
    response.raise_for_status()
    DATABASE_PATH.write_bytes(response.content)
    log_line(f"File downloaded and saved as {DATABASE_PATH}")


def connect() -> sqlite3.Connection:
    """Open a read-only SQLite connection."""
    return sqlite3.connect(f"file:{DATABASE_PATH}?mode=ro", uri=True)


def table_names(cursor: sqlite3.Cursor) -> list[str]:
    """Return user table names from the database."""
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    return [row[0] for row in cursor.fetchall() if not row[0].startswith("sqlite_")]


def is_read_only_select(query: str) -> bool:
    """Allow only single SELECT statements in this demo."""
    normalized = query.strip().lower()
    if not normalized.startswith("select"):
        return False
    if "--" in normalized or "/*" in normalized or "*/" in normalized:
        return False
    if ";" in normalized.rstrip(";"):
        return False
    return not any(
        blocked in normalized
        for blocked in [
            " insert ",
            " update ",
            " delete ",
            " drop ",
            " alter ",
            " create ",
            " replace ",
            " truncate ",
        ]
    )


@tool
def sql_db_list_tables() -> str:
    """Input is empty; output is a comma-separated list of tables in the database."""
    con = connect()
    try:
        cursor = con.cursor()
        return ", ".join(table_names(cursor))
    finally:
        con.close()


@tool
def sql_db_schema(table_names_input: str) -> str:
    """Input is comma-separated table names; output is schema and sample rows."""
    con = connect()
    try:
        cursor = con.cursor()
        valid_tables = set(table_names(cursor))
        results = []
        for table in table_names_input.split(","):
            table = table.strip()
            if table not in valid_tables:
                results.append(f"Error: table_names {{{table!r}}} not found in database")
                continue

            cursor.execute(
                "SELECT sql FROM sqlite_master WHERE type='table' AND name=?;",
                (table,),
            )
            schema_row = cursor.fetchone()
            if not schema_row:
                continue

            results.append(schema_row[0])
            quoted_table = '"' + table.replace('"', '""') + '"'
            cursor.execute(f"SELECT * FROM {quoted_table} LIMIT 3;")
            rows = cursor.fetchall()
            if rows:
                col_names = [description[0] for description in cursor.description]
                results.append(
                    f"/*\n3 rows from {table} table:\n"
                    + "\t".join(col_names)
                    + "\n"
                    + "\n".join("\t".join(str(x) for x in row) for row in rows)
                    + "\n*/"
                )
        return "\n\n".join(results)
    finally:
        con.close()


@tool
def sql_db_query(query: str) -> str:
    """Execute a read-only SQLite SELECT query and return the result."""
    if not is_read_only_select(query):
        return "Error: only read-only SELECT statements are allowed in this demo."

    con = connect()
    try:
        cursor = con.cursor()
        cursor.execute(query)
        return str(cursor.fetchall())
    except Exception as exc:
        return f"Error: {exc}"
    finally:
        con.close()


tools = [sql_db_list_tables, sql_db_schema, sql_db_query]
get_schema_node = ToolNode([sql_db_schema], name="get_schema")
run_query_node = ToolNode([sql_db_query], name="run_query")


def get_model():
    """Build the workflow model with enough output room for SQL tool calls."""
    return build_chat_model(
        temperature=0,
        max_tokens=int(os.getenv("LANGGRAPH_SQL_MAX_TOKENS", "4096")),
    )


def list_tables(state: MessagesState):
    """Start by listing tables through a predetermined tool call."""
    tool_call = {
        "name": "sql_db_list_tables",
        "args": {},
        "id": "list-tables",
        "type": "tool_call",
    }
    tool_call_message = AIMessage(content="", tool_calls=[tool_call])
    tool_message = sql_db_list_tables.invoke(tool_call)
    response = AIMessage(f"Available tables: {tool_message.content}")
    log_line(response.content)
    return {"messages": [tool_call_message, tool_message, response]}


def call_get_schema(state: MessagesState):
    """Ask the model to call the schema tool for relevant tables."""
    model = get_model()
    llm_with_tools = model.bind_tools([sql_db_schema], tool_choice="any")
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}


GENERATE_QUERY_SYSTEM_PROMPT = """
You are an agent designed to interact with a SQL database.
Given an input question, create a syntactically correct {dialect} query to run,
then look at the results of the query and return the answer. Unless the user
specifies a specific number of examples they wish to obtain, always limit your
query to at most {top_k} results.

You can order the results by a relevant column to return the most interesting
examples in the database. Never query for all the columns from a specific table,
only ask for the relevant columns given the question.

You should execute only one final SQL query. After sql_db_query returns a
successful result, stop querying and answer the user from that result.

DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the
database.
""".format(
    dialect="sqlite",
    top_k=5,
)


def generate_query(state: MessagesState):
    """Generate a SQL query tool call or final answer."""
    system_message = {
        "role": "system",
        "content": GENERATE_QUERY_SYSTEM_PROMPT,
    }
    model = get_model()
    llm_with_tools = model.bind_tools([sql_db_query])
    response = llm_with_tools.invoke([system_message] + state["messages"])
    return {"messages": [response]}


CHECK_QUERY_SYSTEM_PROMPT = """
You are a SQL expert with a strong attention to detail.
Double check the {dialect} query for common mistakes, including:
- Using NOT IN with NULL values
- Using UNION when UNION ALL should have been used
- Using BETWEEN for exclusive ranges
- Data type mismatch in predicates
- Properly quoting identifiers
- Using the correct number of arguments for functions
- Casting to the correct data type
- Using the proper columns for joins

If there are any of the above mistakes, rewrite the query. If there are no
mistakes, just reproduce the original query.

You will call the appropriate tool to execute the query after running this check.
""".format(dialect="sqlite")


def check_query(state: MessagesState):
    """Check the generated query before execution."""
    tool_call = state["messages"][-1].tool_calls[0]
    query = tool_call["args"]["query"]
    log_block("Generated SQL query", query)
    system_message = {
        "role": "system",
        "content": CHECK_QUERY_SYSTEM_PROMPT,
    }
    user_message = {"role": "user", "content": query}
    model = get_model()
    llm_with_tools = model.bind_tools([sql_db_query], tool_choice="any")
    response = llm_with_tools.invoke([system_message, user_message])
    response.id = state["messages"][-1].id
    return {"messages": [response]}


FINAL_ANSWER_SYSTEM_PROMPT = """
You are a careful data analyst. Use the SQL query result in the previous tool
message to answer the user's question. Keep the answer concise, include the
most important value, and do not run another SQL query.
"""


def generate_final_answer(state: MessagesState):
    """Generate the final response after one checked SQL query has executed."""
    system_message = {
        "role": "system",
        "content": FINAL_ANSWER_SYSTEM_PROMPT,
    }
    model = get_model()
    response = model.invoke([system_message] + state["messages"])
    return {"messages": [response]}


def should_continue(state: MessagesState) -> Literal["check_query", "__end__"]:
    """Route to query checking when the model requested query execution."""
    last_message = state["messages"][-1]
    if getattr(last_message, "tool_calls", None):
        return "check_query"
    return END


def build_graph():
    """Assemble the custom LangGraph SQL workflow."""
    builder = StateGraph(MessagesState)
    builder.add_node(list_tables)
    builder.add_node(call_get_schema)
    builder.add_node(get_schema_node, "get_schema")
    builder.add_node(generate_query)
    builder.add_node(check_query)
    builder.add_node(run_query_node, "run_query")
    builder.add_node(generate_final_answer)

    builder.add_edge(START, "list_tables")
    builder.add_edge("list_tables", "call_get_schema")
    builder.add_edge("call_get_schema", "get_schema")
    builder.add_edge("get_schema", "generate_query")
    builder.add_conditional_edges("generate_query", should_continue)
    builder.add_edge("check_query", "run_query")
    builder.add_edge("run_query", "generate_final_answer")
    builder.add_edge("generate_final_answer", END)
    return builder.compile()


def collect_token_usage(messages: list) -> TokenUsage:
    """Collect token usage from messages in the final graph state."""
    usage = TokenUsage()
    for message in messages:
        usage.add_from_message(message)
    return usage


def run_langgraph_sql_agent() -> None:
    """Run the custom SQL graph with the tutorial question."""
    ensure_database()
    graph = build_graph()
    question = "Which genre on average has the longest tracks?"
    recursion_limit = int(os.getenv("LANGGRAPH_SQL_RECURSION_LIMIT", "8"))
    final_state = graph.invoke(
        {"messages": [{"role": "user", "content": question}]},
        {"recursion_limit": recursion_limit},
    )

    if not final_state or not final_state.get("messages"):
        log_line("No final graph state was returned.")
        return

    final_message = final_state["messages"][-1]
    content = getattr(final_message, "content", "")
    if content:
        log_block("Final answer", content)

    if enabled("SHOW_GRAPH_MESSAGES"):
        log_line("Final graph messages")
        for index, message in enumerate(final_state["messages"], start=1):
            message_type = getattr(message, "type", message.__class__.__name__)
            message_content = getattr(message, "content", "")
            tool_calls = getattr(message, "tool_calls", None)
            log_line(f"[{index}] {message_type}")
            if tool_calls:
                log_line(f"tool_calls={tool_calls}")
            if message_content:
                log_block(f"Message {index} content", message_content)

    if enabled("SHOW_TOKEN_USAGE", default=True):
        usage = collect_token_usage(final_state["messages"])
        print_openai_usage_report(usage)


if __name__ == "__main__":
    run_langgraph_sql_agent()
