export type GlossaryTerm = {
  term: string;
  definition: string;
  example: string;
  category: "Foundations" | "Retrieval" | "Agents" | "Orchestration" | "Production";
};

export const glossary: GlossaryTerm[] = [
  {
    term: "Agent",
    definition: "A system in which a model chooses the next action from available tools and current state.",
    example: "A research agent decides whether to search, read another source, or finish.",
    category: "Agents"
  },
  {
    term: "Agent loop",
    definition: "The repeated observe, decide, act, and inspect cycle used by an agent.",
    example: "The model calls a search tool, reads the result, and decides whether another search is needed.",
    category: "Agents"
  },
  {
    term: "Attention",
    definition: "The transformer mechanism that lets each token weigh information from other tokens.",
    example: "Attention helps a model connect a pronoun with the earlier person or object it refers to.",
    category: "Foundations"
  },
  {
    term: "BM25",
    definition: "A lexical ranking method that scores documents using matching terms and their importance.",
    example: "BM25 is useful when a query contains an exact ticket number or product code.",
    category: "Retrieval"
  },
  {
    term: "Canary release",
    definition: "A release sent to a small portion of real traffic before broader rollout.",
    example: "Five percent of requests use the new retrieval pipeline while quality and latency are watched.",
    category: "Production"
  },
  {
    term: "Checkpoint",
    definition: "A persisted snapshot of workflow state that allows a run to pause and resume.",
    example: "A contract review resumes after a human approves it the next day.",
    category: "Orchestration"
  },
  {
    term: "Chunk",
    definition: "A bounded piece of a source document stored and retrieved as one unit.",
    example: "A handbook section and its heading become one chunk.",
    category: "Retrieval"
  },
  {
    term: "Circuit breaker",
    definition: "A resilience control that temporarily stops calls to a failing dependency.",
    example: "After repeated provider errors, requests use a fallback instead of increasing the outage load.",
    category: "Production"
  },
  {
    term: "Context engineering",
    definition: "The practice of selecting, ordering, labeling, and budgeting information supplied to a model.",
    example: "A support request includes the relevant policy, verified account facts, and only recent messages.",
    category: "Foundations"
  },
  {
    term: "Context window",
    definition: "The maximum token space available for instructions, messages, evidence, tool results, and output.",
    example: "A workflow reserves part of the window for the final answer instead of filling it with chat history.",
    category: "Foundations"
  },
  {
    term: "Cosine similarity",
    definition: "A common way to compare the direction of two embedding vectors.",
    example: "A query retrieves chunks whose vectors point in a similar semantic direction.",
    category: "Retrieval"
  },
  {
    term: "Deterministic workflow",
    definition: "A system whose sequence of steps is fixed by code even if a model is used inside a step.",
    example: "Retrieve documents, generate an answer, then validate citations every time.",
    category: "Agents"
  },
  {
    term: "Durable execution",
    definition: "The ability to continue a workflow from persisted progress after a pause or process failure.",
    example: "A long research job restarts from its last successful node.",
    category: "Orchestration"
  },
  {
    term: "Embedding",
    definition: "A numeric representation that places semantically related inputs near one another.",
    example: "Questions about ending a subscription sit near a policy section about cancellation.",
    category: "Retrieval"
  },
  {
    term: "Evaluation dataset",
    definition: "A versioned collection of representative inputs and expected behavior used to measure a system.",
    example: "Fifty support questions cover normal, edge, and prompt-injection cases.",
    category: "Production"
  },
  {
    term: "Fallback",
    definition: "An alternate path used when the preferred model, tool, or workflow cannot complete the task.",
    example: "A difficult extraction goes to human review after one failed repair attempt.",
    category: "Production"
  },
  {
    term: "Fan-out",
    definition: "Sending independent pieces of work to multiple branches that can run in parallel.",
    example: "Product, security, and pricing research run at the same time.",
    category: "Orchestration"
  },
  {
    term: "Function calling",
    definition: "A model capability that returns a structured proposal to invoke a named function or tool.",
    example: "The model proposes `get_order_status` with an order identifier.",
    category: "Agents"
  },
  {
    term: "Grounding",
    definition: "Constraining an answer to supplied evidence or verified tool results.",
    example: "A policy answer cites the retrieved handbook section instead of relying on model memory.",
    category: "Retrieval"
  },
  {
    term: "Hallucination",
    definition: "Confident-looking generated content that is unsupported, incorrect, or invented.",
    example: "A model invents a refund exception that is absent from the policy.",
    category: "Foundations"
  },
  {
    term: "Handoff",
    definition: "A transfer of active responsibility and relevant state from one specialist agent to another.",
    example: "Intake verifies a warranty and hands the case to a resolution specialist.",
    category: "Agents"
  },
  {
    term: "Human-in-the-loop",
    definition: "A workflow design that pauses for a person to review, edit, approve, or reject a step.",
    example: "An operator approves the exact account change before execution.",
    category: "Orchestration"
  },
  {
    term: "Hybrid retrieval",
    definition: "Retrieval that combines semantic vector search with lexical or other ranking signals.",
    example: "A search uses both meaning and an exact incident identifier.",
    category: "Retrieval"
  },
  {
    term: "Idempotency",
    definition: "The property that repeating the same operation does not create an additional effect.",
    example: "Retrying a refund request with the same key creates only one refund.",
    category: "Production"
  },
  {
    term: "Inference",
    definition: "Running a trained model on new input to produce probabilities, text, or another output.",
    example: "Calling a hosted chat model to classify a support message is inference.",
    category: "Foundations"
  },
  {
    term: "LangGraph",
    definition: "A framework for building stateful agent and workflow control flow as graphs.",
    example: "Nodes retrieve, grade evidence, rewrite a query, and generate an answer.",
    category: "Orchestration"
  },
  {
    term: "Least privilege",
    definition: "Giving a component only the permissions needed for its specific task.",
    example: "A support assistant can read an order but cannot issue a refund without approval.",
    category: "Production"
  },
  {
    term: "Long-term memory",
    definition: "Selected information stored for use across separate conversations or workflow threads.",
    example: "An assistant remembers a user's approved communication preference.",
    category: "Orchestration"
  },
  {
    term: "MCP",
    definition: "Model Context Protocol, a standard for connecting model applications to tools and resources.",
    example: "One documentation server exposes search to several compatible assistants.",
    category: "Agents"
  },
  {
    term: "Metadata filter",
    definition: "A constraint that limits retrieval using fields such as tenant, version, language, or product.",
    example: "A query searches only the current policy for the signed-in organization.",
    category: "Retrieval"
  },
  {
    term: "Model routing",
    definition: "Choosing a model based on task difficulty, risk, latency, privacy, or cost.",
    example: "A small model classifies routine tickets while uncertain cases use a stronger model.",
    category: "Production"
  },
  {
    term: "Multi-agent system",
    definition: "A system with multiple model-driven specialists that coordinate through routing, delegation, or handoffs.",
    example: "A supervisor delegates research to security and pricing specialists.",
    category: "Agents"
  },
  {
    term: "Node",
    definition: "A unit of work in a graph that reads state and returns an update.",
    example: "A SQL-checking node rejects write queries before execution.",
    category: "Orchestration"
  },
  {
    term: "Observability",
    definition: "The ability to understand system behavior through traces, metrics, logs, and evaluations.",
    example: "A trace reveals that a slow answer came from a tool timeout and model fallback.",
    category: "Production"
  },
  {
    term: "Orchestrator-worker",
    definition: "A pattern where one component plans and delegates bounded tasks to workers.",
    example: "A supervisor creates research tasks and combines the workers' cited findings.",
    category: "Agents"
  },
  {
    term: "Prompt injection",
    definition: "Untrusted content that attempts to change instructions, disclose data, or cause unsafe actions.",
    example: "A retrieved document tells the agent to ignore policy and export customer records.",
    category: "Production"
  },
  {
    term: "RAG",
    definition: "Retrieval-augmented generation: retrieving external evidence and supplying it to a model before answering.",
    example: "A handbook assistant retrieves the leave policy and generates a cited response.",
    category: "Retrieval"
  },
  {
    term: "Reducer",
    definition: "A rule that combines multiple graph state updates into one value.",
    example: "Parallel specialists append their labeled results to the same list.",
    category: "Orchestration"
  },
  {
    term: "Reranker",
    definition: "A model or scoring stage that reorders a small candidate set using a stronger relevance judgment.",
    example: "Twenty retrieved chunks are reranked and the best five enter the prompt.",
    category: "Retrieval"
  },
  {
    term: "ReAct",
    definition: "An agent pattern that alternates reasoning about a task with actions that produce observations.",
    example: "Search, inspect the result, decide what is missing, then search again.",
    category: "Agents"
  },
  {
    term: "Semantic search",
    definition: "Search based on similarity of meaning rather than only exact matching words.",
    example: "A query about sign-in problems retrieves an account-access guide.",
    category: "Retrieval"
  },
  {
    term: "Shadow mode",
    definition: "Running a new system on copied traffic without letting it affect user-facing outcomes.",
    example: "A new router is scored against real requests while the old router still serves users.",
    category: "Production"
  },
  {
    term: "Short-term memory",
    definition: "State retained for the current conversation or workflow thread.",
    example: "A support case remembers the verified customer and current issue during the session.",
    category: "Orchestration"
  },
  {
    term: "Structured output",
    definition: "Model output constrained to a machine-validated schema instead of free-form prose.",
    example: "A classifier returns category, urgency, and review requirement as typed fields.",
    category: "Foundations"
  },
  {
    term: "Token",
    definition: "A unit of text processed by a language model; it may be a word, word piece, punctuation, or symbol.",
    example: "A long identifier can consume several tokens even though it looks like one string.",
    category: "Foundations"
  },
  {
    term: "Tool",
    definition: "A controlled function or external capability that a model-powered application can invoke.",
    example: "A tool retrieves the status of one order after validating its identifier.",
    category: "Agents"
  },
  {
    term: "Tool schema",
    definition: "The typed description of a tool's name, purpose, arguments, and often its result contract.",
    example: "A weather tool requires a location and an allowed unit enum.",
    category: "Agents"
  },
  {
    term: "Trace",
    definition: "A connected record of the important operations performed during one request or run.",
    example: "The trace includes retrieval, two model calls, one tool call, and a final validation.",
    category: "Production"
  },
  {
    term: "Vector database",
    definition: "A store optimized for indexing embeddings and retrieving nearby vectors, usually with metadata.",
    example: "Document chunks are searched by semantic similarity and filtered by tenant.",
    category: "Retrieval"
  },
  {
    term: "Workflow",
    definition: "An explicit sequence or graph of steps used to complete a task.",
    example: "Classify a request, retrieve policy, draft a response, and request review.",
    category: "Agents"
  }
];

export const glossaryCategories = [
  "All",
  "Foundations",
  "Retrieval",
  "Agents",
  "Orchestration",
  "Production"
] as const;
