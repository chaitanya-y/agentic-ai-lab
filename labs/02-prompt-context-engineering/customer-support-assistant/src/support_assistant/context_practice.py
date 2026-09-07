from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable


class RequiredContextDoesNotFit(ValueError):
    """Raised when essential input exceeds the available input budget."""


@dataclass(frozen=True)
class ContextBudget:
    """One model context window divided into input and output capacity."""

    context_window_tokens: int
    output_reserve_tokens: int

    def __post_init__(self) -> None:
        if self.context_window_tokens <= 0:
            raise ValueError("context window must be greater than zero")
        if not 0 <= self.output_reserve_tokens < self.context_window_tokens:
            raise ValueError("output reserve must be smaller than the context window")

    @property
    def available_input_tokens(self) -> int:
        return self.context_window_tokens - self.output_reserve_tokens


@dataclass(frozen=True)
class ContextComponent:
    """One candidate input with an explicit size and selection priority."""

    component_id: str
    token_count: int
    priority: int
    required: bool = False

    def __post_init__(self) -> None:
        if self.token_count < 0:
            raise ValueError("token count cannot be negative")


@dataclass(frozen=True)
class ContextAllocation:
    """An inspectable record of what fit into the input budget."""

    included_component_ids: tuple[str, ...]
    excluded_component_ids: tuple[str, ...]
    used_input_tokens: int
    available_input_tokens: int

    @property
    def remaining_input_tokens(self) -> int:
        return self.available_input_tokens - self.used_input_tokens


def allocate_context(
    components: Iterable[ContextComponent],
    budget: ContextBudget,
) -> ContextAllocation:
    """Keep required input, then add optional input in priority order."""

    candidates = tuple(components)
    required = tuple(item for item in candidates if item.required)
    optional = tuple(
        sorted(
            (item for item in candidates if not item.required),
            key=lambda item: item.priority,
            reverse=True,
        )
    )

    required_tokens = sum(item.token_count for item in required)
    if required_tokens > budget.available_input_tokens:
        raise RequiredContextDoesNotFit(
            "required context exceeds the available input budget"
        )

    included = list(required)
    excluded: list[ContextComponent] = []
    used_tokens = required_tokens

    for component in optional:
        if used_tokens + component.token_count <= budget.available_input_tokens:
            included.append(component)
            used_tokens += component.token_count
        else:
            excluded.append(component)

    return ContextAllocation(
        included_component_ids=tuple(item.component_id for item in included),
        excluded_component_ids=tuple(item.component_id for item in excluded),
        used_input_tokens=used_tokens,
        available_input_tokens=budget.available_input_tokens,
    )


def find_unsupported_citations(
    citation_ids: Iterable[str],
    included_source_ids: Iterable[str],
) -> tuple[str, ...]:
    """Return citations that do not identify sources supplied to the model."""

    included = set(included_source_ids)
    return tuple(citation for citation in citation_ids if citation not in included)
