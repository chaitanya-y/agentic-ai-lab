import type { LessonCodeExample } from "../lessonCodeExamples";

export const phase2CodeExamples: Record<
  string,
  Record<string, LessonCodeExample[]>
> = {
  "prompt-engineering": {
    "anatomy-of-a-prompt": [
      {
        title: "Keep instructions and customer input separate",
        file: "src/support_assistant/prompts.py",
        description: "Application instructions use the system role. The changing customer message remains in the user role.",
        code: `messages: list[BaseMessage] = [
    SystemMessage(content=instructions)
]

messages.append(HumanMessage(content=customer_message))`
      }
    ],
    "role-prompting": [
      {
        title: "Use a functional role",
        file: "Prompt excerpt",
        description: "The role establishes the domain. The remaining lines still define the behavior.",
        code: `You classify customer support requests for an online store.

Identify one supported issue type.
Extract an order number only when the customer supplied it.
List information the application still needs.`
      }
    ],
    "instruction-clarity": [
      {
        title: "Give the incomplete request a valid result",
        file: "src/support_assistant/prompts.py",
        description: "The model receives both the prohibition and the expected alternative.",
        code: `Extract a five digit order number only when the customer supplied it.
When no order number is present, return null and add order_id to
missing_information.`
      }
    ],
    "output-format-control": [
      {
        title: "Use a typed contract for application output",
        file: "src/support_assistant/models.py",
        description: "The schema is stronger than asking for JSON in prose, but the application still validates the values.",
        code: `class SupportRequest(BaseModel):
    issue_type: IssueType
    order_id: str | None = Field(
        default=None,
        pattern=r"^\\d{5}$",
    )
    requested_outcome: RequestedOutcome | None = None
    missing_information: list[str] = Field(default_factory=list)`
      }
    ],
    "constraint-specification": [
      {
        title: "Combine required, prohibited, and conditional behavior",
        file: "Prompt excerpt",
        description: "Each constraint has an observable result or a valid fallback.",
        code: `Return one supported issue type.
Do not invent an order number.
If the order number is missing, return null and request order_id.`
      }
    ],
    "prompt-patterns": [
      {
        title: "Role Pattern",
        file: "Prompt pattern and example",
        description: "Define a functional responsibility and then state the work that responsibility performs.",
        afterParagraph: 1,
        code: `Pattern
You are responsible for {functional responsibility} in {domain}.
Complete {task} using {allowed information}.
Return {required result}.

Example
You classify customer support requests for an online store.
Identify the issue as order status, damaged item, refund, or other.
Extract an order number only when the customer supplied it.
Return missing information instead of guessing.`
      },
      {
        title: "Template Pattern",
        file: "Prompt pattern and example",
        description: "Give every response the same named arrangement when downstream readers expect consistent fields.",
        afterParagraph: 2,
        code: `Pattern
Complete the following template using only {input source}.

{field one}
{field two}
{field three}

Use {missing value} when the source does not contain a value.

Example
Complete the following template using only the customer message.

Issue type
Order number
Missing information

Use null when the customer did not provide an order number.`
      },
      {
        title: "Meta Prompt Pattern",
        file: "Prompt pattern and example",
        description: "Use the model to draft a reusable prompt that an engineer will review and evaluate.",
        afterParagraph: 3,
        code: `Pattern
Write a reusable prompt for {task}.
The prompt must define {requirements}.
It must handle {edge cases}.
Optimize it for {measured behavior}.

Example
Write a reusable prompt for classifying customer support requests.
Define the four supported issue types and the required output fields.
Handle missing order numbers without inventing a value.
Optimize the prompt for classification accuracy and field completeness.`
      },
      {
        title: "Reasoning Pattern",
        file: "Prompt pattern and example",
        description: "Name the checks required for a decision and request only the final result with supporting evidence.",
        afterParagraph: 4,
        code: `Pattern
Evaluate {input} against {criteria}.
Check {required checks} before deciding.
Return {decision format} with the evidence used.

Example
Evaluate the proposed customer response against the approved context.
Check that the order number matches, every claim has a source, and no completed action was invented.
Return pass or fail with the identifiers of the supporting sources.`
      },
      {
        title: "Few Shot Pattern",
        file: "Prompt pattern and example",
        description: "Demonstrate difficult distinctions with representative input and output pairs.",
        afterParagraph: 5,
        code: `Pattern
Use the following examples to perform {task}.

Input
{example input}

Output
{example output}

Now process
{current input}

Example
Input
My package arrived with a cracked screen.

Output
Issue type is damaged item. Order number is missing.

Now process
I was charged twice for order 10492.`
      },
      {
        title: "Behavioral Boundary Pattern",
        file: "Prompt pattern and example",
        description: "State required behavior, prohibited behavior, and the valid fallback.",
        afterParagraph: 6,
        code: `Pattern
Always {required behavior}.
Do not {prohibited behavior}.
If {required information} is unavailable, {fallback behavior}.

Example
Always use facts from the approved order record.
Do not promise a delivery date or claim that a refund was completed.
If the order record is unavailable, explain that the order cannot be verified.`
      },
      {
        title: "Decomposition Pattern",
        file: "Prompt pattern and example",
        description: "Separate a combined task into operations whose inputs and outputs can be inspected.",
        afterParagraph: 7,
        code: `Pattern
Complete {task} in the following order.
First determine {operation one}.
Then inspect {operation two}.
Finally return {result}.

Example
Prepare a response for the damaged item request.
First identify the requested outcome and missing information.
Then inspect only the approved order record and damaged item policy.
Finally return a customer response supported by those sources.`
      },
      {
        title: "Critique Pattern",
        file: "Prompt pattern and example",
        description: "Review an initial answer against explicit criteria before returning the revision.",
        afterParagraph: 8,
        code: `Pattern
Draft {output} for {task}.
Review the draft for {criteria}.
Correct any violation.
Return only the revised output.

Example
Draft a response explaining the status of order 10492.
Review the draft for unsupported promises, missing source facts, and unnecessary wording.
Correct any violation.
Return only the revised customer response.`
      },
      {
        title: "Audience Adaptation Pattern",
        file: "Prompt pattern and example",
        description: "Adapt the explanation while preserving the verified facts.",
        afterParagraph: 9,
        code: `Pattern
Explain {information} for {audience}.
Use {vocabulary level} language.
Include {required details}.
Keep the response within {length}.

Example
Explain the verified shipping status for the customer.
Use familiar language and define any carrier term that may be unclear.
Include the order number, current status, and expected delivery when available.
Keep the response below 60 words.`
      },
      {
        title: "Scope Boundary Pattern",
        file: "Prompt pattern and example",
        description: "Define the supported domain and a useful response for requests outside it.",
        afterParagraph: 10,
        code: `Pattern
Handle only {supported scope}.
If a request is within scope, {supported behavior}.
If it is outside scope, {out of scope response}.

Example
Handle only order status, damaged item, and refund questions.
If a request is within scope, identify the issue and required information.
If it is outside scope, explain that this assistant cannot handle it and direct the customer to general support.`
      }
    ],
    "examples-in-prompts": [
      {
        title: "Render demonstrations before the current request",
        file: "src/support_assistant/prompts.py",
        description: "Examples are message pairs in the current request. They do not update model parameters.",
        code: `for example in prompt_examples():
    messages.extend([
        HumanMessage(content=example.customer_message),
        AIMessage(content=example.expected.model_dump_json()),
    ])

messages.append(HumanMessage(content=customer_message))`
      }
    ],
    "cross-model-prompt-design": [
      {
        title: "Select a provider behind one interface",
        file: "src/support_assistant/providers.py",
        description: "The application contract remains stable while the adapter creates OpenAI or Ollama model clients explicitly.",
        code: `if settings.provider == "openai":
    model = ChatOpenAI(
        model=settings.model,
        api_key=settings.openai_api_key,
    )
else:
    model = ChatOllama(
        model=settings.model,
        base_url=settings.ollama_host,
        format="json",
    )`
      }
    ],
    "build-a-prompt-library": [
      {
        title: "Define a small prompt contract",
        file: "src/support_assistant/prompt_practice.py",
        description: "The type stores a stable name, template text, and the required variables.",
        code: `@dataclass(frozen=True)
class PromptTemplate:
    name: str
    template: str
    required_variables: tuple[str, ...]`
      }
    ],
    "build-a-prompt-renderer": [
      {
        title: "Validate before rendering",
        file: "src/support_assistant/prompt_practice.py",
        description: "Missing and unexpected values fail before an API request is made.",
        code: `supplied = set(variables)
required = set(self.required_variables)
missing = sorted(required.difference(supplied))
unexpected = sorted(supplied.difference(required))

contract_errors = []
if missing:
    contract_errors.append("missing prompt variables: " + ", ".join(missing))
if unexpected:
    contract_errors.append("unexpected prompt variables: " + ", ".join(unexpected))
if contract_errors:
    raise ValueError(". ".join(contract_errors))

return self.template.format_map(dict(variables))`
      }
    ],
    "prompt-engineering-practice": [
      {
        title: "Step 01 Open the Phase 2 lab",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 0,
        description: "Run the clone command only when the repository is not already available. Then enter the Phase 2 lab folder.",
        code: `git clone https://github.com/chaitanya-y/agentic-ai-lab.git
cd agentic-ai-lab
cd labs/02-prompt-context-engineering/customer-support-assistant
uv sync --python 3.12`
      }
    ],
    "prompt-exercise-one": [
      {
        title: "Run your current prompt exercises",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "Run this command after saving practice/starter.py. The exercise makes no model call.",
        code: `uv run python practice/starter.py`
      }
    ],
    "prompt-exercise-two": [
      {
        title: "Run your current prompt exercises",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "The output should now include the rendered support summary template.",
        code: `uv run python practice/starter.py`
      }
    ],
    "prompt-exercise-three": [
      {
        title: "Run your completed prompt exercises",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "Confirm that both prompt contract errors are printed and the program completes.",
        code: `uv run python practice/starter.py`
      },
      {
        title: "Run the worked exercise answers",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "This local exercise makes no provider calls and requires no API key.",
        code: `uv run python practice/answers.py`
      },
      {
        title: "Run the prompt practice tests",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "These tests verify the prompt template, renderer, and variable contract.",
        code: `uv run pytest tests/test_prompt_practice.py`
      }
    ]
  },
  "context-engineering": {
    "context-budgets": [
      {
        title: "Reserve output before allocating input",
        file: "src/support_assistant/context_practice.py",
        description: "The available input capacity is derived from one explicit context window and output reserve.",
        code: `@dataclass(frozen=True)
class ContextBudget:
    context_window_tokens: int
    output_reserve_tokens: int

    @property
    def available_input_tokens(self) -> int:
        return self.context_window_tokens - self.output_reserve_tokens`
      }
    ],
    "source-selection-and-provenance": [
      {
        title: "Filter policy sources before generation",
        file: "src/support_assistant/context.py",
        description: "Audience, effective date, and topic checks happen in application code.",
        code: `if source.audience != "customer":
    excluded.append(ExcludedSource(
        source_id=source.source_id,
        reason="source audience is internal",
    ))
    continue

if request.issue_type not in source.topics:
    excluded.append(ExcludedSource(
        source_id=source.source_id,
        reason="source topic is unrelated",
    ))
    continue`
      }
    ],
    "conversation-history": [
      {
        title: "Keep the conversation as explicit runtime input",
        file: "src/support_assistant/workflow.py",
        description: "The caller supplies selected history. The model does not retain it between requests.",
        code: `result = run_support_workflow(
    model=model,
    customer_message=customer_message,
    authenticated_customer_id=customer_id,
    conversation_history=history,
    input_budget_tokens=settings.input_budget_tokens,
    output_reserve_tokens=settings.output_reserve_tokens,
)`
      }
    ],
    "dynamic-context-assembly": [
      {
        title: "Build context after request validation",
        file: "src/support_assistant/workflow.py",
        description: "The application authorizes and assembles evidence between the interpretation call and the response call.",
        code: `analysis = model.analyze(
    render_analysis_messages(customer_message, prompt_version),
    prompt_version.value,
)

context = build_context(
    request=analysis.value,
    authenticated_customer_id=authenticated_customer_id,
    conversation_history=conversation_history,
)

response_call = model.respond(
    render_response_messages(analysis.value, context),
    RESPONSE_PROMPT_VERSION,
)`
      }
    ],
    "context-observability": [
      {
        title: "Return an inspectable context report",
        file: "src/support_assistant/models.py",
        description: "The report records selection and budget decisions without requiring complete source text in ordinary run metadata.",
        code: `class ContextReport(BaseModel):
    rendered_context: str
    included_source_ids: list[str]
    excluded_sources: list[ExcludedSource]
    selected_conversation_turn_ids: list[str]
    estimated_input_tokens: int
    input_budget_tokens: int
    output_reserve_tokens: int`
      }
    ],
    "build-context-budget-manager": [
      {
        title: "Allocate optional components by priority",
        file: "src/support_assistant/context_practice.py",
        description: "Required input is preserved first. Optional input that does not fit is reported as excluded.",
        code: `required_tokens = sum(item.token_count for item in required)
if required_tokens > budget.available_input_tokens:
    raise RequiredContextDoesNotFit(
        "required context exceeds the available input budget"
    )

included = list(required)
used_tokens = required_tokens
for component in optional:
    if used_tokens + component.token_count <= budget.available_input_tokens:
        included.append(component)
        used_tokens += component.token_count
    else:
        excluded.append(component)`
      }
    ],
    "build-source-selector": [
      {
        title: "Apply metadata rules in application code",
        file: "src/support_assistant/context.py",
        description: "Audience, dates, and topics are checked before any policy content reaches the model.",
        code: `if source.audience != "customer":
    reason = "internal audience"
elif source.effective_from and source.effective_from > as_of:
    reason = "not yet effective"
elif source.effective_until and source.effective_until < as_of:
    reason = "expired"
elif issue_type not in source.topics:
    reason = "unrelated topic"`
      }
    ],
    "build-conversation-selector": [
      {
        title: "Remove turns tied only to an old order",
        file: "src/support_assistant/context.py",
        description: "The current order identifier keeps a stale earlier result out of the next model request.",
        code: `for turn in list(turns)[-maximum_turns:]:
    mentioned_ids = set(ORDER_ID_PATTERN.findall(turn.content))
    if current_order_id and mentioned_ids and current_order_id not in mentioned_ids:
        continue
    selected.append(turn)`
      }
    ],
    "test-context-assembly": [
      {
        title: "Test the correction without a model call",
        file: "tests/test_context.py",
        description: "The test proves which history enters the context and which stale result remains outside it.",
        code: `history = load_conversation("corrected_order")
report = build_context(
    request=damaged_request(order_id="10429"),
    authenticated_customer_id="customer_001",
    conversation_history=history,
    as_of=date(2026, 9, 6),
)

assert "turn_correction" in report.selected_conversation_turn_ids
assert "turn_old_result" not in report.selected_conversation_turn_ids`
      }
    ],
    "context-engineering-lab": [
      {
        title: "Step 01 Open the Phase 2 lab",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 0,
        description: "Run the clone command only when the repository is not already available. Then enter the Phase 2 lab folder.",
        code: `git clone https://github.com/chaitanya-y/agentic-ai-lab.git
cd agentic-ai-lab
cd labs/02-prompt-context-engineering/customer-support-assistant
uv sync --python 3.12`
      }
    ],
    "context-exercise-one": [
      {
        title: "Run the context starter",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "Run the file after saving Exercise 1. No model call is made.",
        code: `uv run python practice/context_starter.py`
      }
    ],
    "context-exercise-two": [
      {
        title: "Run the context starter",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "The output should now include the context allocation and remaining input budget.",
        code: `uv run python practice/context_starter.py`
      }
    ],
    "context-exercise-three": [
      {
        title: "Run the context starter",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "Inspect each included policy and every exclusion reason.",
        code: `uv run python practice/context_starter.py`
      }
    ],
    "context-exercise-four": [
      {
        title: "Run the context starter",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "Inspect the selected conversation turn identifiers.",
        code: `uv run python practice/context_starter.py`
      }
    ],
    "context-exercise-five": [
      {
        title: "Run the completed context exercises",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "The final output should identify the unsupported policy citation.",
        code: `uv run python practice/context_starter.py`
      },
      {
        title: "Run the worked Context Engineering answers",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "These exercises make no provider calls and require no API key or local model.",
        code: `uv run python practice/context_answers.py`
      },
      {
        title: "Run the context tests",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "The tests verify budgets, source policies, record ownership, history selection, and citation checks.",
        code: `uv run pytest tests/test_context.py tests/test_context_practice.py`
      },
      {
        title: "Run a request with a correction",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "Inspect selected conversation turns, excluded sources, and the final evidence list.",
        code: `uv run support-assistant "Use the corrected order number 10429." --conversation corrected_order`
      }
    ]
  },
  "prompt-injection-and-trust-boundaries": {
    "trust-boundaries": [
      {
        title: "Authorize the record before context assembly",
        file: "src/support_assistant/context.py",
        description: "The trusted customer identity comes from application state rather than model output.",
        code: `order = next(
    (item for item in orders if item.order_id == order_id),
    None,
)
if order is None or order.customer_id != authenticated_customer_id:
    raise PermissionError("order is unavailable")

return order`
      }
    ],
    "output-and-action-controls": [
      {
        title: "Reject an action the application never performed",
        file: "src/support_assistant/validation.py",
        description: "Generated language cannot create a refund or replacement state change.",
        code: `prohibited_claims = (
    "refund has been issued",
    "refund has been approved",
    "replacement has been ordered",
)
if any(claim in response.message.casefold() for claim in prohibited_claims):
    raise ProhibitedActionClaim(
        "response claims an action the application did not perform"
    )`
      }
    ],
    "trust-boundaries-lab": [
      {
        title: "Step 01 Open the Phase 2 lab",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 0,
        description: "Run the clone command only when the repository is not already available. Then enter the Phase 2 lab folder.",
        code: `git clone https://github.com/chaitanya-y/agentic-ai-lab.git
cd agentic-ai-lab
cd labs/02-prompt-context-engineering/customer-support-assistant
uv sync --python 3.12`
      }
    ],
    "trust-exercise-two": [
      {
        title: "Run the trust boundary tests",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 0,
        description: "The tests cover direct input, source filtering, record ownership, and unsupported action claims.",
        code: `uv run pytest tests/test_trust_boundaries.py tests/test_context.py tests/test_validation.py`
      }
    ],
    "trust-exercise-three": [
      {
        title: "Run the new regression test",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "Run the new test by name, then remove the filter to run the complete trust boundary file.",
        code: `uv run pytest tests/test_trust_boundaries.py -k quoted_injection_text
uv run pytest tests/test_trust_boundaries.py`
      }
    ]
  },
  "prompt-evaluation": {
    "deterministic-graders": [
      {
        title: "Score observable application behavior",
        file: "src/support_assistant/evaluation.py",
        description: "Every case reports field, outcome, evidence, and response checks separately.",
        code: `checks = {
    "issue_type": issue_type == case.expected_issue_type,
    "order_id": order_id == case.expected_order_id,
    "outcome": result.response.outcome == case.expected_outcome,
    "required_evidence": set(case.required_evidence_ids).issubset(evidence_ids),
    "forbidden_evidence": evidence_ids.isdisjoint(case.forbidden_evidence_ids),
    "forbidden_message": all(
        phrase.casefold() not in normalized_message
        for phrase in case.forbidden_message_phrases
    ),
}`
      }
    ],
    "evaluation-lab": [
      {
        title: "Step 01 Open the Phase 2 lab",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 0,
        description: "Run the clone command only when the repository is not already available. Then enter the Phase 2 lab folder.",
        code: `git clone https://github.com/chaitanya-y/agentic-ai-lab.git
cd agentic-ai-lab
cd labs/02-prompt-context-engineering/customer-support-assistant
uv sync --python 3.12`
      }
    ],
    "evaluation-exercise-one": [
      {
        title: "Run the local scoring exercise",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "Run the starter after saving the criteria and the two score calls. No model call is made.",
        code: `uv run python practice/starter.py`
      }
    ],
    "evaluation-exercise-two": [
      {
        title: "Run the local evaluation exercises",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "Run your completed starter first, then compare it with the worked implementation. Neither command makes a model call.",
        code: `uv run python practice/starter.py
uv run python practice/answers.py`
      }
    ],
    "evaluation-exercise-four": [
      {
        title: "Evaluate a small development set",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "These commands make live model calls. They keep the provider, model, cases, and limits unchanged while saving each prompt version separately.",
        code: `uv run support-eval --split development --limit 4 --prompt-version support-analysis.baseline.v1 --output .artifacts/eval-baseline.json
uv run support-eval --split development --limit 4 --prompt-version support-analysis.revised.v1 --output .artifacts/eval-revised.json
uv run support-eval --split development --limit 4 --prompt-version support-analysis.few-shot.v1 --output .artifacts/eval-few-shot.json`
      }
    ],
    "evaluation-exercise-five": [
      {
        title: "Evaluate the held out set",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "This example uses the revised prompt. Replace the prompt version when your development results selected another version.",
        code: `uv run pytest
uv run support-eval --split held_out --limit 12 --prompt-version support-analysis.revised.v1 --output .artifacts/eval-held-out.json`
      }
    ]
  },
  "customer-support-response-assistant": {
    "project-architecture": [
      {
        title: "Keep the model inside a fixed workflow",
        file: "src/support_assistant/workflow.py",
        description: "The first call interprets the request. Application code builds context. The second call writes from approved evidence.",
        code: `analysis = model.analyze(
    render_analysis_messages(customer_message, prompt_version),
    prompt_version.value,
)
request = analysis.value

context = build_context(
    request=request,
    authenticated_customer_id=authenticated_customer_id,
    conversation_history=conversation_history,
)

response_call = model.respond(
    render_response_messages(request, context),
    RESPONSE_PROMPT_VERSION,
)`
      }
    ],
    "project-setup": [
      {
        title: "Step 01 Prepare the Phase 2 lab",
        file: "macOS Terminal",
        intent: "practice",
        afterParagraph: 0,
        description: "Run the clone command only when the repository is not already available. Then prepare the Phase 2 lab.",
        code: `git clone https://github.com/chaitanya-y/agentic-ai-lab.git
cd agentic-ai-lab
cd labs/02-prompt-context-engineering/customer-support-assistant
cp .env.example .env
uv sync --python 3.12
uv run pytest`
      },
      {
        title: "Step 01 Prepare the Phase 2 lab",
        file: "Windows PowerShell",
        intent: "practice",
        afterParagraph: 0,
        description: "Run the clone command only when the repository is not already available. Then prepare the Phase 2 lab.",
        code: `git clone https://github.com/chaitanya-y/agentic-ai-lab.git
cd agentic-ai-lab
cd labs/02-prompt-context-engineering/customer-support-assistant
Copy-Item .env.example .env
uv sync --python 3.12
uv run pytest`
      }
    ],
    "run-and-observe": [
      {
        title: "Run the default request",
        file: "Terminal or PowerShell",
        intent: "practice",
        description: "Read all four output sections before trying another message.",
        code: `uv run support-assistant`
      },
      {
        title: "Run a damaged item request",
        file: "Terminal or PowerShell",
        intent: "practice",
        description: "The response should use the authenticated order and current damaged item policy.",
        code: `uv run support-assistant "Order 10429 arrived with a cracked screen. What should I do?"`
      }
    ]
  }
};
