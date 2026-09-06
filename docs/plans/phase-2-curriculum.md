# Phase 2 Curriculum Design

Prompt Engineering, Context Engineering, and Structured Outputs

Prepared for Agentic AI Lab on September 5, 2026. This is a curriculum proposal for review, not a published phase or a promise that its labs already exist.

## Recommendation

Expand the current three lesson placeholders into seven focused lesson pages. Keep the three existing subject areas, but give examples and reasoning, prompt injection, and evaluation enough space to be taught and practised properly. Conversation history belongs inside Context Engineering. Application state, persistent memory, checkpoints, and durable execution remain in Phase 5.

Plan for **14 hours of core work**, with **4 additional hours of optional advanced exercises**. The core should take a software engineer from writing a task specification to diagnosing and improving a model request inside an application. Advanced work means understanding difficult failure modes, evaluating tradeoffs, and managing context deliberately. It does not require implementing model training or studying a catalogue of prompting algorithms.

The phase should answer one practical question.

> How do we give a language model the right instructions and information, accept its output safely, and demonstrate whether a change improved the application?

The module sequence and hour estimates below are editorial recommendations. They are not externally validated learning times.

## Starting point and intended outcome

The current roadmap has three Phase 2 lessons of four hours each. Phase 1 already introduces message roles, provider SDKs, LangChain, Pydantic, structured responses, streaming, request metrics, and a bounded order lookup agent. Repeating that introduction would add length without adding capability.

Learners should enter this phase able to run the Support Request Analyzer, inspect the Customer Service Agent, and read Python functions, JSON, and an API response. The existing Python and uv setup is sufficient. No additional mathematics or machine learning prerequisite is needed.

By the end, learners should be able to write and version prompts, select representative examples, assemble and inspect context, manage relevant conversation history, validate a structured response, recognise prompt injection, and compare prompt changes against a fixed set of cases. They should also be able to explain whether a failure came from the instructions, missing evidence, the schema, model behaviour, or application code.

## Lesson sequence and time

Times include reading, examining code, making changes, running exercises, inspecting failures, and completing checks. Existing Phase 1 environment setup is assumed.

| Lesson | Page title | Concepts and reading | Implementation | Testing and analysis | Total |
| --- | --- | ---: | ---: | ---: | ---: |
| 01 | Prompt Engineering | 45 min | 30 min | 15 min | 1.5 hours |
| 02 | In Context Learning and Reasoning | 45 min | 45 min | 30 min | 2 hours |
| 03 | Structured Outputs and Validation | 45 min | 45 min | 30 min | 2 hours |
| 04 | Context Engineering | 60 min | 60 min | 30 min | 2.5 hours |
| 05 | Prompt Injection and Trust Boundaries | 30 min | 30 min | 30 min | 1.5 hours |
| 06 | Prompt Evaluation | 30 min | 60 min | 30 min | 2 hours |
| 07 | Customer Support Response Assistant | 15 min | 90 min | 45 min | 2.5 hours |
| **Core total** | | **4.5 hours** | **6 hours** | **3.5 hours** | **14 hours** |

Evaluation begins in Lesson 01. Lesson 06 formalises the comparisons learners have already been making. Lesson 07 integrates existing exercise components rather than introducing an unrelated project.

## 01 Prompt Engineering

**Outcome**

Define what the model should do, what information it may use, and what constitutes an acceptable result.

**Topics**

- Prompt Engineering
- Task Specifications
- Instruction Hierarchy
- Prompt Structure
- Prompt Templates
- Prompt Failure Analysis

Start by defining a prompt and prompt engineering directly. Then explain the relationship between the desired product behaviour, the model request, and ordinary application controls.

Cover the task, audience, allowed evidence, response requirements, and behaviour for incomplete or unrelated input. Explain role messages without implying that providers expose identical roles or that instruction priority is an access control system. Separate stable application instructions from customer text and variable data. Introduce Markdown, XML, and JSON as ways to organise input, with no claim that a delimiter makes content safe.

Teach reusable prompt builders with named inputs, required variable checks, and prompt versions in Git. A role such as customer support assistant can establish purpose and tone. Invented credentials or increasingly elaborate expert personas should not be presented as a dependable route to factual accuracy.

**Exercise**

Use the Phase 1 analyzer on ordinary, ambiguous, incomplete, and unrelated customer requests. Write acceptance criteria before editing its instructions. Compare the baseline with one revised prompt while leaving the model, schema, and examples unchanged.

For example, distinguish “Where is my refund?” from “I want to request a refund.” These require different interpretations even though both contain the same keyword.

**Code and checkpoint**

Build a small prompt function and inspect its rendered messages. Run a supplied baseline script. The checkpoint asks the learner to identify a case that needs better instructions and a case that cannot be solved without additional data.

**Research basis**

Current OpenAI guidance recommends keeping prompts in application code alongside typed inputs, tests, and normal deployment practices. This fits a small repository better than requiring a hosted prompt management service. [OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering#version-prompts-in-code)

## 02 In Context Learning and Reasoning

**Outcome**

Choose between direct instructions, examples, and task decomposition based on observed behaviour.

**Topics**

- In Context Learning
- Zero Shot and Few Shot Prompting
- Example Selection
- Reasoning Models
- Task Decomposition
- Reasoning Evaluation

Explain in context learning as adapting behaviour from information in the current request without updating model weights. Define zero shot, one shot, and few shot prompting before showing them.

Teach example relevance, label diversity, boundary cases, consistency with instructions, and the cost of additional examples. Keep demonstrations separate from the cases used to judge success. Include a failure caused by misleading examples, not only an example where adding demonstrations helps.

Explain the distinction between internal model reasoning, a concise explanation for a reader, and application code that splits a task into stages. Introduce chain of thought as a recognised technique and explain its limits with current reasoning models. Do not require learners to request or depend on hidden internal reasoning.

Introduce a fixed two stage workflow, such as extracting a request and then drafting its response, and explain why this is not automatically an agent. Discuss extra calls, error propagation, and the need for a useful intermediate contract.

**Exercise**

Compare zero shot instructions with a small set of representative examples. Use messages such as “The replacement is fine, but I was charged twice” to reveal incorrect keyword matching. Optionally compare a supported reasoning setting using the same cases.

**Code and checkpoint**

Add examples to the existing prompt builder. Record task accuracy, tokens, and latency. Learners must explain why their chosen version is justified, including when the simpler version performs equally well.

**Research basis**

OpenAI recommends trying straightforward instructions before adding examples to reasoning models. Claude recommends representative examples and model specific testing. Gemini also distinguishes internal thinking from explicit reasoning instructions. These support comparison exercises rather than a universal prompting recipe. [OpenAI reasoning guidance](https://developers.openai.com/api/docs/guides/reasoning-best-practices#how-to-prompt-reasoning-models-effectively) · [Claude prompting guidance](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) · [Gemini prompt design](https://ai.google.dev/gemini-api/docs/prompting-strategies)

## 03 Structured Outputs and Validation

**Outcome**

Design a usable response contract and handle the distinct ways a model request can fail.

**Topics**

- Structured Outputs
- JSON Schema and Pydantic
- Missing and Nullable Values
- Constrained Decoding
- Semantic Validation
- Failure Handling

Begin with the difference between ordinary text, prompting for JSON, JSON mode, and a provider enforcing a supported schema during generation. Explain constrained decoding conceptually without implementing a decoder.

Build on the Phase 1 schema rather than repeating a general Pydantic tutorial. Cover enums, descriptions, nullable values, required keys, extra fields, and a small cross field invariant. Separate a missing key from a present key with a null value. Inspect the schema actually passed to the provider.

Teach four distinct checks. Did the request complete? Can the response be parsed? Does it satisfy the application's schema? Are its claims and identifiers supported by the supplied evidence? Schema validation alone answers only part of that sequence.

Clarify why a framework may represent structured data through tool call arguments. A schema used to format a response is not necessarily a Python operation that should execute.

Handle refusal, incomplete generation, incompatible schemas, parse errors, and semantic errors separately. Only appropriate failures get a bounded retry. Missing evidence should lead to clarification or an explicit limitation, not a retry that invents the missing value.

**Exercise**

Extend the analyzer with a response contract that can represent missing information and evidence references. Test omitted and null identifiers, invalid categories, an unsupported order reference, an unknown evidence ID, and an incomplete response.

**Code and checkpoint**

Use Pydantic validators and provider response metadata. Include fixtures for failure paths that are difficult or expensive to provoke live. Learners must show a response that passes its schema but is still factually wrong.

**Research basis**

OpenAI strict schemas require required fields, with null representing an absent value when appropriate. Pydantic's nullable annotation does not itself create a default. Providers support different schema subsets, and refused or incomplete generations need separate handling. [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs) · [Pydantic fields](https://docs.pydantic.dev/latest/concepts/fields/) · [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output) · [LangChain structured model output](https://docs.langchain.com/oss/python/langchain/models#structured-output)

## 04 Context Engineering

**Outcome**

Construct and inspect a model request containing sufficient, relevant, permitted information.

**Topics**

- Context Engineering
- Context Sources and Provenance
- Context Selection
- Context Budgets
- Context Ordering
- Conversation Context
- History Selection and Summaries
- Grounding and Citations
- Prompt Caching

Define context engineering as selecting, preparing, and maintaining the information supplied during inference. A prompt is part of that context. Other inputs include history, examples, document excerpts, tool descriptions, and tool results.

Distinguish source authority from instruction authority. An order record may be authoritative for a delivery date, while text inside a record must not become permission to perform a new action. Introduce source IDs, versions, effective dates, and audience labels.

Build context using a fixed set of supplied policy documents. Filter by the authenticated request and explicit metadata before presenting evidence to the model. Include a current policy, an expired policy, irrelevant text, and an internal note that must be excluded.

Explain input budgets, output reserves, model dependent reasoning allowances, and token measurement. Count all included components rather than only the customer's message. The application should report an oversized request or deliberately reduce it, not silently remove essential instructions.

Compare evidence placement and distraction. Explain that a larger advertised window does not prove that every fact within it will be used correctly. Treat context position and length as test variables, not a universal rule that the middle is always unusable.

Introduce caching as reuse of computation for repeated input. Explain stable prefixes and cache usage fields. A cache is neither a conversation memory system nor a way to reduce the logical context window.

Treat conversation history as one context source. Distinguish the visible transcript from the messages actually sent to the model. Compare a recent message window with a compact summary, count both against the context budget, and explain why a previous assistant response is not automatically a verified fact.

Show how corrections affect the next request. If a customer changes order 10492 to order 10429, the selected history must make that correction unambiguous and must not carry facts from the earlier order into the response. Explain that summaries can omit qualifiers, preserve stale facts, or carry malicious text forward. This lesson manages model input only. It does not implement workflow state, persistent memory, or checkpoints.

**Exercise**

Answer the same damaged delivery question using a complete context pack, an eligible compact pack, and a pack missing the policy exception. Print the selected and excluded sources, reasons, and token budget. Repeat the exercise after the customer corrects an order number. Test whether a citation both exists and actually supports the statement.

**Code and checkpoint**

Implement a small context builder and conversation history selector using ordinary Python and supplied fixtures. No embeddings, vector database, application state store, or persistent memory is introduced. Learners should explain why making a request shorter can either improve it or remove information required for correctness.

**Research basis**

Anthropic's engineering account emphasises context selection across the entire request and describes progressive loading and compaction. Its guidance is experience based, not a guarantee for every model. The 2024 Lost in the Middle paper motivates a position experiment, but its measured results should not be presented as a benchmark of today's models. [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Lost in the Middle](https://aclanthology.org/2024.tacl-1.9/) · [OpenAI prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)

## 05 Prompt Injection and Trust Boundaries

**Outcome**

Recognise malicious instructions in input and preserve application controls even if a model follows them.

**Topics**

- Prompt Injection
- Direct and Indirect Injection
- Instruction and Data Boundaries
- Input and Output Controls
- Adversarial Testing

Define prompt injection before introducing attack examples. Distinguish a malicious customer request from instructions hidden inside an email, document, or tool result.

Explain what role separation, delimiters, and correct serialization can help the model interpret. Do not describe these as complete protection. A valid JSON string can still contain an instruction intended to manipulate the model.

Apply controls already familiar from Phase 1. The application selects permitted records and tools, keeps secrets out of context, validates identifiers, and exposes no refund execution capability. A model must not be able to grant itself authority by returning a field such as “authorized.”

Add output constraints and checks, while explaining that a valid schema does not prevent harmful content inside a string. Use adversarial tests to assess both model behaviour and the controls outside it.

**Exercise**

Place an instruction to disclose an internal note inside a supplied policy excerpt. Also test an ordinary quotation containing “ignore previous instructions” to avoid teaching simplistic keyword rejection. Confirm that restricted data never enters the request and no unsupported action can execute.

**Code and checkpoint**

Add malicious fixtures, source selection tests, and permission tests. Distinguish a model ignoring an attack in one run from an application enforcing a boundary regardless of the model's output.

**Research basis**

Anthropic recommends source labelling, appropriate tool result channels, serialization, least privilege, and adversarial testing. The exact message representation is provider specific. No single formatting or detection technique should be taught as complete injection prevention. [Anthropic prompt injection guidance](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)

## 06 Prompt Evaluation

**Outcome**

Make a defensible prompt or context change using reproducible comparisons and inspected failures.

**Topics**

- Prompt Evaluation
- Evaluation Datasets
- Scoring and Human Review
- Error Analysis
- Prompt Improvement
- Versioning and Regression Checks

Formalise the acceptance cases introduced in Lesson 01. Separate examples supplied inside prompts, development cases used during iteration, and held out cases used for the final comparison.

Start with 24 small synthetic cases, split into 12 development and 12 held out cases. This is a teaching set, not evidence of production readiness. Include missing information, corrections, conflicting policies, unrelated questions, and attacks. Learners add several cases that the supplied examples do not cover.

Use exact checks for extracted fields, source membership, invalid access, and completion states. Evaluate groundedness and helpfulness with an explicit human rubric. A citation ID existing is necessary but does not prove its evidence supports the answer. Model judging can be demonstrated, but should not be a required service or treated as an oracle.

Group failures by cause before editing a prompt. Change one factor at a time. Compare examples, context selection, and instruction wording while keeping other settings stable. Repeat a small subset to reveal variability. Low temperature is not a promise of identical end to end results.

Store the prompt version, model identifier, schema version, fixture version, available usage metadata, latency, and outcome. Do not record unrestricted customer content by default. Explain a basic rollback to the prior prompt version.

**Exercise**

Compare the baseline with two targeted revisions. Report correct results as counts as well as percentages, review regressions, and explain the quality and latency tradeoff. Retain the baseline if neither revision improves it.

**Code and checkpoint**

Use a small Python evaluation runner and a readable results file. Tests for deterministic code should work offline. Live model evaluations should require an explicit run command and bounded case count. Learners must distinguish passing mocked tests from measuring a real model.

**Research basis**

OpenAI and Anthropic both recommend task specific evaluation and criteria defined before prompt revision. Automated judges require calibration and do not remove the need to inspect failures. Automatic prompt optimizers belong after this manual process is understood. [OpenAI evaluation guidance](https://developers.openai.com/api/docs/guides/evaluation-best-practices) · [Anthropic evaluation guidance](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)

## 07 Customer Support Response Assistant

**Outcome**

Integrate the phase's prompt, context, and validation components into one runnable customer support application.

**Topics**

- Customer Support Response Assistant
- Project Structure
- Request Analysis
- Context Assembly
- Conversation Context
- Response Validation
- Testing and Results

This standalone project builds on the concepts from the Phase 1 Support Request Analyzer without importing code from the Phase 1 lab. It produces a customer response using selected order facts and supplied policy evidence. It becomes a component of the eventual Customer Service Agent capstone.

Use a fixed application workflow here. It is appropriate because the steps are known. This is an LLM application, not a new autonomous agent. The existing Phase 1 bounded agent remains a reference for tool selection, and the later tool and workflow phases will connect these components.

**Request flow**

1. The application loads the current message and the supplied conversation history.
2. The first model call extracts the support request into the agreed schema.
3. Application code validates that interpretation. When essential information is missing, it returns a clarification path.
4. The application loads permitted order facts when required and selects eligible policy fixtures. Existing order access checks remain in application code.
5. The context builder combines the selected facts, policy evidence, relevant history, and response instructions within its budget.
6. The second model call produces a structured customer response with evidence references.
7. The application validates the result and records the outcome.

The normal complete path uses two model calls. Clarification and failure paths may stop earlier. There is no embedding search, refund execution, or new orchestration framework.

**Required demonstrations**

- A normal order status request using verified order facts.
- A damaged item question answered from supplied current policy evidence.
- A missing order reference that produces a relevant clarification.
- A corrected identifier across conversation turns.
- Conflicting or insufficient policy evidence that produces an explicit limitation.
- An injected instruction that cannot bypass application permissions.
- A schema valid response containing an unsupported fact.
- A comparison report explaining the selected prompt and context configuration.

The final code should reuse the small functions built in earlier lessons. Include exact folder, entry point, environment settings, commands, expected output, and test commands in the eventual lesson. Do not present a large unexplained program at the end.

## Optional advanced exercises

These should be expandable sections or additional reading links, not prerequisites for Phase 3.

| Exercise | Time | Purpose |
| --- | ---: | --- |
| Automated Prompt Optimization | 1.5 hours | Introduce the idea of searching instructions or examples against a metric. Try a bounded DSPy optimizer experiment only after defining separate development and evaluation cases. |
| Context Compression and Cache Measurement | 1.5 hours | Compare summary loss against token savings and measure cache behaviour on a supported provider. Report a cache miss honestly when the lab does not meet its requirements. |
| Model Portability | 1 hour | Compare the same workload on OpenAI and an optional local Ollama model. Investigate differences in schema support, thinking controls, context limits, tokens, and latency. |
| **Optional total** | **4 hours** | |

DSPy exposes optimizers for instructions and examples, including MIPROv2 and GEPA. This is useful advanced awareness, but another framework is not necessary for the core phase. The optional exercise should implement one approach, not survey every optimizer. [DSPy optimizer documentation](https://github.com/stanfordnlp/dspy/blob/main/docs/docs/learn/optimization/optimizers.md)

## Use of the reference curriculum

The most relevant material in AI Engineering from Scratch is in its LLM engineering phase, with selected supporting material elsewhere. Use its concepts and experiment ideas as references, then write original explanations and customer service examples.

| Reference material | What to adapt | Boundary |
| --- | --- | --- |
| [Prompt Engineering](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/11-llm-engineering/01-prompt-engineering/docs/en.md) | Task specification, templates, targeted prompt comparisons | Avoid universal persona and sampling recipes |
| [Few Shot and Reasoning](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/11-llm-engineering/02-few-shot-cot/docs/en.md) | Example selection, task decomposition, measured comparisons | Defer tree search, ensembles, and ReAct implementation |
| [Structured Outputs](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/11-llm-engineering/03-structured-outputs/docs/en.md) | JSON versus schema enforcement, Pydantic, validation | Add current provider exceptions and incomplete output handling |
| [Context Engineering](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/11-llm-engineering/05-context-engineering/docs/en.md) | Context components, budget reports, history policies | Build a complete budget that includes summaries |
| [Evaluation](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/11-llm-engineering/10-evaluation/docs/en.md) | Task specific cases, baselines, failure categories | Defer full platforms, dashboards, and statistical analysis |
| [Structured Output Contracts](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/13-tools-and-protocols/04-structured-output/docs/en.md) | Typed results and distinct error outcomes | Verify the chosen API rather than assuming identical guarantees |
| [Prompt Injection](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/14-agent-engineering/27-prompt-injection-defense/docs/en.md) | Malicious supplied content and trust boundaries | Defer extensive defence infrastructure |
| [Long Context Evaluation](https://github.com/rohitg00/ai-engineering-from-scratch/blob/main/phases/05-nlp-foundations-to-advanced/28-long-context-evaluation/docs/en.md) | Small position and distraction experiments | Defer full benchmark suites |

The reference should not be the sole authority for current API behaviour. Some demonstrations use simulated model responses, and some broad claims omit important conditions. Our lessons should distinguish measured live results, fixture based tests, provider documentation, and illustrative output.

## Company practices to explain in the lessons

Use short, dated explanations close to the relevant concept. The following are documented practices and recommendations, not a claim that every team at a company uses the same architecture.

| Source | Relevant practice | How it changes the course |
| --- | --- | --- |
| [OpenAI prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) | Version prompts in code and evaluate behavioural changes | Prompts and fixtures live in Git |
| [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Curate context and preserve important information when compacting | Learners inspect what is retained and what is lost |
| [Gemini prompt design](https://ai.google.dev/gemini-api/docs/prompting-strategies) | Guidance varies by model, including sampling settings | No universal temperature or reasoning recipe |
| [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs) | Use supported schemas and handle refusal or incomplete generation | Completion handling precedes acceptance |
| [Claude structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) | Provider enforced constraints and local SDK validation can differ | Inspect the transmitted contract and local checks |
| [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output) | Schema conformance does not establish semantic correctness | Verify identifiers, facts, and evidence |
| [LangChain model documentation](https://docs.langchain.com/oss/python/langchain/models#structured-output) | A common interface can use different structured output methods | Explain adapters without promising identical provider behaviour |

Two source tensions are useful teaching opportunities. Guidance about long documents near the beginning and queries near the end concerns comprehension; stable prefixes concern caching. Neither overrides the need to test a request layout. Advice about adding examples also differs by model and task. Compare a few representative demonstrations against the zero shot baseline rather than prescribe a magic number.

## What belongs in later phases

| Topic | Placement |
| --- | --- |
| Embeddings, chunking, retrieval, hybrid search, reranking | Phase 3 |
| Complete function calling, MCP servers, tool discovery | Phase 4 |
| ReAct, graph workflows, planning, specialists, agent handoffs | Phase 5 |
| Durable execution, checkpoints, persistent agent memory | Phase 5 |
| Comprehensive safety systems, production tracing, statistical evaluation, release monitoring | Phase 6 |
| Fine tuning, soft prompt training, tree of thought search, large prompt ensembles | Optional later material |
| Multimodal prompting for documents, images, and audio | Later extension after the text application path |

Basic evaluation and trust boundaries remain in Phase 2 because learners need them to assess their prompt and context changes. Later phases deepen those skills instead of introducing them for the first time.

## Implementation approach

Create one small Phase 2 lab alongside the Phase 1 lab when implementation begins. Keep completed Phase 1 commands working. Reuse the familiar schemas, order fixtures, access checks, and tracing concepts without requiring a shared framework or a major refactor.

Use one main application path through the LangChain model interface already introduced. Ordinary Python owns prompt rendering, context assembly, output validation, and evaluation. Show provider differences only where they affect behaviour.

Offer OpenAI or optional Ollama with qwen3:14b. Installing a local model or paying for two providers must not be required to finish the core. Verify the installed integrations and actual model capabilities before writing final runnable examples. The previous local model's structured output issues are a reason to document fallback behaviour precisely.

Use synthetic fixtures only. Provide offline tests and a small explicit live evaluation command. Avoid introducing a hosted evaluation account, a database, or a frontend as a prerequisite for this phase.

## Content and teaching standard

Every lesson starts with its named subject and a definition, then develops the mechanism and its application. Keep the existing narrative style rather than force every small concept into identical boxes.

Use the topic names above for the left sidebar. Within each page, include a worked example near the relevant explanation, short code where it helps, a visible outcome or failure to inspect, and two or three comprehension checks. End with an exercise that contributes to the common application.

Use diagrams only where they clarify relationships. The highest value diagrams are prompt versus context, the stages of output validation, a context budget, and conversation history selection. Continue the existing example styling and tooltips for unfamiliar terms. Avoid an artificial paragraph or line minimum.

Keep headings professional and use standard terminology. Avoid unnecessary hyphens, colons, semicolons, slogans, and exaggerated guarantees. Source references should substantiate the material without interrupting the explanation.

## Completion criteria

A learner completes the phase when they can run the application and its offline tests, explain the request flow, inspect the assembled context, identify invalid or unsupported output, and present a baseline comparison.

The report must distinguish deterministic test results from model evaluation. It should show the number of cases, observed failures, model and prompt versions, and any tradeoff in latency or usage. A small successful run does not establish production safety or a statistically reliable accuracy rate.

The final exercise should preserve at least one failed attempt with an explanation of its cause and correction. If a candidate prompt does not improve the baseline, the learner should document that result rather than manufacture an improvement.

## Timing and roadmap implications

The current phase hour values in the repository are 12, 12, 18, 15, 17, 18, and 25. They sum to 117, although the public copy currently says about 100 hours.

This proposal changes only the planned Phase 2 estimate from 12 to 14 hours. With the other estimates untouched, the total would become 119 hours, or 123 including every optional Phase 2 exercise.

Do not update the public total until the remaining phase budgets are reviewed. If about 100 hours remains the intended core, remove duplicated work from later phases and count incremental capstone integration rather than rebuilding earlier modules. A revised overall budget is a separate decision.

For an engineer who has completed Phase 1, the 14 hour allocation is a planning baseline. Additional Python practice, slow local inference, and troubleshooting can extend it. Pilot the lessons with a few learners and revise estimates from their reading, implementation, and debugging time separately.

## Research scope and limits

Research reviewed the local roadmap and relevant Phase 1 implementation, ten relevant original lessons from AI Engineering from Scratch, official OpenAI, Anthropic, Google, LangChain and Pydantic documentation, an original long context study, and DSPy documentation.

Source review was completed on September 5, 2026. Live documentation and repository main branches can change. API details and model specific recommendations should be checked again when code is implemented.

The curriculum order, project design, exercise sizes, and time estimates are proposals. No Phase 2 lab, model benchmark, or learner timing study was executed during this research. The recommendation is supported as a teaching design, not as an empirically proven best curriculum.
