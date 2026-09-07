from __future__ import annotations

import pytest

from support_assistant.context_practice import (
    ContextBudget,
    ContextComponent,
    RequiredContextDoesNotFit,
    allocate_context,
    find_unsupported_citations,
)


def test_context_budget_reserves_output_capacity() -> None:
    budget = ContextBudget(
        context_window_tokens=1_000,
        output_reserve_tokens=250,
    )

    assert budget.available_input_tokens == 750


def test_context_budget_rejects_an_invalid_output_reserve() -> None:
    with pytest.raises(ValueError, match="output reserve"):
        ContextBudget(
            context_window_tokens=500,
            output_reserve_tokens=500,
        )


def test_context_allocation_keeps_required_components() -> None:
    components = (
        ContextComponent("instructions", token_count=120, priority=100, required=True),
        ContextComponent("customer_request", token_count=80, priority=100, required=True),
        ContextComponent("policy", token_count=300, priority=80),
    )

    allocation = allocate_context(
        components,
        ContextBudget(context_window_tokens=800, output_reserve_tokens=200),
    )

    assert allocation.included_component_ids == (
        "instructions",
        "customer_request",
        "policy",
    )
    assert allocation.excluded_component_ids == ()
    assert allocation.used_input_tokens == 500
    assert allocation.remaining_input_tokens == 100


def test_context_allocation_prefers_higher_priority_optional_context() -> None:
    components = (
        ContextComponent("instructions", token_count=100, priority=100, required=True),
        ContextComponent("current_order", token_count=180, priority=90),
        ContextComponent("current_policy", token_count=160, priority=80),
        ContextComponent("old_history", token_count=140, priority=20),
    )

    allocation = allocate_context(
        components,
        ContextBudget(context_window_tokens=600, output_reserve_tokens=100),
    )

    assert allocation.included_component_ids == (
        "instructions",
        "current_order",
        "current_policy",
    )
    assert allocation.excluded_component_ids == ("old_history",)


def test_context_allocation_rejects_required_context_that_does_not_fit() -> None:
    components = (
        ContextComponent("instructions", token_count=300, priority=100, required=True),
        ContextComponent("customer_request", token_count=250, priority=100, required=True),
    )

    with pytest.raises(RequiredContextDoesNotFit, match="required context"):
        allocate_context(
            components,
            ContextBudget(context_window_tokens=600, output_reserve_tokens=100),
        )


def test_unsupported_citations_are_reported() -> None:
    unsupported = find_unsupported_citations(
        citation_ids=("order_10492", "policy_internal_refund_notes"),
        included_source_ids=("order_10492", "policy_order_status"),
    )

    assert unsupported == ("policy_internal_refund_notes",)
