# Phase 2 Implementation Design

## Purpose

Phase 2 teaches software engineers how to design model requests, assemble permitted context, validate model output, and measure whether a change improved an application. It extends the skills introduced in Phase 1 without modifying the published Phase 1 lab.

The phase is named **Prompt Engineering, Context Engineering, and Structured Outputs**. It contains seven lessons and approximately 14 hours of core work. Every lesson includes practical work that contributes to one standalone customer support application.

## Approved boundaries

The implementation will create a new lab at:

`labs/02-prompt-context-engineering/customer-support-assistant`

The new lab will not import code from the Phase 1 lab. It may reuse familiar domain ideas, such as support requests and order records, so learners can focus on the Phase 2 concepts. Phase 1 files and commands must continue to work unchanged.

Phase 2 includes conversation history only as one source of model context. It covers history selection, trimming, summaries, corrections, and token budgets. It does not implement application state, persistent memory, checkpoints, pause and resume, or durable execution. Those remain in Phase 5.

Retrieval remains in Phase 3. Tool calling and MCP remain in Phase 4. Agent loops, LangGraph, durable execution, and specialist agents remain in Phase 5. Broad production evaluation, observability, red teaming, and release monitoring remain in Phase 6.

## Curriculum

| Lesson | Subject | Practical result | Time |
| --- | --- | --- | ---: |
| 01 | Prompt Engineering | A versioned task specification and baseline prompt comparison | 1.5 hours |
| 02 | In Context Learning and Reasoning | A measured zero shot and few shot comparison | 2 hours |
| 03 | Structured Outputs and Validation | A typed response contract with explicit failure paths | 2 hours |
| 04 | Context Engineering | An inspectable context builder with source and budget reports | 2.5 hours |
| 05 | Prompt Injection and Trust Boundaries | Adversarial fixtures that cannot bypass application controls | 1.5 hours |
| 06 | Prompt Evaluation | A small evaluation runner and comparison report | 2 hours |
| 07 | Customer Support Response Assistant | A complete fixed workflow using all Phase 2 components | 2.5 hours |
| **Total** | | | **14 hours** |

Each lesson begins with the named concept and its definition. It then explains the mechanism, engineering relevance, realistic example, limitations, code, practical task, expected result, failure cases, tests, and completion checkpoint. Code appears beside the concept it demonstrates. A definition does not receive artificial code when inspection or comparison is the more useful exercise.

## Teaching progression

Lesson 01 defines prompting as application interface design. Learners specify the task, allowed evidence, missing information behavior, and response requirements before changing the prompt. They compare a baseline with one targeted revision while holding the model and dataset constant.

Lesson 02 explains zero shot, one shot, few shot, example selection, reasoning models, and task decomposition. Learners compare prompt variants against the same cases. The lesson does not require hidden chain of thought or present one reasoning phrase as universally effective.

Lesson 03 distinguishes free text, requested JSON, provider structured output, local parsing, schema validation, and semantic validation. Learners handle missing and nullable values, refusals, incomplete generation, parsing errors, schema errors, and unsupported facts as different outcomes.

Lesson 04 defines context engineering and distinguishes it from prompt engineering. Learners select permitted sources, track provenance, order evidence, reserve output tokens, select conversation history, and inspect a context budget. Fixed policy fixtures are used here so retrieval mechanics remain in Phase 3.

Lesson 05 defines direct and indirect prompt injection. Learners place malicious instructions in customer input and supplied policy content. The application prevents restricted data and actions from becoming available regardless of whether the model follows the malicious text.

Lesson 06 introduces a small development and evaluation dataset, exact checks, a human review rubric, failure categories, prompt versions, and regression comparison. It does not introduce a hosted evaluation platform or treat model judging as authoritative.

Lesson 07 connects the preceding components into one fixed application workflow. It is not described as an autonomous agent because application code controls the sequence.

## Application flow

The complete path uses two model calls when sufficient information is present.

1. The application receives a customer message and optional supplied conversation history.
2. The first model call produces a typed `SupportRequest`.
3. Application code checks completion, parsing, schema validity, and required information.
4. Application code loads the permitted local order facts and selects eligible policy fixtures by metadata.
5. The context builder selects relevant history and evidence, labels each source, orders the request, and enforces the configured budget.
6. The second model call produces a typed `SupportResponse` containing its status, message, evidence identifiers, and missing information.
7. Application code checks that evidence identifiers exist, the referenced order is permitted, required evidence is present, and the response does not claim an unsupported application action.
8. The run trace records provider, model, prompt versions, schema version, selected evidence, excluded evidence and reasons, token usage when available, latency, validation outcomes, and completion reason.

A request with missing essential information stops after the first call and returns a clarification outcome. A provider error, incomplete generation, invalid structure, or unsupported answer follows a distinct failure path. The program does not silently retry missing evidence or manufacture a replacement value.

## Domain contracts

The lab uses a small set of explicit Pydantic models.

`SupportRequest` records the issue type, optional order identifier, requested outcome, and missing information. Optional identifiers use an explicit default of `None` so the Python contract matches the intended behavior.

`EvidenceSource` records a stable source identifier, source type, audience, effective date, version, content, and trust classification. Source authority for a fact does not grant instruction authority.

`ContextReport` records included and excluded sources, exclusion reasons, estimated or provider measured tokens, the configured input budget, and the output reserve.

`SupportResponse` records an outcome such as answered, needs information, or cannot answer. It also contains the customer message, evidence identifiers, and missing information. A valid schema is treated as a structural result, not proof that the answer is true.

`RunTrace` records the model calls and deterministic application stages without storing unrestricted secrets or credentials.

## Repository structure

```text
labs/02-prompt-context-engineering/customer-support-assistant/
  .env.example
  README.md
  pyproject.toml
  uv.lock
  fixtures/
    conversations.json
    evaluation_cases.json
    orders.json
    policies.json
  src/support_assistant/
    __init__.py
    config.py
    context.py
    evaluation.py
    models.py
    prompts.py
    providers.py
    validation.py
    workflow.py
  tests/
    test_context.py
    test_evaluation.py
    test_prompts.py
    test_providers.py
    test_trust_boundaries.py
    test_validation.py
    test_workflow.py
```

Files have one clear responsibility. `prompts.py` renders versioned instructions and examples. `context.py` selects and reports context. `models.py` defines contracts. `validation.py` checks deterministic invariants. `providers.py` creates the selected model and normalizes available metadata. `workflow.py` owns the fixed sequence. `evaluation.py` runs bounded cases and writes a readable report.

The lab recommends Python 3.12 and supports Python 3.11 or newer. `uv` manages the environment. OpenAI and Ollama use the LangChain model interface already introduced in Phase 1. The core path requires only one provider. Ollama with `qwen3:14b` remains optional.

## Prompt versions and examples

The lab contains explicit prompt versions rather than one prompt that learners repeatedly overwrite. The initial variants are a baseline task prompt, a revised task specification, and a revised prompt with representative examples.

Prompt examples are separate from development and final evaluation cases. The example set includes ordinary, ambiguous, incomplete, and boundary inputs. It also contains a case in which a misleading example makes performance worse, demonstrating that adding examples is not automatically an improvement.

The prompt renderer uses named inputs and rejects missing variables before a model call. Instructions, examples, current customer input, context sources, and the response contract remain visibly separated. Markdown or XML structure is presented as organization, not as a security boundary.

## Context fixtures

The policy fixtures include a current customer facing policy, an expired policy, an internal note, an irrelevant policy, a policy with an exception, and a customer facing document containing an injected instruction. Metadata selection excludes sources that are expired, internal, unrelated, or unavailable to the current request.

The conversation fixtures include a short request, a long conversation, a corrected order identifier, stale assistant text, and a compact summary that drops an important qualifier. Learners compare the complete history, a recent window, and a supplied summary. The lab does not persist this information across program runs.

The order fixtures contain only synthetic data. Application code uses the authenticated customer identifier supplied outside model control to select an order. The model never chooses the authenticated identity.

## Validation and failure handling

Validation occurs in layers.

1. Request completion verifies that the provider returned a completed response rather than a refusal, timeout, or output limit condition.
2. Parsing verifies that a response can be converted to the expected representation.
3. Schema validation checks field types, allowed values, required fields, nullable values, and cross field rules.
4. Semantic validation checks identifiers and evidence against the supplied fixtures and application invariants.
5. Evaluation compares observed behavior with case specific expectations.

Retries are bounded and limited to provider or formatting failures where a repeat may reasonably help. Missing source data, failed authorization, and unsupported claims do not trigger a model retry. Error messages and traces name the actual failure category instead of reducing every failure to `ValueError`.

## Provider behavior

OpenAI and Ollama share the application contracts and workflow but may use different structured output mechanisms. Provider specific handling remains contained in `providers.py`. The application records which mechanism was used and validates the result locally in both cases.

No test makes a paid API call by default. Live OpenAI evaluation requires both an API key and an explicit `ALLOW_PAID_API_CALLS=true` setting. Ollama evaluation checks that the local service and selected model are available before starting. Live runs use a bounded case limit.

Provider guidance that changes by model, API, or date appears in a short note near the relevant concept. The lesson does not promise that temperature zero is deterministic, that a fixed number of examples is ideal, or that one reasoning instruction works across models.

## Evaluation design

The repository includes a small synthetic dataset divided into prompt examples, development cases, and held out evaluation cases. Cases cover normal order status, damaged items, refund questions, ambiguous intent, missing identifiers, corrected identifiers, conflicting evidence, insufficient evidence, expired sources, restricted sources, direct injection, indirect injection, and schema valid but unsupported output.

Deterministic checks measure fields, evidence membership, exclusion rules, completion outcomes, and forbidden actions. A short human rubric covers groundedness, completeness, clarity, and unsupported claims. Model based judging may appear as optional reading but is not required to complete the core lab.

The evaluation report records counts as well as percentages, prompt and model versions, case identifiers, observed failures, usage when available, and latency. It distinguishes offline tests from live model evaluation. A result from this teaching dataset is not described as production accuracy.

## Website implementation

The current Phase 2 placeholders in `web/lib/curriculum.ts` will be replaced with seven complete lessons. The Phase 2 lesson data should live in a dedicated module so the already large curriculum file does not become harder to maintain.

Each lesson receives professional sidebar topics, real examples, adjacent code snippets, runnable commands where appropriate, glossary tooltips, and a completion checkpoint. Visuals are limited to relationships that are easier to understand graphically:

- Prompt components and instruction boundaries
- The structured output validation stages
- Context sources and token budget
- Conversation history selection
- Instructions, untrusted data, and application controls
- The prompt evaluation loop
- The complete fixed application workflow

A development review page at `/review/phase-2` lists all seven lessons and links to their preview pages. Phase 2 is available on local development and the Vercel `dev` branch preview, with `noindex` metadata. It remains unavailable on the production `main` deployment until a separate release change adds its phase identifier to the published set.

The lab panel points to the Phase 2 folder. During development review, repository links use the `dev` branch. The release change updates them to `main` after the implementation is merged.

## Tests and verification

Offline Python tests cover prompt rendering, schema behavior, context inclusion and exclusion, history correction, token budget overflow, semantic validation, direct and indirect injection boundaries, provider selection, workflow stopping paths, evaluation scoring, and trace fields.

The website build verifies TypeScript, static route generation, and lesson data. Browser review covers desktop and mobile layouts, sidebar navigation, notes across multiple paragraphs, code block spacing, glossary tooltips, lesson pagination, review access, and the production access gate.

Final verification includes:

- All Phase 1 Python tests remain unchanged and pass
- All Phase 2 offline tests pass without a provider key
- The Phase 2 OpenAI and Ollama setup instructions match the actual entry points
- One bounded live provider run is performed only when explicitly authorized
- The website production build succeeds
- Phase 2 is visible locally and on the dev preview
- Phase 2 remains unavailable on the production main configuration
- No `.env`, API key, generated evaluation output, virtual environment, or cache is tracked

## Research basis

The curriculum adapts relevant concepts and experiment ideas from [AI Engineering from Scratch Prompt Engineering](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/11-llm-engineering/01-prompt-engineering/docs/en.md), [Few Shot and Reasoning](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/11-llm-engineering/02-few-shot-cot/docs/en.md), [Structured Outputs](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/11-llm-engineering/03-structured-outputs/docs/en.md), [Context Engineering](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/11-llm-engineering/05-context-engineering/docs/en.md), and [Evaluation](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/11-llm-engineering/10-evaluation/docs/en.md). Explanations, examples, application design, and code will be original to Agentic AI Lab.

Current behavior and recommendations are checked against primary documentation. Important sources include [OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering), [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [OpenAI evaluation guidance](https://developers.openai.com/api/docs/guides/evaluation-best-practices), [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [Anthropic prompt injection guidance](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks), [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output), [LangChain structured model output](https://docs.langchain.com/oss/python/langchain/models#structured-output), and [Pydantic field behavior](https://docs.pydantic.dev/latest/concepts/fields/).

The reference curriculum is not treated as the authority for current provider behavior. Broad claims, simulated results, fixed prompting recipes, model identifiers, and API examples are independently checked before they are used.

## Completion criteria

The implementation is complete when all seven lessons are readable through the development preview, every lesson has meaningful practical work, the standalone lab and offline tests run from documented commands, the fixed workflow handles its required success and failure cases, the evaluation report is reproducible, the website build passes, and the production access gate remains closed until release approval.

The learner completes Phase 2 when they can explain the difference between prompts and context, compare prompt variants using fixed cases, validate model output beyond its schema, inspect selected and excluded context, identify a prompt injection boundary, and run the complete customer support response workflow with either OpenAI or Ollama.
