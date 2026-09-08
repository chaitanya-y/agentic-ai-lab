from __future__ import annotations

from datetime import date

import pytest

from support_assistant.context import (
    ContextBudgetExceeded,
    build_context,
    load_conversation,
    load_order,
)
from support_assistant.models import SupportRequest


def damaged_request(order_id: str = "10492") -> SupportRequest:
    return SupportRequest(
        issue_type="damaged_item",
        order_id=order_id,
        requested_outcome="replacement",
        missing_information=[],
    )


def test_context_selects_current_customer_facing_policy() -> None:
    report = build_context(
        request=damaged_request(),
        authenticated_customer_id="customer_001",
        as_of=date(2026, 9, 6),
    )

    assert "policy_damaged_current" in report.included_source_ids
    assert "order_10492" in report.included_source_ids


def test_internal_expired_and_unrelated_sources_are_excluded() -> None:
    report = build_context(
        request=damaged_request(),
        authenticated_customer_id="customer_001",
        as_of=date(2026, 9, 6),
    )

    assert "policy_internal_refund_notes" in report.excluded_source_ids
    assert "policy_damaged_expired" in report.excluded_source_ids
    assert "policy_warranty_unrelated" in report.excluded_source_ids
    assert "Internal refund threshold" not in report.rendered_context


def test_corrected_order_history_excludes_an_old_order_result() -> None:
    history = load_conversation("corrected_order")
    report = build_context(
        request=damaged_request(order_id="10429"),
        authenticated_customer_id="customer_001",
        conversation_history=history,
        as_of=date(2026, 9, 6),
    )

    assert "turn_correction" in report.selected_conversation_turn_ids
    assert "turn_old_result" not in report.selected_conversation_turn_ids
    assert "Order 10492 is in transit" not in report.rendered_context


def test_context_rejects_an_oversized_request() -> None:
    with pytest.raises(ContextBudgetExceeded, match="budget"):
        build_context(
            request=damaged_request(),
            authenticated_customer_id="customer_001",
            conversation_history=load_conversation("long_history"),
            input_budget_tokens=256,
            output_reserve_tokens=128,
            as_of=date(2026, 9, 6),
        )


def test_order_lookup_does_not_reveal_another_customers_order() -> None:
    with pytest.raises(PermissionError, match="unavailable"):
        load_order("customer_002", "10492")


def test_context_report_accounts_for_the_output_reserve() -> None:
    report = build_context(
        request=damaged_request(),
        authenticated_customer_id="customer_001",
        input_budget_tokens=4000,
        output_reserve_tokens=700,
        as_of=date(2026, 9, 6),
    )

    assert report.output_reserve_tokens == 700
    assert 0 < report.estimated_input_tokens <= 3300
