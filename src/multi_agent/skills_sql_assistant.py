"""SQL assistant with on-demand skills and progressive disclosure.

Docs source:
https://docs.langchain.com/oss/python/langchain/multi-agent/skills-sql-assistant

This module follows the LangChain skills tutorial structure:
- inject lightweight skill descriptions into the system prompt with middleware
- expose a `load_skill` tool
- load full schema and business rules only when the task needs them
- generate SQL using the loaded skill context

What to observe when running:
- The first model call sees only small skill descriptions.
- The agent calls `load_skill` when it needs domain-specific SQL context.
- The tool returns the full schema and business rules for one business vertical.
- The final answer uses the loaded skill content to write a query.

Conceptual difference from the other SQL examples:
- `src/agents/sql_agent.py` and `src/workflows/langgraph_sql_agent.py` inspect
  and query a real SQLite database.
- This file demonstrates progressive disclosure: loading specialized prompt
  context on demand. It generates SQL only and does not execute it.

Safety note:
- No database query is executed.
- The schemas and business rules are local demo strings.
"""

from __future__ import annotations

import os
import pathlib
import sys
from collections.abc import Callable
from typing import Literal

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.agents.middleware import AgentMiddleware, ModelRequest, ModelResponse
from langchain.messages import SystemMessage
from langchain.tools import tool

PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC_ROOT = PROJECT_ROOT / "src"
sys.path.insert(0, str(SRC_ROOT))

from agents.model_config import build_chat_model
from utils.demo_io import enabled, final_text, log_block, log_line
from utils.token_usage import collect_token_usage, print_openai_usage_report

load_dotenv(PROJECT_ROOT / ".env")

SkillName = Literal["sales_analytics", "inventory_management"]


SKILL_LIBRARY: dict[SkillName, str] = {
    "sales_analytics": """
# Sales Analytics Skill

Use this skill when the user asks about customers, orders, revenue, regions,
customer tiers, refunds, or high-value purchases.

## Tables

### customers
- customer_id (PRIMARY KEY)
- name
- email
- signup_date
- status (active/inactive)
- customer_tier (bronze/silver/gold/platinum)

### orders
- order_id (PRIMARY KEY)
- customer_id (FOREIGN KEY -> customers.customer_id)
- order_date
- status (pending/completed/cancelled/refunded)
- total_amount
- sales_region (north/south/east/west)

### order_items
- order_item_id (PRIMARY KEY)
- order_id (FOREIGN KEY -> orders.order_id)
- product_id
- quantity
- unit_price

## Business Logic

- High-value orders are orders where `total_amount > 1000`.
- Revenue calculations should include only `orders.status = 'completed'`.
- Active customers have `customers.status = 'active'`.
- Use `CURRENT_DATE - INTERVAL '1 month'` for "last month" in PostgreSQL-style SQL.
""",
    "inventory_management": """
# Inventory Management Skill

Use this skill when the user asks about stock levels, warehouses, suppliers,
reorder points, backorders, or inventory movement.

## Tables

### products
- product_id (PRIMARY KEY)
- sku
- name
- category
- status (active/discontinued)

### inventory
- inventory_id (PRIMARY KEY)
- product_id (FOREIGN KEY -> products.product_id)
- warehouse_id
- quantity_on_hand
- reorder_point
- last_counted_at

### suppliers
- supplier_id (PRIMARY KEY)
- name
- region
- priority_level (primary/secondary/backup)

### purchase_orders
- purchase_order_id (PRIMARY KEY)
- product_id (FOREIGN KEY -> products.product_id)
- supplier_id (FOREIGN KEY -> suppliers.supplier_id)
- ordered_quantity
- status (draft/ordered/received/cancelled)
- expected_delivery_date

## Business Logic

- Low-stock items have `quantity_on_hand <= reorder_point`.
- Only active products should be included in operational inventory reports.
- Open purchase orders have status `ordered`.
- Use primary suppliers first when recommending replenishment.
""",
}


SKILL_DESCRIPTIONS: dict[SkillName, str] = {
    "sales_analytics": (
        "Database schema and business logic for sales data analysis including "
        "customers, orders, revenue, regions, and high-value purchases."
    ),
    "inventory_management": (
        "Database schema and business logic for inventory tracking including "
        "products, stock levels, warehouses, suppliers, and reorders."
    ),
}


@tool
def load_skill(skill_name: SkillName) -> str:
    """Load a specialized SQL skill.

    Available skills:
    - sales_analytics: customers, orders, revenue, regions, high-value purchases
    - inventory_management: products, stock levels, warehouses, suppliers, reorders

    Returns the selected skill's schema, business logic, and SQL conventions.
    """
    skill = SKILL_LIBRARY[skill_name]
    log_block("Loaded skill", f"{skill_name}\n\n{skill}")
    return f"Loaded skill: {skill_name}\n\n{skill}"


class SkillMiddleware(AgentMiddleware):
    """Inject lightweight skill descriptions before each model call."""

    tools = [load_skill]

    def __init__(self) -> None:
        """Build the skill discovery prompt from local skill metadata."""
        skills_list = [
            f"- **{name}**: {description}"
            for name, description in SKILL_DESCRIPTIONS.items()
        ]
        self.skills_prompt = "\n".join(skills_list)

    def wrap_model_call(
        self,
        request: ModelRequest,
        handler: Callable[[ModelRequest], ModelResponse],
    ) -> ModelResponse:
        """Append skill metadata to the system prompt for this model call."""
        skills_addendum = (
            f"\n\n## Available Skills\n\n{self.skills_prompt}\n\n"
            "Use the load_skill tool when you need detailed schema, business "
            "logic, or SQL conventions for a specific business area."
        )

        new_content = list(request.system_message.content_blocks) + [
            {"type": "text", "text": skills_addendum}
        ]
        request = request.override(
            system_message=SystemMessage(content=new_content),
        )
        return handler(request)


SYSTEM_PROMPT = """You are a SQL assistant that uses on-demand skills.

You know only lightweight metadata at startup. Use `load_skill` before writing
SQL whenever the task requires domain-specific schemas or business rules.

Rules:
- Do not invent table or column names.
- Load the relevant skill before writing SQL.
- Generate SQL only; do not execute SQL.
- Explain briefly which loaded skill informed the query.
"""


def print_messages(result: dict) -> None:
    """Print final agent messages for debugging and learning."""
    if not enabled("SHOW_MULTI_AGENT_MESSAGES", default=True):
        return

    log_line("Final skills assistant messages")
    for index, message in enumerate(result["messages"], start=1):
        message_type = getattr(message, "type", message.__class__.__name__)
        tool_calls = getattr(message, "tool_calls", None)
        content = getattr(message, "content", "")
        log_line(f"[{index}] {message_type}")
        if tool_calls:
            log_line(f"tool_calls={tool_calls}")
        if content:
            log_block(f"Message {index} content", str(content))


def build_skills_sql_assistant():
    """Create the skills-based SQL assistant."""
    model = build_chat_model(
        temperature=0,
        max_tokens=int(os.getenv("SKILLS_SQL_MAX_TOKENS", "2048")),
    )
    return create_agent(
        model,
        system_prompt=SYSTEM_PROMPT,
        middleware=[SkillMiddleware()],
    )


def run_skills_sql_assistant() -> None:
    """Run the progressive-disclosure SQL skills demo."""
    query = (
        "Write a SQL query to find all active customers who made completed "
        "orders over $1000 in the last month."
    )
    log_block("User query", query)

    agent = build_skills_sql_assistant()
    result = agent.invoke({"messages": [{"role": "user", "content": query}]})
    log_block("Final SQL assistant answer", final_text(result))
    print_messages(result)

    if enabled("SHOW_TOKEN_USAGE", default=True):
        usage = collect_token_usage(result["messages"])
        print_openai_usage_report(usage)


if __name__ == "__main__":
    run_skills_sql_assistant()
