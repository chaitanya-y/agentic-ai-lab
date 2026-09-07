"""Starter file for the Prompt Engineering lesson exercises."""

from support_assistant.prompt_practice import (
    PromptCriteria,
    PromptTemplate,
    compare_responses,
    score_response,
)


# Exercise 1
# Replace this vague instruction with a bounded order status instruction.
ORDER_STATUS_INSTRUCTIONS = "Reply to this customer"


# Exercise 2
# Create a PromptTemplate with issue_type, audience, and word_limit inputs.
SUPPORT_SUMMARY_TEMPLATE: PromptTemplate | None = None


def main() -> None:
    """Complete each marked exercise, then print and inspect the results."""

    print("Exercise 1")
    print(ORDER_STATUS_INSTRUCTIONS)

    # Exercise 2
    # Render SUPPORT_SUMMARY_TEMPLATE for a damaged item request.

    # Exercise 3
    # Try rendering once without audience and once with an unexpected tone.
    # Catch ValueError so the program can continue to the next exercise.

    # Exercise 4
    # Build PromptCriteria and score one passing and one failing response.

    # Exercise 5
    # Use compare_responses with baseline.v1 and revised.v1 response text.


if __name__ == "__main__":
    main()
