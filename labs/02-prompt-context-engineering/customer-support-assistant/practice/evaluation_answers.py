"""Worked answers for the Prompt Evaluation lesson exercises."""

from support_assistant.prompt_practice import (
    PromptCriteria,
    compare_responses,
    score_response,
)


def main() -> None:
    """Run every Prompt Evaluation answer without making a model request."""

    criteria = PromptCriteria(
        max_words=20,
        required_phrases=("order 10492", "in transit"),
        forbidden_phrases=("guaranteed",),
    )
    passing_response = "Order 10492 is in transit and expected on Friday."
    failing_response = "Your delivery is guaranteed for Friday."

    print("Prompt Evaluation Exercise 1")
    print(score_response(passing_response, criteria))
    print(score_response(failing_response, criteria))

    comparison = compare_responses(
        {
            "candidate_a": failing_response,
            "candidate_b": passing_response,
        },
        criteria,
    )
    for prompt_version, result in comparison.items():
        print(prompt_version, result)


if __name__ == "__main__":
    main()
