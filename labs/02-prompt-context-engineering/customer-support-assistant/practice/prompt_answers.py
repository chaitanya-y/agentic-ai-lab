"""Worked answers for the Prompt Engineering lesson exercises."""

from support_assistant.prompt_practice import PromptTemplate


ORDER_STATUS_INSTRUCTIONS = """
Write a concise order status response for the customer.

Use only the approved order record supplied with the request.
Include the order number, current status, and delivery estimate when present.
Keep the response below 60 words.
Do not promise a delivery date or claim that an action was completed.
If no approved order record is available, say that the order cannot be verified.
""".strip()


SUPPORT_SUMMARY_TEMPLATE = PromptTemplate(
    name="support_summary",
    template=(
        "Explain the {issue_type} request to a {audience}. "
        "Keep the answer below {word_limit} words."
    ),
    required_variables=("issue_type", "audience", "word_limit"),
)


def demonstrate_variable_errors() -> tuple[str, str]:
    """Return the two contract errors learners are expected to observe."""

    errors: list[str] = []
    attempts = (
        {"issue_type": "refund", "word_limit": 40},
        {
            "issue_type": "refund",
            "audience": "customer",
            "word_limit": 40,
            "tone": "friendly",
        },
    )

    for variables in attempts:
        try:
            SUPPORT_SUMMARY_TEMPLATE.render(variables)
        except ValueError as error:
            errors.append(str(error))

    return errors[0], errors[1]


def main() -> None:
    """Run every Prompt Engineering answer without making a model request."""

    print("Prompt Engineering Exercise 1")
    print(ORDER_STATUS_INSTRUCTIONS)

    print("\nPrompt Engineering Exercise 2")
    print(
        SUPPORT_SUMMARY_TEMPLATE.render(
            {
                "issue_type": "damaged item",
                "audience": "customer",
                "word_limit": 50,
            }
        )
    )

    print("\nPrompt Engineering Exercise 3")
    for error in demonstrate_variable_errors():
        print(error)


if __name__ == "__main__":
    main()
