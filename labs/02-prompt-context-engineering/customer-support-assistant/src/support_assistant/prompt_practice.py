from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping


PromptValue = str | int | float


@dataclass(frozen=True)
class PromptTemplate:
    """A small prompt template with an explicit input contract."""

    name: str
    template: str
    required_variables: tuple[str, ...]

    def render(self, variables: Mapping[str, PromptValue]) -> str:
        """Validate named inputs and render the final instruction."""

        supplied = set(variables)
        required = set(self.required_variables)
        missing = sorted(required.difference(supplied))
        unexpected = sorted(supplied.difference(required))

        contract_errors: list[str] = []
        if missing:
            contract_errors.append(
                "missing prompt variables: " + ", ".join(missing)
            )
        if unexpected:
            contract_errors.append(
                "unexpected prompt variables: " + ", ".join(unexpected)
            )
        if contract_errors:
            raise ValueError(". ".join(contract_errors))

        return self.template.format_map(dict(variables))


@dataclass(frozen=True)
class PromptCriteria:
    """Observable requirements used to check one generated response."""

    max_words: int | None = None
    required_phrases: tuple[str, ...] = ()
    forbidden_phrases: tuple[str, ...] = ()


@dataclass(frozen=True)
class PromptScore:
    """The result of checking a response against prompt criteria."""

    word_count: int
    length_passed: bool
    missing_required_phrases: tuple[str, ...]
    found_forbidden_phrases: tuple[str, ...]

    @property
    def required_phrases_passed(self) -> bool:
        return not self.missing_required_phrases

    @property
    def forbidden_phrases_passed(self) -> bool:
        return not self.found_forbidden_phrases

    @property
    def passed(self) -> bool:
        return (
            self.length_passed
            and self.required_phrases_passed
            and self.forbidden_phrases_passed
        )


def score_response(response: str, criteria: PromptCriteria) -> PromptScore:
    """Check requirements that application code can observe directly."""

    word_count = len(response.split())
    normalized = response.casefold()
    missing = tuple(
        phrase
        for phrase in criteria.required_phrases
        if phrase.casefold() not in normalized
    )
    forbidden = tuple(
        phrase
        for phrase in criteria.forbidden_phrases
        if phrase.casefold() in normalized
    )

    return PromptScore(
        word_count=word_count,
        length_passed=(
            criteria.max_words is None or word_count <= criteria.max_words
        ),
        missing_required_phrases=missing,
        found_forbidden_phrases=forbidden,
    )


def compare_responses(
    responses: Mapping[str, str],
    criteria: PromptCriteria,
) -> dict[str, PromptScore]:
    """Score outputs while preserving the prompt version that produced each one."""

    return {
        prompt_version: score_response(response, criteria)
        for prompt_version, response in responses.items()
    }
