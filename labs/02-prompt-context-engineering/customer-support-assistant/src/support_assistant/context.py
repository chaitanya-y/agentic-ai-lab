from __future__ import annotations

import json
import re
from datetime import date
from math import ceil
from pathlib import Path
from typing import Iterable

from pydantic import TypeAdapter

from support_assistant.models import (
    ContextReport,
    ConversationTurn,
    EvidenceSource,
    ExcludedSource,
    OrderRecord,
    SupportRequest,
)
from support_assistant.prompts import RESPONSE_INSTRUCTIONS


FIXTURE_DIRECTORY = Path(__file__).resolve().parents[2] / "fixtures"
ORDER_ID_PATTERN = re.compile(r"\b\d{5}\b")


class ContextBudgetExceeded(ValueError):
    """Raised when the complete request would exceed its input allowance."""


def estimate_tokens(text: str) -> int:
    """Return a transparent approximation for offline teaching exercises."""

    return max(1, ceil(len(text) / 4))


def _read_json(filename: str, fixture_directory: Path = FIXTURE_DIRECTORY) -> object:
    with (fixture_directory / filename).open(encoding="utf-8") as handle:
        return json.load(handle)


def load_order(
    authenticated_customer_id: str,
    order_id: str,
    fixture_directory: Path = FIXTURE_DIRECTORY,
) -> OrderRecord:
    """Load one order without revealing whether another customer owns it."""

    records = TypeAdapter(list[OrderRecord]).validate_python(
        _read_json("orders.json", fixture_directory)
    )
    for record in records:
        if record.customer_id == authenticated_customer_id and record.order_id == order_id:
            return record
    raise PermissionError("Order is unavailable to this customer")


def load_conversation(
    conversation_id: str,
    fixture_directory: Path = FIXTURE_DIRECTORY,
) -> list[ConversationTurn]:
    """Load one supplied conversation fixture without persisting it."""

    conversations = _read_json("conversations.json", fixture_directory)
    if not isinstance(conversations, dict) or conversation_id not in conversations:
        raise KeyError(f"Unknown conversation fixture: {conversation_id}")
    return TypeAdapter(list[ConversationTurn]).validate_python(
        conversations[conversation_id]
    )


def _load_policies(fixture_directory: Path) -> list[EvidenceSource]:
    return TypeAdapter(list[EvidenceSource]).validate_python(
        _read_json("policies.json", fixture_directory)
    )


def select_policy_sources(
    issue_type: str,
    *,
    as_of: date,
    fixture_directory: Path = FIXTURE_DIRECTORY,
) -> tuple[list[EvidenceSource], list[ExcludedSource]]:
    """Select current customer facing policy sources using metadata."""

    included: list[EvidenceSource] = []
    excluded: list[ExcludedSource] = []

    for source in _load_policies(fixture_directory):
        reason = None
        if source.audience != "customer":
            reason = "internal audience"
        elif source.effective_from and source.effective_from > as_of:
            reason = "not yet effective"
        elif source.effective_until and source.effective_until < as_of:
            reason = "expired"
        elif issue_type not in source.topics:
            reason = "unrelated topic"

        if reason:
            excluded.append(ExcludedSource(source_id=source.source_id, reason=reason))
        else:
            included.append(source)

    return included, excluded


def select_conversation_history(
    turns: Iterable[ConversationTurn],
    *,
    current_order_id: str | None,
    maximum_turns: int = 6,
) -> list[ConversationTurn]:
    """Keep recent turns while removing results tied only to an old order."""

    selected: list[ConversationTurn] = []
    for turn in list(turns)[-maximum_turns:]:
        mentioned_ids = set(ORDER_ID_PATTERN.findall(turn.content))
        if current_order_id and mentioned_ids and current_order_id not in mentioned_ids:
            continue
        selected.append(turn)
    return selected


def _order_evidence(record: OrderRecord) -> EvidenceSource:
    delivery = record.expected_delivery or "No future delivery estimate"
    return EvidenceSource(
        source_id=f"order_{record.order_id}",
        source_type="order",
        audience="customer",
        version="fixture.2026-09-06",
        topics=["order_status", "damaged_item", "refund"],
        content=(
            f"Order {record.order_id}. Status: {record.status}. "
            f"Expected delivery: {delivery}. Latest update: {record.latest_update}."
        ),
    )


def _conversation_evidence(turn: ConversationTurn) -> EvidenceSource:
    return EvidenceSource(
        source_id=turn.turn_id,
        source_type="conversation",
        audience="customer",
        version="supplied-history.v1",
        topics=["conversation"],
        content=f"{turn.role}: {turn.content}",
    )


def build_context(
    *,
    request: SupportRequest,
    authenticated_customer_id: str,
    conversation_history: Iterable[ConversationTurn] = (),
    input_budget_tokens: int = 4_000,
    output_reserve_tokens: int = 500,
    as_of: date | None = None,
    fixture_directory: Path = FIXTURE_DIRECTORY,
) -> ContextReport:
    """Assemble permitted evidence and report every inclusion decision."""

    effective_date = as_of or date.today()
    if output_reserve_tokens >= input_budget_tokens:
        raise ContextBudgetExceeded("output reserve leaves no input budget")

    policies, excluded = select_policy_sources(
        request.issue_type,
        as_of=effective_date,
        fixture_directory=fixture_directory,
    )
    sources: list[EvidenceSource] = []

    if request.order_id:
        sources.append(
            _order_evidence(
                load_order(
                    authenticated_customer_id,
                    request.order_id,
                    fixture_directory,
                )
            )
        )

    selected_turns = select_conversation_history(
        conversation_history,
        current_order_id=request.order_id,
    )
    sources.extend(_conversation_evidence(turn) for turn in selected_turns)
    sources.extend(policies)

    rendered_context = "\n\n".join(
        f"[{source.source_id} | {source.source_type} | {source.version}]\n{source.content}"
        for source in sources
    )
    complete_request = "\n\n".join(
        [RESPONSE_INSTRUCTIONS, request.model_dump_json(), rendered_context]
    )
    estimated_input_tokens = estimate_tokens(complete_request)
    available_input_tokens = input_budget_tokens - output_reserve_tokens
    if estimated_input_tokens > available_input_tokens:
        raise ContextBudgetExceeded(
            "estimated request exceeds the available input budget "
            f"({estimated_input_tokens} > {available_input_tokens})"
        )

    return ContextReport(
        rendered_context=rendered_context,
        included_source_ids=[source.source_id for source in sources],
        excluded_sources=excluded,
        selected_conversation_turn_ids=[turn.turn_id for turn in selected_turns],
        estimated_input_tokens=estimated_input_tokens,
        input_budget_tokens=input_budget_tokens,
        output_reserve_tokens=output_reserve_tokens,
    )
