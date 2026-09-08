from __future__ import annotations

import pytest

from support_assistant.prompt_practice import (
    PromptCriteria,
    PromptTemplate,
    compare_responses,
    score_response,
)


def test_prompt_template_renders_named_variables() -> None:
    template = PromptTemplate(
        name="support_summary",
        template=(
            "Explain the {issue_type} request to a {audience}. "
            "Keep the answer below {word_limit} words."
        ),
        required_variables=("issue_type", "audience", "word_limit"),
    )

    rendered = template.render(
        {
            "issue_type": "damaged item",
            "audience": "customer",
            "word_limit": 40,
        }
    )

    assert rendered == (
        "Explain the damaged item request to a customer. "
        "Keep the answer below 40 words."
    )


def test_prompt_template_reports_missing_variables_before_a_model_call() -> None:
    template = PromptTemplate(
        name="support_summary",
        template="Explain {issue_type} to a {audience}.",
        required_variables=("issue_type", "audience"),
    )

    with pytest.raises(ValueError, match="missing prompt variables: audience"):
        template.render({"issue_type": "refund"})


def test_prompt_template_reports_unexpected_variables() -> None:
    template = PromptTemplate(
        name="support_summary",
        template="Explain {issue_type}.",
        required_variables=("issue_type",),
    )

    with pytest.raises(ValueError, match="unexpected prompt variables: tone"):
        template.render({"issue_type": "refund", "tone": "friendly"})


def test_prompt_template_reports_missing_and_unexpected_variables_together() -> None:
    template = PromptTemplate(
        name="support_summary",
        template="Explain {issue_type} in {word_limit} words.",
        required_variables=("issue_type", "word_limit"),
    )

    with pytest.raises(
        ValueError,
        match=(
            r"missing prompt variables: word_limit\. "
            "unexpected prompt variables: word_count"
        ),
    ):
        template.render({"issue_type": "refund", "word_count": 40})


def test_score_response_checks_observable_criteria() -> None:
    criteria = PromptCriteria(
        max_words=12,
        required_phrases=("order 10492", "in transit"),
        forbidden_phrases=("refund issued",),
    )

    result = score_response(
        "Order 10492 is in transit and is expected on Friday.",
        criteria,
    )

    assert result.word_count == 10
    assert result.length_passed is True
    assert result.required_phrases_passed is True
    assert result.forbidden_phrases_passed is True
    assert result.passed is True


def test_score_response_reports_each_failed_check() -> None:
    criteria = PromptCriteria(
        max_words=5,
        required_phrases=("order 10492", "Friday"),
        forbidden_phrases=("refund issued",),
    )

    result = score_response(
        "Your refund issued request is still being reviewed today.",
        criteria,
    )

    assert result.length_passed is False
    assert result.missing_required_phrases == ("order 10492", "Friday")
    assert result.found_forbidden_phrases == ("refund issued",)
    assert result.passed is False


def test_compare_responses_keeps_scores_attached_to_prompt_versions() -> None:
    criteria = PromptCriteria(
        max_words=12,
        required_phrases=("order 10492", "Friday"),
        forbidden_phrases=("guaranteed",),
    )

    comparison = compare_responses(
        {
            "baseline.v1": "Your delivery is guaranteed for Friday.",
            "revised.v1": "Order 10492 is expected on Friday.",
        },
        criteria,
    )

    assert comparison["baseline.v1"].passed is False
    assert comparison["revised.v1"].passed is True
