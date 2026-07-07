"""SQL agent over the Chinook SQLite database.

Docs source:
https://docs.langchain.com/oss/python/langchain/sql-agent

This module follows the LangChain SQL agent tutorial structure:
- download/use the Chinook SQLite sample database
- expose database inspection and query tools
- require query checking before query execution
- create a LangChain agent with SQL-specific instructions
- optionally pause before executing SQL with human-in-the-loop middleware

The query execution tool is intentionally read-only: it only allows SELECT
statements for this portfolio demo.
"""

from __future__ import annotations

import os
import pathlib
import sqlite3
import sys
from typing import Any

import requests
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langchain.tools import tool
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.types import Command

PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC_ROOT = PROJECT_ROOT / "src"
sys.path.insert(0, str(SRC_ROOT))

from model_config import build_chat_model
from utils.token_usage import TokenUsage, print_openai_usage_report

DATABASE_PATH = PROJECT_ROOT / "data" / "Chinook.db"
CHINOOK_URL = "https://storage.googleapis.com/benchmarks-artifacts/chinook/Chinook.db"

load_dotenv(PROJECT_ROOT / ".env")


def enabled(env_var: str) -> bool:
    """Return True when an env var is set to a truthy value."""
    return os.getenv(env_var, "").lower() in {"1", "true", "yes", "on"}


def ensure_database() -> None:
    """Download the Chinook sample database if it is not already present."""
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if DATABASE_PATH.exists():
        print(f"{DATABASE_PATH} already exists, skipping download.")
        return

    print(f"Downloading Chinook database to {DATABASE_PATH}")
    response = requests.get(CHINOOK_URL, timeout=60)
    response.raise_for_status()
    DATABASE_PATH.write_bytes(response.content)
    print(f"File downloaded and saved as {DATABASE_PATH}")


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
        for blocked in [" insert ", " update ", " delete ", " drop ", " alter "]
    )


def build_model() -> Any:
    """Build a chat model from environment variables."""
    return build_chat_model()


def build_tools(model: Any, usage: TokenUsage):
    """Creating SQL database tools"""
    query_calls = 0
    max_query_calls = int(os.getenv("MAX_SQL_QUERIES", "1"))

    @tool
    def sql_db_list_tables() -> str:
        """Input is an empty string, output is a comma-separated list of tables in the database."""
        con = connect()
        try:
            cursor = con.cursor()
            return ", ".join(table_names(cursor))
        finally:
            con.close()

    @tool
    def sql_db_schema(table_names_input: str) -> str:
        """Input is a comma-separated list of tables, output is schema and sample rows.

        Be sure that the tables actually exist by calling sql_db_list_tables first.
        Example Input: table1, table2, table3
        """
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
        """Input is a detailed and correct SQL query, output is a database result.

        If the query is not correct, an error message will be returned.
        If an error is returned, rewrite the query, check the query, and try again.
        If you encounter an Unknown column error, use sql_db_schema to inspect fields.
        """
        nonlocal query_calls
        if query_calls >= max_query_calls:
            return (
                "Error: SQL query limit reached. Use the previous query result "
                "to answer the user instead of running another query."
            )

        if not is_read_only_select(query):
            return "Error: only read-only SELECT statements are allowed in this demo."

        con = connect()
        try:
            cursor = con.cursor()
            cursor.execute(query)
            query_calls += 1
            return str(cursor.fetchall())
        except Exception as exc:
            return f"Error: {exc}"
        finally:
            con.close()

    @tool
    def sql_db_query_checker(query: str) -> str:
        """Use this tool to double check if your query is correct before executing it.

        Always use this tool before executing a query with sql_db_query.
        """
        trigger_prompt = f"""{query}
Double check the sqlite query above for common mistakes, including:
- Using NOT IN with NULL values
- Using UNION when UNION ALL should have been used
- Using BETWEEN for exclusive ranges
- Data type mismatch in predicates
- Properly quoting identifiers
- Using the correct number of arguments for functions
- Casting to the correct data type
- Using the proper columns for joins

If there are any of the above mistakes, rewrite the query. If there are no mistakes, just reproduce the original query.

Output the final SQL query only.

SQL Query:"""

        response = model.invoke(trigger_prompt)
        usage.add_from_message(response)
        return response.text.strip()

    return [sql_db_list_tables, sql_db_schema, sql_db_query, sql_db_query_checker]


def build_system_prompt() -> str:
    """Build the SQL agent system prompt from the docs."""
    return """
You are an agent designed to interact with a SQL database.
Given an input question, create a syntactically correct {dialect} query to run,
then look at the results of the query and return the answer. Unless the user
specifies a specific number of examples they wish to obtain, always limit your
query to at most {top_k} results.

You can order the results by a relevant column to return the most interesting
examples in the database. Never query for all the columns from a specific table,
only ask for the relevant columns given the question.

You MUST double check your query before executing it. If you get an error while
executing a query, rewrite the query and try again.

You should execute only one final SQL query. After sql_db_query returns a
successful result, stop querying and answer the user from that result.

DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the
database.

To start you should ALWAYS look at the tables in the database to see what you
can query. Do NOT skip this step.

Then you should query the schema of the most relevant tables.
""".format(
        dialect="sqlite",
        top_k=5,
    )


def build_sql_agent():
    """Create the SQL agent, optionally with human-in-the-loop review."""
    ensure_database()
    usage = TokenUsage()
    model = build_model()
    tools = build_tools(model, usage)
    middleware = []
    checkpointer = None

    if enabled("SQL_HUMAN_REVIEW"):
        middleware.append(
            HumanInTheLoopMiddleware(
                interrupt_on={"sql_db_query": True},
                description_prefix="Tool execution pending approval",
            )
        )
        checkpointer = InMemorySaver()

    agent = create_agent(
        model=model,
        tools=tools,
        system_prompt=build_system_prompt(),
        middleware=middleware,
        checkpointer=checkpointer,
    )
    return agent, usage


def print_stream(stream, usage: TokenUsage) -> None:
    """Print streamed messages and tool calls."""
    for kind, item in stream.interleave("messages", "tool_calls"):
        if kind == "messages":
            usage.add_from_message(item)
            for token in item.text:
                print(token, end="", flush=True)
        elif kind == "tool_calls":
            print(f"\nTool call: {item.tool_name}({item.input})")
            for delta in item.output_deltas:
                print(delta, end="", flush=True)
            print()


def print_interrupt_requests(stream) -> int:
    """Print pending human-review requests and return how many need decisions."""
    print("\nINTERRUPTED:")
    interrupt = stream.interrupts[0]
    action_requests = interrupt.value.get("action_requests", [])

    for request in action_requests:
        print(request["description"])
        print(f"Tool: {request['name']}")
        print(f"Args: {request['args']}")

    return len(action_requests)


def run_with_optional_approval(
    agent,
    initial_input: dict[str, Any],
    config: dict,
    usage: TokenUsage,
) -> None:
    """Run the SQL agent and optionally auto-approve repeated SQL review pauses."""
    stream = agent.stream_events(initial_input, config, version="v3")
    print_stream(stream, usage)

    while stream.interrupted:
        request_count = print_interrupt_requests(stream)

        if not enabled("AUTO_APPROVE_SQL"):
            print("\nSet AUTO_APPROVE_SQL=true to resume automatically.")
            return

        print("\nAUTO_APPROVE_SQL=true, resuming with approval.")
        stream = agent.stream_events(
            Command(
                resume={
                    "decisions": [
                        {"type": "approve"}
                        for _ in range(max(request_count, 1))
                    ]
                }
            ),
            config,
            version="v3",
        )
        print_stream(stream, usage)

    print_openai_usage_report(usage)


def main() -> None:
    agent, usage = build_sql_agent()
    question = "Which genre on average has the longest tracks?"
    config = {"configurable": {"thread_id": "sql-agent-demo"}}

    run_with_optional_approval(
        agent,
        {"messages": [{"role": "user", "content": question}]},
        config,
        usage,
    )


if __name__ == "__main__":
    main()
