# Phase 2 Implementation Design

## Purpose

Phase 2 teaches software engineers how to design model instructions, assemble permitted runtime context, protect application boundaries, and measure whether a change improved behavior. It extends Phase 1 without modifying the published Phase 1 lab.

The phase is named **Prompt Engineering and Context Engineering**. It contains five lessons and approximately 10.5 hours of core work.

## Boundaries

The Phase 2 lab lives at:

`labs/02-prompt-context-engineering/customer-support-assistant`

The lab is independent from the Phase 1 code. It reuses familiar customer support scenarios so learners can focus on prompt and context decisions.

Phase 1 already teaches reasoning models, sampling controls, provider structured output, Pydantic validation, and prompt caching. Phase 2 uses these capabilities but does not teach them again.

Conversation history appears as one source of runtime context. Persistent memory, application state, checkpoints, pause and resume, and durable execution remain in Phase 5. Retrieval remains in Phase 3. Tools and MCP remain in Phase 4. Broader production evaluation, observability, safety, and release management remain in Phase 6.

## Curriculum

| Lesson | Subject | Practical result | Time |
| --- | --- | --- | ---: |
| 01 | Prompt Engineering | A reusable prompt renderer with explicit examples and inputs | 1.5 hours |
| 02 | Context Engineering | An inspectable context builder with source and budget reports | 3 hours |
| 03 | Prompt Injection and Trust Boundaries | Adversarial fixtures that cannot bypass application controls | 1.5 hours |
| 04 | Prompt Evaluation | A small evaluation runner and comparison report | 2 hours |
| 05 | Customer Support Response Assistant | A fixed workflow using all Phase 2 components | 2.5 hours |
| **Total** | | | **10.5 hours** |

Each lesson begins with its named concept and definition. It explains the mechanism, engineering relevance, realistic examples, limitations, code, practical work, expected results, and failure cases. Code appears beside the concept it demonstrates.

## Teaching progression

Prompt Engineering treats a prompt as an application interface. Learners define the task, message roles, inputs, output behavior, constraints, and incomplete path. Zero shot, one shot, few shot, and example selection are taught inside this lesson because demonstrations are part of prompt design.

Context Engineering distinguishes instructions from the complete information supplied during inference. Learners work with context windows, budgets, provenance, ordering, compression, conversation history, memory boundaries, dynamic assembly, and observability.

Prompt Injection and Trust Boundaries focuses on malicious instructions and application controls. It does not repeat how source selection works. Instead, learners use the existing context selector and verify that untrusted content cannot grant permission or cause unsupported actions.

Prompt Evaluation owns datasets, graders, prompt comparisons, and failure analysis. Prompt Engineering introduces testable requirements but does not duplicate the complete evaluation workflow.

The Customer Support Response Assistant connects the components. Its lesson focuses on the files to inspect, commands to run, trace fields to observe, and failures to diagnose rather than teaching the preceding definitions again.

## Application flow

The complete path uses two model calls when sufficient information is present.

1. The application receives a customer message and optional conversation history.
2. The first model call produces a typed `SupportRequest`.
3. Application code validates the request and checks required information.
4. Application code loads the permitted synthetic order and policy sources.
5. The context builder selects relevant history and evidence, records exclusions, and enforces the input budget.
6. The second model call produces a typed `SupportResponse`.
7. Application code checks source identifiers, order references, and unsupported action claims.
8. The trace records prompts, selected context, validation outcomes, usage, latency, and completion reason.

A request with missing essential information stops after the first call. Provider failures, invalid structure, unauthorized data, and unsupported answers follow distinct failure paths.

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
  practice/
    starter.py
    answers.py
    context_starter.py
    context_answers.py
  src/support_assistant/
    config.py
    context.py
    context_practice.py
    evaluation.py
    models.py
    prompt_practice.py
    prompts.py
    providers.py
    validation.py
    workflow.py
  tests/
```

`prompts.py` renders versioned instructions and examples. `context.py` selects runtime information. `models.py` defines contracts. `validation.py` checks deterministic invariants. `providers.py` creates the selected model. `workflow.py` owns the fixed sequence. `evaluation.py` runs bounded cases and writes a readable report.

The lab recommends Python 3.12 and supports Python 3.11 or newer. OpenAI and optional Ollama with `qwen3:14b` use the LangChain model interface introduced in Phase 1.

## Prompt design

The lab contains baseline, revised, and few shot prompt variants. Prompt examples are separate from development and held out evaluation cases.

The prompt renderer uses named inputs and rejects missing or unexpected values before a model call. Instructions, demonstrations, customer input, supplied context, and the response contract remain visibly separate. Formatting helps organization but is not presented as a security boundary.

## Context design

Policy fixtures include current, expired, future, internal, unrelated, and adversarial records. Metadata selection records every included and excluded source before generation.

Conversation fixtures include a corrected order identifier and stale assistant output. The selector preserves the correction while excluding information tied only to the abandoned order. The lab does not persist conversation data across runs.

The context budget reserves output capacity before allocating input components. Required components cannot be silently removed. Optional components are considered by priority and every exclusion is reported.

## Trust boundaries

The authenticated customer identifier enters outside model control. Application code authorizes order access and source audiences before data reaches the model.

The model may interpret untrusted text but cannot grant itself authority, retrieve an unauthorized record, or claim that an unavailable business action occurred. Tests cover direct injection, indirect injection, restricted sources, unsupported citations, and unsupported action claims.

## Evaluation design

Prompt examples, development cases, and held out cases have separate identifiers and purposes. Deterministic checks cover structured fields, source membership, completion outcomes, and forbidden actions. Human review covers groundedness, completeness, and clarity where exact code is insufficient.

The report records case counts, prompt and model versions, failures, usage when available, and latency. Results from the teaching dataset are not described as production accuracy.

## Website implementation

Phase 2 lesson data lives in `web/lib/phases/phase2.ts`. Code examples live in `web/lib/phases/phase2CodeExamples.ts`. The review pages derive their lesson list from the same five lesson slugs.

Each lesson has professional sidebar topics, real examples, adjacent code, glossary tooltips, and hands on work. The useful visuals are prompt boundaries, context budgets and selection, conversation history selection, trust boundaries, the evaluation loop, and the complete fixed workflow.

Phase 2 remains a development preview with `noindex` metadata until a separate release decision publishes it.

## Verification

Offline Python tests cover prompt rendering, context inclusion and exclusion, history correction, budget overflow, semantic validation, injection boundaries, provider selection, workflow stopping paths, evaluation scoring, and trace fields.

The website build verifies TypeScript and static route generation. Browser review covers the five lesson links, sidebar navigation, code blocks, examples, solutions, lesson pagination, review access, and the production access gate.

No `.env`, API key, generated evaluation output, virtual environment, or cache may be tracked.

## Completion criteria

The implementation is complete when all five lessons are readable through the development preview, the lab tests run without a provider key, the website build succeeds, and obsolete lesson routes are absent from generated pages and navigation.

The learner completes Phase 2 when they can explain the difference between prompts and context, select useful demonstrations, inspect selected and excluded information, identify a prompt injection boundary, compare prompt variants using fixed cases, and run the complete customer support response workflow.
