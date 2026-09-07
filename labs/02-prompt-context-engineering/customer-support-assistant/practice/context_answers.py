"""Worked answers for the Context Engineering lesson exercises."""

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
    """Run every worked answer without making a model request."""

    print("Exercise 1")
    budget = ContextBudget(
        context_window_tokens=4_000,
        output_reserve_tokens=500,
    )
    print("Available input tokens", budget.available_input_tokens)
    try:
        ContextBudget(
            context_window_tokens=4_000,
            output_reserve_tokens=4_000,
        )
    except ValueError as error:
        print("Invalid budget", error)

    print("\nExercise 2")
    allocation = allocate_context(
        (
            ContextComponent("instructions", 300, 100, required=True),
            ContextComponent("customer_request", 100, 100, required=True),
            ContextComponent("current_order", 700, 90),
            ContextComponent("current_policy", 1_200, 80),
            ContextComponent("old_history", 1_500, 20),
        ),
        budget,
    )
    print("Included", allocation.included_component_ids)
    print("Excluded", allocation.excluded_component_ids)
    print("Remaining input tokens", allocation.remaining_input_tokens)

    print("\nExercise 3")
    included, excluded = select_policy_sources(
        "damaged_item",
        as_of=date(2026, 9, 6),
    )
    print("Included policies", [source.source_id for source in included])
    print(
        "Excluded policies",
        [(source.source_id, source.reason) for source in excluded],
    )

    print("\nExercise 4")
    history = load_conversation("corrected_order")
    selected_history = select_conversation_history(
        history,
        current_order_id="10429",
    )
    print("Selected turns", [turn.turn_id for turn in selected_history])

    print("\nExercise 5")
    unsupported = find_unsupported_citations(
        citation_ids=("order_10429", "policy_internal_refund_notes"),
        included_source_ids=("order_10429", "policy_damaged_current"),
    )
    print("Unsupported citations", unsupported)


if __name__ == "__main__":
    main()
