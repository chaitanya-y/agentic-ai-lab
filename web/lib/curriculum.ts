export type LessonFormat = "Concept" | "Build" | "Concept + Build" | "Capstone";

export type Lesson = {
  slug: string;
  title: string;
  time: string;
  format: LessonFormat;
  summary: string;
  why: string;
  explanation: string;
  example: string;
  practice: string[];
  outcome: string;
  concepts: string[];
  labSlug?: string;
};

export type CurriculumPhase = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  time: string;
  hours: number;
  summary: string;
  prerequisite: string;
  outcome: string;
  accent: "blue" | "coral" | "green" | "yellow";
  lessons: Lesson[];
};

const lesson = (
  slug: string,
  title: string,
  time: string,
  format: LessonFormat,
  summary: string,
  why: string,
  explanation: string,
  example: string,
  practice: string[],
  outcome: string,
  concepts: string[],
  labSlug?: string
): Lesson => ({
  slug,
  title,
  time,
  format,
  summary,
  why,
  explanation,
  example,
  practice,
  outcome,
  concepts,
  labSlug
});

export const curriculum: CurriculumPhase[] = [
  {
    id: "foundations",
    number: "01",
    title: "Practical LLM Foundations",
    shortTitle: "Foundations",
    time: "5–7 hours",
    hours: 6,
    summary:
      "Learn the minimum model internals needed to make good engineering decisions. The goal is useful intuition, not training a foundation model.",
    prerequisite: "Comfort with Python, APIs, JSON, and basic backend development.",
    outcome: "You can explain what enters a model, what comes out, and which limits affect an application.",
    accent: "yellow",
    lessons: [
      lesson(
        "what-an-llm-does",
        "What an LLM actually does",
        "60 minutes",
        "Concept",
        "Understand next-token prediction and why fluent output is not the same as verified knowledge.",
        "Agent systems become unreliable when developers treat model text as a database result or a program guarantee.",
        "An LLM receives a sequence of tokens and estimates what token is likely to come next. Instruction-following, summarization, and tool selection emerge from that same mechanism. The model can produce a convincing sentence without checking whether the sentence is true, so the surrounding software must supply evidence and verification.",
        "Think of a very experienced autocomplete system. It can draft a support reply quickly, but your application still checks the customer record before promising a refund.",
        [
          "Send the same factual question with three different contexts and compare the answers.",
          "Mark which parts came from supplied evidence and which parts were model inference."
        ],
        "A one-page mental model separating generation, retrieval, tool execution, and verification.",
        ["next-token prediction", "inference", "hallucination", "model behavior"]
      ),
      lesson(
        "tokens-context-and-limits",
        "Tokens, context windows, and limits",
        "75 minutes",
        "Concept + Build",
        "Learn how text becomes tokens and why context size, output limits, latency, and cost move together.",
        "A prompt that fits during a demo can fail or become expensive when real users attach long documents and conversation history.",
        "Models process token sequences rather than characters or words. The context window contains instructions, messages, retrieved passages, tool results, and the requested output. More context is not automatically better: irrelevant text raises cost and can hide the important evidence.",
        "A 100-page policy manual may fit in a large context window, but retrieving the three relevant sections usually reduces cost and improves auditability.",
        [
          "Measure the approximate size of a prompt, chat history, and retrieved context.",
          "Create a context budget that reserves space for the answer and tool responses."
        ],
        "A documented context budget for one realistic agent request.",
        ["tokens", "context window", "latency", "cost", "truncation"]
      ),
      lesson(
        "embeddings-and-vectors",
        "Embeddings and vector intuition",
        "75 minutes",
        "Concept + Build",
        "Represent meaning as numbers so related text can be compared even when it uses different words.",
        "Keyword search misses questions such as “How do I cancel?” when a document says “terminate the subscription.”",
        "An embedding model converts a piece of text into a numeric vector. Texts with similar meaning tend to land near one another in that vector space. Similarity is useful for retrieval, clustering, recommendations, and deduplication, but it does not prove that two statements are factually equivalent.",
        "A support question about a “broken login” can retrieve an article titled “Account access troubleshooting” because their meanings are close.",
        [
          "Embed a small set of support questions and compare nearest neighbors.",
          "Add an ambiguous query and inspect where semantic similarity makes a bad match."
        ],
        "A small semantic-matching implementation with documented failure cases.",
        ["embeddings", "vectors", "cosine similarity", "semantic search"]
      ),
      lesson(
        "transformer-intuition",
        "Transformer and attention intuition",
        "75 minutes",
        "Concept",
        "Build a practical picture of attention, position, and feed-forward processing without deriving every equation.",
        "This intuition helps explain why wording, ordering, long context, and repeated evidence can change model behavior.",
        "A transformer repeatedly lets tokens exchange information through attention, then transforms those representations through feed-forward layers. Attention helps a token weigh other tokens that matter for the current prediction. Position information preserves order, because the same words in a different sequence can mean something different.",
        "In “The refund was denied because the account was closed,” attention helps the answer connect “because” with the relevant cause instead of treating every word equally.",
        [
          "Draw the path from input text to tokens, contextual representations, and output probabilities.",
          "Compare two prompts containing the same facts in different orders."
        ],
        "A diagram and written explanation you could give in a system-design interview.",
        ["transformer", "attention", "position", "feed-forward network"]
      ),
      lesson(
        "models-providers-and-streaming",
        "Models, providers, streaming, and cost",
        "75 minutes",
        "Build",
        "Use one model interface with both a local model and a hosted provider, then compare behavior and operating cost.",
        "Production systems need a model choice based on task quality, speed, privacy, reliability, and budget—not a leaderboard alone.",
        "A provider abstraction keeps application logic separate from a specific API. Streaming improves perceived responsiveness by returning partial output, while usage metadata helps estimate spend. Local models offer control and privacy; hosted models often provide stronger capabilities and managed scaling.",
        "A classifier may run locally for predictable cost while a difficult final synthesis uses a stronger hosted model.",
        [
          "Run one prompt with the repository's local Qwen and OpenAI modes.",
          "Record latency, output quality, token usage, and the point at which fallback is justified."
        ],
        "A small provider comparison and a written routing rule.",
        ["model provider", "streaming", "token usage", "fallback", "local models"]
      )
    ]
  },
  {
    id: "reliable-apps",
    number: "02",
    title: "Reliable LLM Applications",
    shortTitle: "Reliable apps",
    time: "8–10 hours",
    hours: 9,
    summary:
      "Turn a raw model call into a software component with clear inputs, validated outputs, bounded context, and repeatable tests.",
    prerequisite: "Phase 01 or equivalent experience calling a chat-completion API.",
    outcome: "You can build model-backed features that fail visibly instead of silently corrupting application state.",
    accent: "blue",
    lessons: [
      lesson(
        "prompt-vs-context-engineering",
        "Prompt engineering vs. context engineering",
        "90 minutes",
        "Concept + Build",
        "Separate durable instructions from the dynamic evidence, tools, history, and user state needed for one request.",
        "Many prompt problems are actually missing-data problems. Rewording an instruction cannot recover facts the model never received.",
        "Prompt engineering shapes the task and response behavior. Context engineering decides what information reaches the model, in what order, with what labels, and under which token budget. Reliable applications treat context assembly as a tested software pipeline.",
        "For a renewal email, the instruction defines tone and format; context supplies the plan, renewal date, past conversations, and approved discount policy.",
        [
          "Split one oversized prompt into system rules, task instructions, user data, and evidence.",
          "Remove irrelevant context and compare accuracy, latency, and cost."
        ],
        "A reusable prompt-and-context template with explicit sections.",
        ["system prompt", "context engineering", "few-shot examples", "prompt hierarchy"]
      ),
      lesson(
        "structured-outputs",
        "Structured outputs and schemas",
        "90 minutes",
        "Build",
        "Make the model return typed data your application can validate and route.",
        "Parsing prose with regular expressions is fragile, especially when the result controls tools, database writes, or workflow branches.",
        "Structured output constrains a response to fields such as category, confidence, reason, and next action. A schema gives the application a contract and makes missing or invalid values detectable. The schema should express business meaning, not merely mirror a pretty JSON example.",
        "A support triage model returns `{category, urgency, needs_human}` instead of a paragraph that another function must guess how to interpret.",
        [
          "Define a typed schema for support-ticket classification.",
          "Test missing fields, invalid enum values, and an intentionally ambiguous ticket."
        ],
        "A validated classifier whose output can safely enter normal application code.",
        ["JSON schema", "typed output", "validation", "classification"]
      ),
      lesson(
        "validation-retries-and-fallbacks",
        "Validation, retries, and fallbacks",
        "105 minutes",
        "Concept + Build",
        "Handle malformed output, provider errors, timeouts, and low-confidence results with bounded recovery.",
        "Blind retries can multiply cost and repeat the same failure. Silent fallback can hide a quality regression.",
        "Validation checks whether a response is acceptable before downstream use. Retry only when the failure is likely transient or repairable, cap attempts, and preserve the error reason. Fallbacks should be observable and matched to the task: a smaller model may handle extraction, while a human may be the correct fallback for a high-risk decision.",
        "If an invoice extractor omits currency, one repair attempt can request only that field; repeated failure routes the document to review.",
        [
          "Add schema validation and one targeted repair attempt.",
          "Simulate a timeout and record which fallback ran and why."
        ],
        "A bounded recovery policy with tests for malformed data and provider failure.",
        ["retry policy", "backoff", "fallback", "confidence", "error handling"]
      ),
      lesson(
        "conversation-state",
        "Conversation state and context management",
        "90 minutes",
        "Build",
        "Store useful state explicitly instead of replaying an unlimited transcript.",
        "Long chat history raises cost, repeats stale instructions, and makes it difficult to know which facts the application trusts.",
        "Conversation state can combine recent messages, a structured task record, and a compact summary. The application should distinguish user claims, verified business data, and temporary model notes. Retention and deletion rules are part of the design.",
        "A travel assistant keeps the confirmed dates and budget in typed state, the last few messages verbatim, and a summary of older discussion.",
        [
          "Design a state object for a multi-turn support case.",
          "Implement a rule that summarizes or drops old messages when the context budget is reached."
        ],
        "A state model that remains understandable after a long conversation.",
        ["message history", "state", "summarization", "context budget", "retention"]
      ),
      lesson(
        "testing-llm-boundaries",
        "Testing nondeterministic boundaries",
        "105 minutes",
        "Concept + Build",
        "Test contracts and outcomes even when model wording changes between runs.",
        "A single saved response proves very little. Model updates, prompt changes, and unusual inputs can break behavior without causing a code exception.",
        "Unit-test deterministic code normally. At the model boundary, test schema validity, required facts, forbidden actions, tool choices, and acceptable quality across a dataset. Keep model calls behind an interface so most tests use fixtures while a smaller evaluation suite checks real behavior.",
        "A refund assistant test does not require identical prose; it requires the correct policy citation and forbids approving an ineligible refund.",
        [
          "Create ten representative and adversarial examples for one task.",
          "Define pass criteria that do not depend on exact wording."
        ],
        "A small regression set and a repeatable evaluation command.",
        ["fixtures", "contract tests", "evaluation dataset", "nondeterminism", "regression"]
      )
    ]
  },
  {
    id: "rag",
    number: "03",
    title: "Retrieval and Production RAG",
    shortTitle: "Retrieval & RAG",
    time: "18–24 hours",
    hours: 22,
    summary:
      "Build retrieval systems that find useful evidence, show their sources, and can be measured independently from generation.",
    prerequisite: "Phases 01–02 and comfort working with files, APIs, and simple data pipelines.",
    outcome: "You can design, debug, and evaluate a grounded RAG system with inspectable retrieval behavior.",
    accent: "coral",
    lessons: [
      lesson(
        "semantic-search-pipeline",
        "A complete semantic-search pipeline",
        "3 hours",
        "Build",
        "Load documents, split them, embed the chunks, index them, and inspect nearest-neighbor results.",
        "RAG quality cannot exceed retrieval quality. You need to see the evidence before asking a model to write an answer.",
        "Semantic search has a data path: source documents become normalized records, records become chunks, chunks receive embeddings, and queries retrieve the nearest candidates. Keep source metadata on every chunk so results can be traced back to the original material.",
        "An engineer asks “How do enterprise users sign in?” and retrieves the SSO setup section even though the document never uses that exact question.",
        [
          "Run the repository semantic-search lab against a PDF.",
          "Print each result with its score, source, page, and chunk text."
        ],
        "A searchable document index with inspectable results and metadata.",
        ["document loading", "chunking", "embeddings", "vector store", "metadata"],
        "semantic-search"
      ),
      lesson(
        "chunking-and-ingestion",
        "Chunking and ingestion design",
        "3 hours",
        "Concept + Build",
        "Choose chunk boundaries, overlap, metadata, and update behavior based on document structure.",
        "Poor chunks split important facts, mix unrelated sections, or remove the heading that gives a paragraph meaning.",
        "Chunking is a data-model decision. Fixed-size chunks are simple; structure-aware chunks preserve sections, tables, or code blocks. Overlap can protect boundary information but creates duplicates. A production ingestion job also needs stable identifiers, versioning, deletion, and re-indexing.",
        "A pricing table should remain with its plan heading; splitting every 500 characters could separate the price from the plan name.",
        [
          "Compare fixed-size and heading-aware chunking on the same document.",
          "Define stable chunk IDs and an update strategy for a changed source."
        ],
        "An ingestion design with measured chunk examples and update rules.",
        ["chunk size", "overlap", "structure-aware splitting", "indexing", "versioning"]
      ),
      lesson(
        "vector-stores-and-metadata",
        "Vector stores, filters, and metadata",
        "3 hours",
        "Build",
        "Move from an in-memory demo to a retrieval index that supports namespaces, filters, and lifecycle operations.",
        "Similarity alone can retrieve the right words from the wrong tenant, product, language, or document version.",
        "A vector store holds embeddings plus identifiers and metadata. Filters enforce scope before or during retrieval. Production design must cover tenant isolation, index updates, backup, latency, and the relationship between the vector record and the authoritative source.",
        "A query from Acme Corp searches only Acme documents and the currently published policy version.",
        [
          "Add product and version metadata to indexed chunks.",
          "Test that a filtered query cannot retrieve a document from another namespace."
        ],
        "A retrieval layer with explicit scope and lifecycle behavior.",
        ["vector database", "metadata filters", "namespaces", "tenant isolation", "index lifecycle"]
      ),
      lesson(
        "deterministic-rag",
        "Deterministic RAG chains",
        "3 hours",
        "Build",
        "Retrieve every time, assemble a bounded context, and make one grounded generation call.",
        "When every question needs the same knowledge base, an open-ended agent adds latency and unpredictability without adding value.",
        "A deterministic RAG chain follows a known path: transform the query if needed, retrieve candidates, select context, generate from that context, and return citations. Because the steps are fixed, timing, cost, and failures are easier to test.",
        "An employee policy assistant always searches the policy index before responding, even if the question looks easy.",
        [
          "Run the RAG-chain lab and expose the final context beside the answer.",
          "Add a refusal path when retrieved evidence is too weak."
        ],
        "A single-call grounded assistant with visible citations and predictable control flow.",
        ["RAG chain", "context assembly", "grounding", "citations", "abstention"],
        "rag-chain"
      ),
      lesson(
        "agentic-rag",
        "Agentic RAG and retrieval decisions",
        "3 hours",
        "Concept + Build",
        "Let a model decide whether retrieval is needed, while keeping the decision visible and bounded.",
        "Some requests need private knowledge and others do not. Selective retrieval can reduce unnecessary work, but the model can also make the wrong choice.",
        "Agentic RAG exposes retrieval as a tool. The model can answer directly, call the retriever, inspect its result, and continue. Guardrails should cap the loop, record tool decisions, and force retrieval for categories where evidence is mandatory.",
        "A product assistant can answer “say hello more formally” directly, but must retrieve documentation for an API-limit question.",
        [
          "Compare the repository RAG agent with the deterministic RAG chain.",
          "Create questions where optional retrieval helps and where it creates risk."
        ],
        "A documented decision rule for choosing deterministic or agentic RAG.",
        ["retriever tool", "tool choice", "agentic RAG", "loop budget", "forced retrieval"],
        "rag-agent"
      ),
      lesson(
        "advanced-retrieval",
        "Hybrid retrieval, reranking, and query rewriting",
        "4 hours",
        "Concept + Build",
        "Improve difficult retrieval with lexical search, metadata, reranking, and better search queries.",
        "Vector similarity struggles with exact identifiers, rare terms, multi-part questions, and vague conversational wording.",
        "Hybrid retrieval combines semantic and keyword signals. Reranking applies a stronger relevance model to a small candidate set. Query rewriting turns a conversational question into a search-friendly form, while decomposition splits a broad request into smaller retrieval tasks.",
        "“Why did ticket INC-4821 repeat last quarter’s failure?” needs the exact ticket ID, semantic matches for the failure, and possibly two separate searches.",
        [
          "Create a small benchmark containing exact IDs, synonyms, and multi-part questions.",
          "Compare vector-only retrieval with one hybrid or reranked approach."
        ],
        "A retrieval experiment showing which technique fixes which failure mode.",
        ["hybrid search", "BM25", "reranking", "query rewriting", "decomposition"]
      ),
      lesson(
        "rag-evaluation",
        "RAG evaluation, grounding, and citations",
        "3 hours",
        "Concept + Build",
        "Measure retrieval and answer quality separately with a small, trustworthy dataset.",
        "A polished answer can hide missing evidence, and a correct retrieved passage can still be used incorrectly.",
        "Evaluate retrieval with measures such as whether a relevant chunk appears in the top results. Evaluate generation for factual support, completeness, refusal behavior, and citation correctness. Human-reviewed examples are especially valuable for business-specific questions.",
        "If the answer is wrong, first check whether the needed policy was retrieved; that tells you whether to fix ingestion, retrieval, or generation.",
        [
          "Create at least twenty questions with expected source passages.",
          "Produce separate retrieval and answer-quality results, then classify each failure."
        ],
        "A baseline RAG evaluation report and a prioritized improvement list.",
        ["retrieval recall", "faithfulness", "answer relevance", "citations", "error analysis"]
      )
    ]
  },
  {
    id: "tools-mcp",
    number: "04",
    title: "Tools, Actions, and MCP",
    shortTitle: "Tools & MCP",
    time: "16–20 hours",
    hours: 18,
    summary:
      "Connect models to deterministic code and external systems through small, typed, observable, and permission-aware interfaces.",
    prerequisite: "Phases 01–02. Complete Phase 03 first if your tools retrieve private knowledge.",
    outcome: "You can build tool-using agents and MCP integrations without giving the model uncontrolled access.",
    accent: "green",
    lessons: [
      lesson(
        "tool-interface",
        "The tool interface",
        "3 hours",
        "Concept + Build",
        "Design one narrow function the model can call with typed arguments and a useful result.",
        "A model cannot safely operate a system through vague instructions such as “use the database somehow.”",
        "A tool is a controlled capability with a name, description, argument schema, implementation, and result. Good tools expose a business action rather than a low-level escape hatch. The model proposes arguments; ordinary code authenticates, validates, executes, and returns a compact result.",
        "Use `get_order_status(order_id)` instead of a generic `run_sql(query)` for a customer-facing assistant.",
        [
          "Wrap a deterministic function as a typed tool.",
          "Test valid input, missing arguments, invalid identifiers, and an execution error."
        ],
        "A small tool whose behavior is understandable without reading the agent prompt.",
        ["tool schema", "function calling", "validation", "least privilege"]
      ),
      lesson(
        "tool-calling-loop",
        "The model–tool message loop",
        "3 hours",
        "Build",
        "Implement and inspect the full cycle from user request to tool proposal, tool result, and final response.",
        "Tool calling follows a defined message protocol. Missing a message or confusing a proposal with an execution can cause subtle failures.",
        "The model emits a structured tool call. The application validates and runs it, appends a tool-result message with the matching identifier, and asks the model to continue. The loop needs limits, error messages the model can use, and a trace for debugging.",
        "A calculator agent proposes `multiply(17, 23)`, receives `391` from code, then explains the result to the user.",
        [
          "Run the arithmetic tool agent and print every message in the loop.",
          "Add a maximum-call limit and a clear tool-error result."
        ],
        "An inspectable tool loop with bounded execution.",
        ["tool call", "tool result", "message protocol", "loop limit", "trace"],
        "arithmetic-tool-agent"
      ),
      lesson(
        "tool-design",
        "Designing tools agents can use well",
        "3 hours",
        "Concept + Build",
        "Write clear descriptions, stable schemas, compact results, and domain-level error messages.",
        "Even correct functions are hard for a model to use when names overlap, parameters are ambiguous, or results dump too much data.",
        "Tool descriptions should say when to use the tool, not merely restate its name. Required fields, enums, units, and identifier formats reduce guessing. Return only what the next decision needs, and distinguish not-found, permission-denied, and temporary failure.",
        "Two tools named `search` and `lookup` invite confusion; `search_help_articles(query)` and `get_customer_by_email(email)` communicate different intentions.",
        [
          "Review five candidate tool definitions and remove overlap.",
          "Run a selection test where several tools are available at once."
        ],
        "A reviewed tool catalog with selection tests and clear error contracts.",
        ["tool descriptions", "schema design", "error contracts", "tool selection"]
      ),
      lesson(
        "safe-tool-execution",
        "Safe execution and idempotency",
        "3 hours",
        "Concept + Build",
        "Separate read actions from writes and make repeated requests safe.",
        "Retries, duplicated messages, or an impatient user can cause a write tool to run more than once.",
        "Read-only tools can often execute immediately. Mutating tools should validate permissions, show the proposed change, require approval when risk is meaningful, and use an idempotency key. The final response should come from the actual execution result, not the model's assumption.",
        "A refund request creates one pending refund even if the provider times out and the workflow retries.",
        [
          "Add an idempotency key to a mock write tool.",
          "Implement propose, approve, execute, and verify stages."
        ],
        "A write-action pattern that cannot silently duplicate a side effect.",
        ["idempotency", "human approval", "read vs. write", "audit log", "verification"]
      ),
      lesson(
        "mcp-fundamentals",
        "MCP fundamentals",
        "3 hours",
        "Concept",
        "Understand how Model Context Protocol standardizes discovery and use of tools, resources, and prompts.",
        "Custom integration code becomes difficult to reuse when every agent framework invents a different connection contract.",
        "MCP defines a client-server protocol for exposing capabilities to model-powered applications. A server advertises available tools and resources; a client discovers and invokes them through a transport. MCP improves interoperability, but authentication, authorization, data handling, and tool safety still belong to the system design.",
        "One internal documentation server can be connected to several compatible assistants instead of rebuilding the same integration each time.",
        [
          "Map MCP host, client, server, transport, tool, and resource on a diagram.",
          "Inspect an existing server's capability list and identify its trust boundaries."
        ],
        "A clear architecture diagram and a checklist for deciding whether MCP is useful.",
        ["MCP", "client", "server", "transport", "capability discovery"]
      ),
      lesson(
        "build-secure-mcp",
        "Build and secure an MCP integration",
        "3 hours",
        "Build",
        "Expose a small read-only domain through MCP, connect a client, and test failure and permission paths.",
        "A protocol-compatible server can still leak data or expose an overly powerful tool.",
        "Start with a narrow server and explicit input schemas. Authenticate the caller, authorize each capability, validate arguments, limit result size, redact sensitive data, and log invocation metadata. Treat third-party MCP servers as code and data entering a trust boundary.",
        "A read-only incident server exposes `get_incident` and `search_runbooks`, while keeping raw database and filesystem access private.",
        [
          "Build a small MCP server with two read-only capabilities.",
          "Connect a client and test unauthorized access, invalid input, and oversized output."
        ],
        "A working MCP client/server pair plus a security review.",
        ["MCP server", "MCP client", "authentication", "authorization", "redaction"]
      )
    ]
  },
  {
    id: "agents",
    number: "05",
    title: "Agent Foundations and Workflow Patterns",
    shortTitle: "Agent foundations",
    time: "12–16 hours",
    hours: 14,
    summary:
      "Learn when autonomy helps, when a fixed workflow is better, and how to bound planning, tool use, and reflection.",
    prerequisite: "Reliable model calls and the complete tools phase.",
    outcome: "You can choose an appropriate control pattern instead of calling every model integration an agent.",
    accent: "blue",
    lessons: [
      lesson(
        "agent-loop",
        "The agent loop and ReAct",
        "3 hours",
        "Concept + Build",
        "Understand the repeated cycle of observing state, choosing an action, executing it, and deciding what comes next.",
        "Without a clear loop, agents can call tools forever, repeat failed actions, or finish without enough evidence.",
        "An agent combines a model-driven policy with tools and state. ReAct-style behavior alternates between reasoning about the situation and taking an observable action. In an implementation, keep internal reasoning private while logging decisions, tool calls, results, and stop conditions.",
        "A research assistant searches, reads two useful sources, notices a missing date, performs one more search, then stops when the answer criteria are met.",
        [
          "Trace one request through observation, action, result, and termination.",
          "Add call, time, and token budgets to the loop."
        ],
        "A bounded single-agent loop with visible operational events.",
        ["agent loop", "ReAct", "observation", "action", "stop condition"]
      ),
      lesson(
        "workflow-vs-agent",
        "Workflow or agent?",
        "2 hours",
        "Concept",
        "Choose deterministic code, a model-assisted workflow, or an autonomous loop based on uncertainty.",
        "Excess autonomy raises cost and debugging difficulty; too little flexibility makes open-ended tasks brittle.",
        "Use normal code when rules are known. Use a workflow when steps are known but one or more decisions benefit from a model. Use an agent when the sequence itself must adapt to the request. Start with the least autonomous design that meets the requirement.",
        "Invoice extraction is a workflow; investigating an unfamiliar production incident may justify an agent that selects tools dynamically.",
        [
          "Classify ten product ideas as deterministic code, workflow, or agent.",
          "Write the evidence that would justify moving one workflow to an agent."
        ],
        "A repeatable decision framework for choosing control flow.",
        ["deterministic workflow", "autonomy", "control flow", "complexity"]
      ),
      lesson(
        "workflow-patterns",
        "Five useful workflow patterns",
        "3 hours",
        "Concept + Build",
        "Practice prompt chaining, routing, parallelization, orchestrator-worker, and evaluator-optimizer flows.",
        "Most production systems need a small number of understandable patterns, not an unrestricted agent.",
        "Chaining breaks a task into dependent stages. Routing selects a specialist path. Parallelization runs independent work together. Orchestrator-worker creates and delegates subtasks. Evaluator-optimizer reviews output and requests targeted improvement. Each pattern needs an exit condition and a merge strategy.",
        "A release-note workflow extracts changes, routes security items to a specialist, drafts sections in parallel, then checks coverage once.",
        [
          "Implement a router and one parallel fan-out example.",
          "Add an evaluator that can request at most one revision."
        ],
        "Two small workflows and a written comparison of their tradeoffs.",
        ["chaining", "routing", "parallelization", "orchestrator-worker", "evaluator-optimizer"]
      ),
      lesson(
        "planning-and-reflection",
        "Planning and reflection",
        "3 hours",
        "Concept + Build",
        "Use explicit plans and targeted self-review only when they improve difficult multi-step work.",
        "Planning can reduce missed steps, while repeated reflection can add unnecessary model calls, latency, and cost.",
        "A useful plan is a small, editable task structure tied to observable completion. Reflection should evaluate specific criteria and trigger a bounded correction, not ask the same model whether its own answer is “good.” External evidence and deterministic checks are stronger reviewers.",
        "A migration assistant plans schema inspection, compatibility checks, code changes, and validation; a test runner—not the model—confirms success.",
        [
          "Represent a plan as structured tasks with status and evidence.",
          "Add one criterion-based review step with a strict retry limit."
        ],
        "A plan-and-review loop that terminates and reports evidence.",
        ["planning", "reflection", "task state", "verification", "retry budget"]
      ),
      lesson(
        "agent-failure-modes",
        "Agent failure modes and budgets",
        "3 hours",
        "Concept + Build",
        "Design for loops, tool errors, context drift, conflicting instructions, partial completion, and uncontrolled spend.",
        "An agent that succeeds under expected conditions may still be unsafe or unaffordable under production traffic and unpredictable inputs.",
        "Bound every variable resource: steps, wall-clock time, tokens, tool calls, result size, and monetary spend. Preserve enough state to explain why the run stopped. Distinguish a successful answer from partial completion, refusal, timeout, and system error.",
        "A data assistant stops after three failed schema lookups, returns what it learned, and asks for a human-provided table name.",
        [
          "Create a failure matrix for one agent.",
          "Inject tool errors, irrelevant results, and a looping instruction, then verify termination."
        ],
        "An agent run policy with explicit budgets and user-visible terminal states.",
        ["loop detection", "budgets", "partial completion", "timeouts", "failure injection"]
      )
    ]
  },
  {
    id: "langgraph",
    number: "06",
    title: "Stateful Workflows with LangGraph",
    shortTitle: "LangGraph",
    time: "18–24 hours",
    hours: 22,
    summary:
      "Make control flow, state transitions, recovery, memory, and human approval explicit with graph-based orchestration.",
    prerequisite: "The agent and workflow phase, plus confidence with typed Python data structures.",
    outcome: "You can build durable workflows whose state and transitions are easy to inspect and test.",
    accent: "coral",
    lessons: [
      lesson(
        "state-nodes-and-edges",
        "State, nodes, and edges",
        "4 hours",
        "Concept + Build",
        "Model a workflow as typed shared state, small node functions, and explicit transitions.",
        "Long orchestration functions hide which step changed data and make partial recovery difficult.",
        "State stores the durable facts a workflow needs. Nodes read state and return updates. Edges describe what can run next. Keep nodes small, name state fields by business meaning, and avoid placing unbounded raw objects in checkpointed state.",
        "A support workflow stores ticket ID, verified customer, classification, proposed action, approval, and final result as separate fields.",
        [
          "Run the repository state-machine routing demo.",
          "Convert a linear model-and-tool script into three nodes with typed state."
        ],
        "A graph whose state changes can be explained one node at a time.",
        ["StateGraph", "state schema", "nodes", "edges", "state updates"],
        "langgraph-state-machine"
      ),
      lesson(
        "routing-and-reducers",
        "Conditional routing, parallel work, and reducers",
        "4 hours",
        "Concept + Build",
        "Branch on state, fan work out, and merge concurrent updates without losing information.",
        "Parallel branches can overwrite one another or produce results that cannot be combined predictably.",
        "Conditional edges choose a destination from current state. Fan-out sends independent tasks to several nodes. Reducers define how multiple updates combine, such as appending messages or merging result lists. Merge behavior should be deterministic and tested.",
        "A knowledge assistant sends a question to product, support, and engineering sources in parallel, then combines their cited results.",
        [
          "Build a conditional router with a fallback branch.",
          "Add parallel specialist calls and a reducer that preserves source labels."
        ],
        "A routed and parallel graph with deterministic merge behavior.",
        ["conditional edges", "Send", "fan-out", "reducers", "merge"]
      ),
      lesson(
        "checkpoints-and-durable-execution",
        "Checkpoints and durable execution",
        "4 hours",
        "Concept + Build",
        "Persist workflow state so a run can pause, resume, retry, and survive process failure.",
        "Long or approval-dependent jobs cannot rely on one in-memory request staying alive.",
        "A checkpointer saves graph state by a stable thread or run identifier. Durable execution resumes from recorded progress instead of repeating every successful step. Side effects still need idempotency because recovery can revisit a boundary.",
        "A contract-review workflow pauses overnight for legal approval and resumes at the approval node the next morning.",
        [
          "Run a checkpoint demo and resume the same thread after stopping the process.",
          "Document which node boundaries may safely replay."
        ],
        "A resumable graph with tested recovery behavior.",
        ["checkpoint", "thread ID", "durable execution", "replay", "persistence"],
        "langgraph-state-machine"
      ),
      lesson(
        "memory-and-context-lifecycle",
        "Memory and context lifecycle",
        "3 hours",
        "Concept + Build",
        "Separate short-term workflow state from long-term user or domain memory.",
        "Storing every conversation forever creates privacy, relevance, and context-quality problems.",
        "Short-term memory supports the current run or thread. Long-term memory stores selected information across threads. Define what may be remembered, who can read it, how confidence and provenance are recorded, and when it expires or is deleted. Retrieval should select relevant memories rather than dumping the entire store.",
        "A coding assistant may remember the repository's test command, but it should not preserve a temporary access token from a debug conversation.",
        [
          "Define a memory schema with provenance, scope, confidence, and expiration.",
          "Implement an allowlist for what one demo may persist."
        ],
        "A memory policy and a small scoped memory implementation.",
        ["short-term memory", "long-term memory", "store", "provenance", "retention"]
      ),
      lesson(
        "human-in-the-loop",
        "Human-in-the-loop and propose–commit–verify",
        "4 hours",
        "Concept + Build",
        "Pause before risky actions, show a meaningful proposal, capture a decision, then verify the real outcome.",
        "A generic “approve?” button is not useful when the reviewer cannot see what will change.",
        "An interrupt should carry the proposed action, important inputs, expected impact, and alternatives. After approval, ordinary code executes the action and records its result. The workflow then verifies the external state before claiming success.",
        "Before changing a subscription, the reviewer sees the customer, old plan, new plan, prorated amount, and policy reason.",
        [
          "Add an interrupt to the repository state-machine demo.",
          "Implement approve, reject, and edit paths plus post-action verification."
        ],
        "A reviewable action workflow with an auditable decision record.",
        ["interrupt", "human review", "approval", "propose-commit-verify", "audit"]
      ),
      lesson(
        "controlled-rag-and-sql-graphs",
        "Controlled RAG and SQL graphs",
        "3 hours",
        "Build",
        "Apply explicit state and routing to retrieval and database question answering.",
        "High-level agents are convenient, but production teams often need to know exactly when retrieval, query generation, checking, and execution occur.",
        "A RAG graph can decide to retrieve, grade evidence, rewrite a weak query, and generate. A SQL graph can inspect schema, generate a query, validate read-only behavior, execute, and synthesize. Graphs expose each boundary for testing and policy enforcement.",
        "If a generated query references a missing column, the SQL workflow returns to schema inspection instead of repeating the same execution.",
        [
          "Run both repository LangGraph workflows.",
          "Compare their states, conditional edges, safety checks, and termination rules."
        ],
        "A design note explaining when the graph versions justify their added code.",
        ["agentic RAG graph", "SQL workflow", "query checking", "routing", "recursion limit"],
        "langgraph-rag"
      )
    ]
  },
  {
    id: "multi-agent",
    number: "07",
    title: "Multi-Agent Systems",
    shortTitle: "Multi-agent",
    time: "10–14 hours",
    hours: 12,
    summary:
      "Use multiple specialists only when separation of context, permissions, ownership, or parallel work creates measurable value.",
    prerequisite: "A reliable single agent and the core LangGraph phase.",
    outcome: "You can design and challenge a multi-agent architecture instead of adding agents for novelty.",
    accent: "green",
    lessons: [
      lesson(
        "when-multi-agent",
        "When multiple agents are justified",
        "3 hours",
        "Concept",
        "Evaluate context isolation, parallelism, permissions, ownership, and quality before splitting a system.",
        "Multiple agents add handoff errors, duplicated context, extra latency, and more model calls.",
        "A multi-agent design is useful when specialists need distinct instructions or tools, work can run independently, permissions must be isolated, or one context would become overloaded. If one agent with a router or a few tools works, that is usually easier to operate.",
        "A security investigator and a billing specialist may need different data access; two writing personas do not automatically need separate agents.",
        [
          "Score three system ideas against a multi-agent decision checklist.",
          "Draw the simpler single-agent alternative for each."
        ],
        "An architecture decision record that justifies—or rejects—multi-agent design.",
        ["specialization", "context isolation", "permission isolation", "coordination cost"]
      ),
      lesson(
        "supervisor-worker",
        "Supervisor and worker patterns",
        "3 hours",
        "Concept + Build",
        "Let an orchestrator decompose a task, delegate bounded work, and synthesize labeled results.",
        "Delegation fails when workers receive vague tasks or the supervisor cannot tell whether the work is complete.",
        "A supervisor owns the overall objective and creates explicit worker assignments. Workers return results, evidence, status, and unresolved questions. The supervisor should not hide failures during synthesis, and delegation depth needs a limit.",
        "A research supervisor assigns pricing, security, and integration research to separate workers, then combines cited findings into a decision brief.",
        [
          "Define a structured worker task and result schema.",
          "Implement one parallel supervisor-worker flow with partial-failure handling."
        ],
        "A bounded delegation workflow with traceable source ownership.",
        ["supervisor", "worker", "delegation", "task schema", "synthesis"]
      ),
      lesson(
        "handoffs-and-routing",
        "Handoffs, routers, and skills",
        "3 hours",
        "Build",
        "Transfer control or load specialist context without losing the user's task state.",
        "A handoff that forwards only chat text can lose verified data, approvals, or the reason routing occurred.",
        "A router selects a destination while keeping central control. A handoff transfers active responsibility to another specialist. Skills can progressively load domain instructions into one agent. Choose based on whether you need a new owner, a different tool boundary, or simply more context.",
        "A support intake agent verifies warranty details, then hands the structured case to a resolution specialist with the verification attached.",
        [
          "Run the customer-support handoff and knowledge-base router labs.",
          "Compare router, handoff, and skill-loading designs for one domain."
        ],
        "A clear routing strategy and a state contract between specialists.",
        ["handoffs", "router", "skills", "progressive disclosure", "state transfer"],
        "customer-support-handoffs"
      ),
      lesson(
        "multi-agent-evaluation",
        "Shared state, evaluation, and cost",
        "3 hours",
        "Concept + Build",
        "Measure the whole system and each specialist while controlling duplicated context and model calls.",
        "A strong final answer can hide a weak specialist, and a correct system can still be too slow or expensive to operate.",
        "Give each message and result a clear owner and provenance. Track routing accuracy, worker task success, synthesis quality, handoff loss, latency, and total calls. Compare the multi-agent system with a simpler baseline to prove the added coordination earns its cost.",
        "A knowledge router may improve source coverage but triple latency; parallel execution and selective routing may recover the tradeoff.",
        [
          "Add per-agent timing, token, tool, and outcome metrics.",
          "Run the same evaluation set through single- and multi-agent versions."
        ],
        "A benchmark showing where multi-agent architecture helps and where it does not.",
        ["shared state", "routing accuracy", "handoff quality", "token cost", "baseline"]
      )
    ]
  },
  {
    id: "production",
    number: "08",
    title: "Production Agent Engineering",
    shortTitle: "Production",
    time: "20–28 hours",
    hours: 26,
    summary:
      "Add evaluations, traces, security boundaries, resilience, cost controls, deployment, and release discipline.",
    prerequisite: "At least one complete single-agent or LangGraph system.",
    outcome: "You can operate an agentic service and explain its quality, risk, latency, and cost with evidence.",
    accent: "blue",
    lessons: [
      lesson(
        "eval-driven-development",
        "Evaluation-driven development",
        "4 hours",
        "Concept + Build",
        "Create a representative dataset, scoring rules, baselines, and release gates before tuning endlessly.",
        "Anecdotal demonstrations can overrepresent successful examples and make regressions difficult to detect.",
        "Start with real task categories and important failure modes. Record expected facts, tools, sources, actions, or refusal behavior. Combine deterministic checks, carefully designed model graders, and human review. Keep a baseline so every prompt, model, or retrieval change has a comparison.",
        "A support agent release fails if policy citation accuracy drops, even when its average writing score improves.",
        [
          "Build a versioned evaluation dataset from normal, edge, and adversarial cases.",
          "Define a small set of release-blocking metrics."
        ],
        "A repeatable evaluation pipeline with a baseline report.",
        ["offline evaluation", "golden dataset", "model grader", "human review", "release gate"]
      ),
      lesson(
        "observability-and-tracing",
        "Observability and tracing",
        "4 hours",
        "Build",
        "Trace model calls, tool calls, graph transitions, retrieval, errors, latency, and usage without leaking sensitive content.",
        "Application logs that say only “request failed” cannot explain a bad tool choice or missing evidence.",
        "A trace connects the user request to every meaningful span: context assembly, retrieval, model call, tool execution, state transition, and final result. Store identifiers, timing, status, model and prompt versions, and redacted metadata. Sample or restrict raw content based on privacy requirements.",
        "A trace attributes a slow request to a reranker timeout and a fallback model call.",
        [
          "Instrument one repository agent with structured run events.",
          "Use a trace to diagnose a deliberately injected failure."
        ],
        "A useful run trace and an operational dashboard outline.",
        ["tracing", "spans", "latency", "prompt version", "redaction"]
      ),
      lesson(
        "cost-caching-and-routing",
        "Cost, caching, and model routing",
        "4 hours",
        "Concept + Build",
        "Estimate per-run cost and use caching, context reduction, batching, or model routing deliberately.",
        "Agent loops can multiply model and tool usage, turning a low-cost prototype into an unpredictable service.",
        "Track input, cached-input, and output tokens per call and aggregate them by workflow. Cache only when inputs and permissions make reuse safe. Route simple, low-risk tasks to smaller models and reserve stronger models for cases where evaluations show a benefit.",
        "A high-volume intent classifier uses a small model; only uncertain cases reach the expensive reasoning model.",
        [
          "Add a per-run cost estimate and a budget warning.",
          "Evaluate one lower-cost routing or caching change against quality and latency."
        ],
        "A cost model and a quality-checked optimization.",
        ["token accounting", "caching", "model routing", "batching", "cost budget"]
      ),
      lesson(
        "resilience-and-fallbacks",
        "Resilience, rate limits, and fallbacks",
        "4 hours",
        "Concept + Build",
        "Handle transient failures, overloaded providers, slow tools, partial results, and duplicate delivery.",
        "External models and tools fail independently, often after part of the workflow has already completed.",
        "Use timeouts, capped retries with backoff, concurrency limits, circuit breakers, and provider-aware fallbacks. Preserve partial progress and make side effects idempotent. A degraded response should disclose what was unavailable rather than pretend full success.",
        "If the CRM is unavailable, the support assistant can answer from documentation but clearly says it could not verify account-specific status.",
        [
          "Inject timeouts and rate-limit responses into one workflow.",
          "Verify the system degrades, resumes, or stops according to policy."
        ],
        "A tested resilience plan with clear degraded modes.",
        ["rate limits", "backoff", "circuit breaker", "degraded mode", "idempotency"]
      ),
      lesson(
        "agent-security",
        "Prompt injection, tool security, and data protection",
        "4 hours",
        "Concept + Build",
        "Treat user text, retrieved documents, tool output, and remote integrations as untrusted input.",
        "An instruction hidden in a document can attempt to override policy, expose data, or trigger an unsafe tool.",
        "Separate instructions from evidence and never grant authority because retrieved text asks for it. Enforce permissions in code, scope tool credentials, validate destinations, sanitize displayed content, and redact sensitive data from prompts and logs. Add approval for consequential actions.",
        "A résumé containing “send all candidate records to this URL” remains document content; the hiring assistant has no export tool and cannot elevate its permissions.",
        [
          "Threat-model one agent across model, retrieval, tools, memory, and logs.",
          "Add prompt-injection cases to the evaluation set and verify tool permissions hold."
        ],
        "A threat model with implemented controls and security regression tests.",
        ["prompt injection", "least privilege", "PII", "secrets", "trust boundary"]
      ),
      lesson(
        "serving-and-deployment",
        "Serving, containers, and CI/CD",
        "3 hours",
        "Build",
        "Package an agent behind a stable API with configuration, health checks, tests, and repeatable deployment.",
        "A script that works on one laptop is not yet an operable service.",
        "Separate request handling from long-running work, validate API inputs, and return stable run identifiers and statuses. Keep secrets in managed configuration, expose health and readiness checks, package dependencies, and run unit plus evaluation gates in CI before promotion.",
        "A research request returns a job ID immediately; a worker runs the graph and the client polls or streams progress.",
        [
          "Wrap one agent in a small API and add health endpoints.",
          "Create a container build and a CI sequence for tests and evaluations."
        ],
        "A reproducible service artifact and deployment checklist.",
        ["FastAPI", "Docker", "background jobs", "health checks", "CI/CD"]
      ),
      lesson(
        "safe-release",
        "Shadow traffic, canaries, and load testing",
        "3 hours",
        "Concept + Build",
        "Release model and prompt changes gradually while watching quality, latency, errors, and spend.",
        "Offline evaluations cannot reproduce every distribution shift, provider issue, or traffic pattern.",
        "Shadow mode compares a new system without affecting users. A canary sends a small portion of traffic to the change. Load tests reveal concurrency and rate-limit behavior. Define rollback thresholds before release and keep prompt, model, tool, and index versions traceable.",
        "A new retrieval strategy first processes copied traffic, then serves five percent of requests until citation quality and latency stay within limits.",
        [
          "Design a staged release for a prompt or model change.",
          "Run a small load test and document the first bottleneck."
        ],
        "A release and rollback plan backed by measurable thresholds.",
        ["shadow mode", "canary", "load test", "rollback", "versioning"]
      )
    ]
  },
  {
    id: "capstone",
    number: "09",
    title: "Customer Operations Lite Capstone",
    shortTitle: "Capstone",
    time: "35–50 hours",
    hours: 44,
    summary:
      "Combine the roadmap into a portfolio-safe customer operations system built with synthetic data and generic business rules.",
    prerequisite: "Core phases 01–08. Voice and deep-research extensions are optional.",
    outcome: "You complete a portfolio system supported by architecture, reliability, safety, and operational evidence.",
    accent: "coral",
    lessons: [
      lesson(
        "capstone-scope-and-architecture",
        "Scope, synthetic data, and architecture",
        "8–10 hours",
        "Capstone",
        "Define a narrow customer-operations product without copying proprietary workflows, data, prompts, or business logic.",
        "A capstone needs enough realism to prove engineering skill while remaining safe to publish and possible to finish.",
        "Use fictional customers, synthetic conversations, invented policies, and a small set of public-safe workflows. Document actors, data boundaries, risks, success metrics, and non-goals. Choose a modular architecture so retrieval, SQL, tools, and orchestration can be evaluated separately.",
        "A fictional SaaS company needs account summaries, support triage, policy answers, and approval-gated renewal actions.",
        [
          "Write a public-safe product brief and non-goals.",
          "Create synthetic customer, ticket, knowledge-base, and account data.",
          "Draw the service, data, model, and trust boundaries."
        ],
        "An approved capstone specification and architecture decision record.",
        ["synthetic data", "scope", "architecture", "trust boundaries", "non-goals"]
      ),
      lesson(
        "capstone-data-and-tools",
        "Retrieval, SQL, and business tools",
        "9–12 hours",
        "Capstone",
        "Build grounded knowledge answers, structured account queries, and narrow domain actions.",
        "The system must combine unstructured policy knowledge with structured customer facts without confusing their authority.",
        "Use RAG for handbook and product knowledge, read-only SQL for synthetic account facts, and domain tools for clear actions. Every result keeps source and freshness metadata. Mutating tools remain mocked or approval-gated and use idempotency.",
        "The assistant retrieves the cancellation policy, queries the fictional customer's plan, then proposes—but does not silently execute—the allowed next step.",
        [
          "Implement and evaluate the retrieval index.",
          "Add a read-only SQL path with query validation.",
          "Create at least two narrow tools with typed errors and audit events."
        ],
        "A tested data-and-tool layer with citations and clear authority.",
        ["RAG", "SQL agent", "domain tools", "citations", "idempotency"],
        "langgraph-sql"
      ),
      lesson(
        "capstone-orchestration",
        "Orchestration, memory, and human review",
        "9–12 hours",
        "Capstone",
        "Route requests through explicit state, preserve case context, and interrupt consequential actions for review.",
        "A useful operations assistant needs more than chat: it must track case state and prove who approved what.",
        "Model the case as typed graph state. Route knowledge, account, and action requests to controlled nodes. Keep short-term case memory separate from selected long-term preferences. High-impact operations use propose–approve–execute–verify and store an audit record.",
        "A renewal-risk case gathers evidence in parallel, drafts a retention option, pauses for an operator, and records the verified mock result.",
        [
          "Build the graph and terminal states.",
          "Add checkpointed resume and a human-review screen or CLI step.",
          "Test rejection, edit, timeout, and tool-failure paths."
        ],
        "A durable workflow that can be inspected, paused, and safely resumed.",
        ["LangGraph", "routing", "memory", "human-in-the-loop", "audit trail"],
        "customer-support-handoffs"
      ),
      lesson(
        "capstone-production-proof",
        "Evaluation, observability, security, and demo",
        "10–16 hours",
        "Capstone",
        "Prove the system works, explain its limits, and package it as a portfolio project.",
        "A technical review is more credible when it presents measured tradeoffs and documented failure modes.",
        "Create an evaluation set spanning routing, retrieval, SQL, tool choice, safety, and refusal. Trace every run, calculate latency and cost, and test prompt injection plus permission boundaries. Package a repeatable demo, architecture diagram, README, and short walkthrough using only synthetic data.",
        "The final report shows 90% routing accuracy, citation failures by category, p95 latency, estimated run cost, and the exact cases still routed to humans.",
        [
          "Run the full offline evaluation and summarize failures.",
          "Add traces, cost accounting, security tests, and a load baseline.",
          "Record a five-minute demo explaining one success, one failure, and one tradeoff."
        ],
        "A portfolio-ready capstone with evidence, documentation, and a safe public demonstration.",
        ["evaluation", "observability", "security", "deployment", "portfolio"]
      )
    ]
  }
];

export const allLessons = curriculum.flatMap((phase) =>
  phase.lessons.map((item, index) => ({
    ...item,
    phaseId: phase.id,
    phaseNumber: phase.number,
    phaseTitle: phase.title,
    phaseTime: phase.time,
    orderInPhase: index
  }))
);

export type CurriculumLesson = (typeof allLessons)[number];

export function getLesson(slug: string) {
  return allLessons.find((item) => item.slug === slug);
}

export function getPhase(id: string) {
  return curriculum.find((phase) => phase.id === id);
}

export function getAdjacentLessons(slug: string) {
  const index = allLessons.findIndex((item) => item.slug === slug);
  return {
    previous: index > 0 ? allLessons[index - 1] : undefined,
    next: index >= 0 && index < allLessons.length - 1 ? allLessons[index + 1] : undefined
  };
}

export const totalHours =
  Math.round(curriculum.reduce((sum, phase) => sum + phase.hours, 0) / 5) * 5;
