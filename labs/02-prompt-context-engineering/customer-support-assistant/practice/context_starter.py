"""Starter file for the Context Engineering lesson exercises."""

from datetime import date

from support_assistant.context import (
    load_conversation,
    select_conversation_history,
    select_policy_sources,
)
from support_assistant.context_practice import (
    ContextBudget,
    ContextComponent,
    allocate_context,
    find_unsupported_citations,
)


def main() -> None:
    """Complete each exercise, then print and inspect the result."""

    # Context Engineering Exercise 1
    # Create a 4,000 token context budget with 500 tokens reserved for output.
    # Print the available input capacity, then catch the error raised when
    # the output reserve equals the full context window.

    # Context Engineering Exercise 2
    # Allocate required instructions and the customer request before optional
    # order, policy, and old history components.
    # Print the included, excluded, and remaining input token values.

    # Context Engineering Exercise 3
    # Use select_policy_sources to inspect included and excluded policy IDs.
    # Use date(2026, 9, 6) as the evaluation date.

    # Context Engineering Exercise 4
    # Load corrected_order and select turns for order 10429.
    # Print the selected turn identifiers.

    # Context Engineering Exercise 5
    # Check whether every generated citation appears in the included sources.
    # Print the unsupported citation identifiers.
    pass


if __name__ == "__main__":
    main()
