# Phase 2 Curriculum Design

Prompt Engineering and Context Engineering

Updated for Agentic AI Lab on September 6, 2026.

## Recommendation

Phase 2 contains five lessons and approximately 12 hours of core work. Prompt Engineering and Context Engineering are the main teaching sections. Prompt Injection and Prompt Evaluation remain separate because they develop security and measurement skills that should not be reduced to short notes inside the main lessons.

Phase 1 already teaches reasoning models, sampling controls, provider structured output, Pydantic validation, and prompt caching. Phase 2 applies those concepts without teaching them again.

The phase answers one practical question.

> How should an application instruct a language model, choose the information supplied to it, and measure whether the result meets the product requirement?

## Starting point and intended outcome

Learners should enter this phase able to call a language model, inspect message roles, use a structured response, and run the Phase 1 customer service agent. The existing Python and uv setup is sufficient.

By the end, learners should be able to write and version prompts, select representative examples, assemble and inspect context, manage relevant conversation history, recognise prompt injection, and compare prompt changes against fixed cases. They should also be able to identify whether a failure came from the instructions, supplied evidence, model behavior, or application code.

## Lesson sequence and time

Times include reading, examining code, completing exercises, running tests, and inspecting results.

| Lesson | Page title | Concepts and reading | Implementation | Testing and analysis | Total |
| --- | --- | ---: | ---: | ---: | ---: |
| 01 | Prompt Engineering | 90 min | 60 min | 30 min | 3 hours |
| 02 | Context Engineering | 90 min | 60 min | 30 min | 3 hours |
| 03 | Prompt Injection and Trust Boundaries | 30 min | 30 min | 30 min | 1.5 hours |
| 04 | Prompt Evaluation | 30 min | 60 min | 30 min | 2 hours |
| 05 | Customer Support Response Assistant | 15 min | 90 min | 45 min | 2.5 hours |
| **Core total** | | **4.25 hours** | **5 hours** | **2.75 hours** | **12 hours** |

## 01 Prompt Engineering

**Outcome**

Turn an application requirement into direct model instructions with explicit inputs, examples, constraints, and expected output behavior.

**Topics**

- Prompt Engineering
- The Prompting Problem
- Prompt Anatomy and Message Roles
- Role Prompting
- Instruction Clarity
- Output Format Control
- Constraint Specification
- Prompt Patterns
- Examples in Prompts
- Example Selection
- Prompt Anti Patterns
- Cross Model Prompt Design
- Prompt Libraries and Rendering

The lesson begins with a definition and treats a prompt as a software interface rather than a clever question. It explains how stable instructions, changing customer input, examples, output requirements, and request configuration fit together.

Zero shot, one shot, and few shot prompting are taught as part of prompt design. Examples are added only when they demonstrate a measured failure or an important decision boundary. Evaluation datasets remain outside the prompt lesson so demonstrations are not confused with scored cases.

**Hands on work**

Learners improve one vague instruction, create a reusable template, and validate its variables before inference. They inspect the baseline, revised, and few shot prompt variants but leave full comparison and scoring to the Prompt Evaluation lesson.

## 02 Context Engineering

**Outcome**

Construct and inspect a model request containing sufficient, relevant, permitted information.

**Topics**

- Context Engineering
- The Context Problem
- Context Windows and Components
- Context Budgets
- Source Selection and Provenance
- Context Ordering
- Position Effects
- Context Compression
- Conversation History
- Memory Systems
- Dynamic Context Assembly
- Context Observability

The lesson distinguishes instructions from the complete runtime context. Context can include the current request, examples, conversation history, authenticated records, document excerpts, tool definitions, and tool results.

Conversation history is one context source. Persistent memory, application state, checkpoints, and durable workflows remain in Phase 5. Retrieval algorithms and vector databases remain in Phase 3.

**Hands on work**

Learners calculate a context budget, allocate required and optional components, select permitted sources, preserve an order correction in conversation history, and reject citations to sources that were not supplied. The application reports included and excluded information instead of silently truncating required context.

## 03 Prompt Injection and Trust Boundaries

**Outcome**

Recognise malicious instructions in untrusted input and preserve application controls even when a model follows them.

**Topics**

- Prompt Injection
- Direct and Indirect Injection
- Trust Boundaries
- Instruction and Data Separation
- Least Privilege
- Output and Action Controls
- Defense in Depth

Context Engineering decides which information enters a request. This lesson focuses on what happens when supplied content attempts to change the task, obtain restricted information, or cause an unsupported action.

**Hands on work**

Learners test direct injection, injected source content, unauthorized records, and unsupported action claims. The tests prove that authorization and action controls remain effective without depending on the model to identify every attack.

## 04 Prompt Evaluation

**Outcome**

Make a defensible prompt or context change using reproducible comparisons and inspected failures.

**Topics**

- Prompt Evaluation
- Success Criteria
- Evaluation Datasets
- Deterministic Graders
- Model Graders and Human Review
- Controlled Comparisons
- Failure Analysis

Prompt Engineering defines intended behavior. Prompt Evaluation measures that behavior across representative cases. Demonstrations, development cases, and held out cases remain separate.

**Hands on work**

Learners run baseline, revised, and few shot prompts against the same development cases. They inspect field level checks, token usage, latency, and failures before selecting a version. They then use the held out cases once to check whether the decision generalizes.

## 05 Customer Support Response Assistant

**Outcome**

Apply the Phase 2 concepts in one inspectable customer support workflow.

The first model call interprets the customer message. Application code validates the request and assembles permitted context. The second model call writes a response from that context. The project records prompts, context decisions, validation results, usage, latency, and evaluation outcomes.

The project lesson focuses on files to inspect, commands to run, and fields to observe. It does not repeat the definitions from the four preceding lessons.

## Phase boundaries

| Topic | Placement |
| --- | --- |
| Reasoning model fundamentals, sampling, structured output, prompt caching | Phase 1 |
| Embeddings, chunking, retrieval, hybrid search, reranking | Phase 3 |
| Function calling, tool permissions, MCP servers | Phase 4 |
| Agent loops, LangGraph, state, persistent memory, durable execution | Phase 5 |
| Production evaluation, observability, safety, governance, and release management | Phase 6 |

Prompt evaluation and basic trust boundaries remain in Phase 2 because learners need them while changing prompts and context. Later phases extend those practices across retrieval, tools, workflows, and deployed systems.

## Implementation approach

The Phase 2 lab reuses familiar customer support scenarios while remaining independent from the Phase 1 code. Ordinary Python owns prompt rendering, context assembly, validation, and evaluation. OpenAI and optional Ollama provide two model routes without making both providers mandatory.

Synthetic fixtures support every exercise. Offline tests cover prompt contracts, source selection, authorization, conversation corrections, validation, workflow outcomes, and evaluation logic. Paid model calls remain explicitly disabled until the learner enables them.

## Completion criteria

A learner completes the phase when they can run the application and its tests, explain the two model requests, inspect the assembled context, identify the first incorrect stage in a failed run, and compare prompt versions using the same cases.

The final result should distinguish deterministic test results from live model evaluation. It should record the provider, model, prompt version, case count, failures, token usage when available, and latency.

## Research scope and limits

The curriculum draws from the local Phase 1 implementation, AI Engineering From Scratch, official model provider guidance, LangChain and Pydantic documentation, and research on long context behavior. Provider capabilities and recommendations should be checked again when dependencies or model versions change.

The lesson order and time estimates are editorial planning decisions. Learner feedback should be used to revise reading, implementation, and troubleshooting time separately.
