export type LessonFormat = "Concept" | "Capstone";

export type Lesson = {
  slug: string;
  title: string;
  time: string;
  format: LessonFormat;
  summary: string;
  content: string[];
  example: string;
  concepts: string[];
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
  summary: string,
  content: string[],
  example: string,
  concepts: string[],
  format: LessonFormat = "Concept"
): Lesson => ({ slug, title, time, format, summary, content, example, concepts });

export const curriculum: CurriculumPhase[] = [
  {
    id: "llm-fundamentals",
    number: "01",
    title: "LLM Fundamentals",
    shortTitle: "LLM fundamentals",
    time: "15 hours",
    hours: 15,
    summary: "Understand how large language models generate responses, use context, and fit into an application.",
    prerequisite: "Comfort with a programming language, HTTP APIs, JSON, and basic backend development.",
    outcome: "You can describe the role of an LLM in an application and make informed decisions about models, context, and generated output.",
    accent: "blue",
    lessons: [
      lesson(
        "what-is-a-large-language-model",
        "What Is a Large Language Model?",
        "3 hours",
        "Learn what an LLM produces and why an application must not treat fluent language as verified information.",
        [
          "A large language model is a neural network trained to predict the next piece of text in a sequence. It processes a prompt as tokens, estimates a probability distribution for the next token, and repeats that process until it finishes. This simple mechanism can produce explanations, summaries, classifications, and structured data because the model has learned broad language and programming patterns during training.",
          "The model does not query a live source of truth when it answers. Its training knowledge can be incomplete, outdated, or wrong, and a confident response is not evidence that a claim is correct. An AI application therefore supplies current facts through a database, a search system, or a tool, then validates important outputs before another system acts on them.",
          "For an engineer, the useful boundary is clear: an LLM is a flexible interpretation and generation component. Business rules, permissions, money movement, and authoritative records remain ordinary software responsibilities. That division makes the system easier to test and safer to operate."
        ],
        "In the Customer Service Agent, the model can interpret a customer message such as “my item arrived damaged” and identify the likely request. It will not decide whether a refund is allowed; the application will look up the order and apply the policy separately.",
        ["tokens", "next-token prediction", "generation", "grounding"]
      ),
      lesson(
        "how-llms-are-trained-and-improved",
        "How LLMs Are Trained and Improved",
        "3 hours",
        "Understand the stages that make a base language model useful for instruction following, tool use, and application work.",
        [
          "Most modern LLMs begin with pretraining on a large collection of text and code. During this stage, the model learns statistical relationships in language, syntax, facts, and common problem-solving patterns by predicting missing or next tokens. Pretraining creates a capable base model, but it does not give the model a precise product role or a guaranteed way to follow an application's instructions.",
          "Post-training makes a base model more useful in conversation and applications. Instruction training teaches the model to respond to requests, while preference-based training improves how it follows useful and safe response patterns. Models may also be trained on structured outputs and tool calls, which is why some models are more dependable than others for extraction or selecting an approved function.",
          "These stages explain model behavior, but they are not a substitute for application design. A model that is better at following instructions can still be given stale evidence, an ambiguous tool description, or an unsafe permission. Engineers evaluate the model on their own task instead of assuming a training label guarantees production behavior."
        ],
        "The capstone will compare models on a small set of refund messages. One model may be suitable for classifying a straightforward request, while a stronger model may be reserved for explaining a policy exception after the system has retrieved the relevant evidence.",
        ["pretraining", "post-training", "instruction following", "model evaluation"]
      ),
      lesson(
        "transformer-architecture-and-attention",
        "Transformer Architecture and Attention",
        "3 hours",
        "Build practical intuition for the architecture behind current language models without requiring mathematical derivations.",
        [
          "Transformer models convert tokens into numerical representations and process them through many layers. Attention lets each token weigh other relevant tokens in the request, so the meaning of a word can depend on the surrounding instructions, conversation, and documents. Positional information tells the model where each token appears, preserving the order of language.",
          "During text generation, causal attention prevents the model from seeing future tokens. It can only use the prompt and the tokens it has already generated. Multiple attention heads and feed-forward layers allow the model to represent different relationships across the sequence, such as a policy condition, a referenced order number, or a constraint in the system instructions.",
          "An application engineer does not need to implement a transformer to use this knowledge well. The important implication is that context is finite and competing information can affect the result. Clear source boundaries, intentional ordering, and concise evidence usually help more than placing every available document into a prompt."
        ],
        "A later capstone request may include the customer message, a short order summary, and a policy excerpt. The application will keep the policy heading with the excerpt so the model can connect a rule to its conditions rather than seeing a disconnected paragraph.",
        ["transformer", "attention", "positional information", "causal generation"]
      ),
      lesson(
        "inference-tokens-context-and-latency",
        "Inference: Tokens, Context Windows, and Latency",
        "3 hours",
        "Learn how a model turns a request into an answer and how request size affects speed, cost, and available context.",
        [
          "Inference is the process of running a trained model for a request. The model receives input tokens, generates output tokens one at a time, and stops when it reaches an end condition or output limit. Sampling settings influence how the next token is selected: lower variation tends to produce more consistent output, while higher variation can produce more diverse wording but also more variation in behavior.",
          "Every model has a context window: the combined space available for instructions, conversation history, retrieved documents, tool definitions, tool results, and the answer. A large window is useful, but it does not remove the need to choose relevant information. Longer inputs generally increase cost and latency, and irrelevant text can distract from the facts that matter.",
          "Providers often use cached attention states, commonly called a KV cache, to make continued generation and repeated prefixes faster. From an application perspective, measure the full request: input size, output size, tool time, and end-to-end latency. A feature should have an explicit context budget rather than growing its prompt without limit."
        ],
        "For a refund question, the capstone will allocate context space for the system instructions, the latest customer message, a concise order projection, and a few retrieved policy passages. It will leave room for the final answer instead of sending an unlimited conversation transcript.",
        ["inference", "context window", "sampling", "KV cache"]
      ),
      lesson(
        "using-llm-apis-and-langchain",
        "Using LLM APIs and LangChain",
        "3 hours",
        "Use a provider SDK or LangChain while keeping model behavior, versions, and application boundaries visible.",
        [
          "An LLM API call is one component in an application request. The client selects a model, sends instructions and input, sets output limits, and receives generated text or structured data. Many providers also support streaming responses, tool definitions, and structured-output contracts. These features change the interface, but the surrounding system still owns authentication, retries, timeouts, logging, and user experience.",
          "LangChain is a framework that provides common interfaces and integrations for models, messages, tools, structured output, document loaders, and retrieval. It can reduce repeated provider-specific code, especially when an application needs to compare models or combine several components. It is optional: a direct provider SDK is often clearer for a small feature, and the framework should not obscure the prompt, the data sent to the model, or the application's control flow.",
          "Model selection is task-specific. A smaller model may be sufficient for routing or extracting a few fields, while a reasoning-oriented model may help with complex analysis or planning. Reasoning does not remove the need for clear inputs, trustworthy evidence, structured outputs, or evaluation; the application should judge the result and its evidence rather than depend on an opaque reasoning trace. Treat prompts, model identifiers, output schemas, and framework versions as application dependencies. Recording them for an important run makes later debugging and evaluation possible."
        ],
        "The Customer Service Agent will use LangChain's model integration for customer-message interpretation and for explaining an approved policy result. Each run will still record the actual provider model, response time, and token use so the framework does not hide operating behavior.",
        ["model APIs", "LangChain", "model routing", "versioning"]
      )
    ]
  },
  {
    id: "prompts-context-structured-output",
    number: "02",
    title: "Prompt Engineering, Context Engineering, and Structured Outputs",
    shortTitle: "Prompts & context",
    time: "12 hours",
    hours: 12,
    summary: "Design model requests, assemble trusted context, and return validated data for application code.",
    prerequisite: "LLM Fundamentals or equivalent experience calling a model API.",
    outcome: "You can define the task boundary, the information supplied to a model, and the contract used to accept its result.",
    accent: "green",
    lessons: [
      lesson(
        "prompt-engineering-for-applications",
        "Prompt Engineering for Applications",
        "4 hours",
        "Use prompts to define a bounded task, its allowed inputs, and the required form of the result.",
        [
          "A prompt is the request an application gives to a model. In an application, it commonly includes system-level instructions, task-specific directions, data supplied for the current request, and a response contract. Strong prompts are specific about the model's job, the evidence it may use, the decisions it must not make, and how it should behave when information is missing.",
          "Prompt engineering is not a collection of clever phrases. It is an iterative engineering practice: identify the task, write an initial instruction, test it against representative and difficult cases, then change one part at a time. Examples can clarify a format or distinction, but they should reflect real application data and should not be used to hide a missing rule or unavailable source of truth.",
          "Keep the prompt focused on language work. If the task requires authorization, arithmetic, a database lookup, or a policy decision, the application should provide a deterministic component for that work. This makes the prompt simpler and exposes the true source of a failure."
        ],
        "The refund-intake prompt will ask the model to identify the customer’s issue, requested outcome, and missing details. It will explicitly state that the model cannot approve a refund or invent order information, because those are application responsibilities.",
        ["system instructions", "task definition", "few-shot examples", "prompt versions"]
      ),
      lesson(
        "context-engineering",
        "Context Engineering",
        "4 hours",
        "Select, prepare, order, and budget the information a model receives for a particular request.",
        [
          "Context engineering is the application work of deciding what goes into a model request. It includes selecting recent conversation turns, trusted customer data, retrieved documents, tool results, and task instructions. The aim is not to maximize the amount of text; it is to provide the smallest complete set of information needed for the next decision or response.",
          "Different sources carry different levels of trust. A customer message is necessary input but may contain incorrect claims or adversarial instructions. An order record is authoritative for order facts. A policy document may be current, superseded, or internal-only. Labeling those sources and keeping their roles separate helps the model use the context correctly and helps the application prevent unwanted disclosure.",
          "Context also has a lifecycle. Long conversations need summaries, retrieved evidence needs citations and version metadata, and tool results should be kept only while they remain relevant. Engineers define a context budget, determine how information is ordered, and remove data that does not serve the current task."
        ],
        "When a customer asks about a damaged delivery, the capstone will assemble only the relevant message, a safe subset of the order, and current customer-facing policy evidence. Internal notes, payment details, and an outdated policy will remain outside the model context.",
        ["context assembly", "trusted sources", "context budget", "conversation state"]
      ),
      lesson(
        "structured-outputs-and-validation",
        "Structured Outputs and Validation",
        "4 hours",
        "Use a schema to turn a model response into a data contract that application code can validate before use.",
        [
          "Free-form text is useful for a customer-facing explanation, but it is a fragile interface for routing, tool calls, and business logic. Structured output asks the model to return named fields with defined types and allowed values. A schema can require a category, an order reference, a list of item identifiers, a confidence signal, or a reason that a required field is missing.",
          "A schema improves the interface but does not make model output authoritative. Application code still validates the response against real data and business rules. An item identifier should exist in the retrieved order; an enum value should be allowed; a proposed amount should be checked by policy code. Invalid or incomplete output should follow a defined path, such as asking a clarification question or escalating the request.",
          "This pattern separates interpretation from action. The model can transform messy natural language into a typed proposal, while the application retains control over what is accepted, stored, shown to a user, or executed."
        ],
        "The capstone will represent a refund request as a structured proposal containing the request reason, relevant order items, missing information, and a short explanation. Before the proposal is accepted, the application will confirm that every selected item belongs to the order.",
        ["schemas", "validation", "typed contracts", "fallback behavior"]
      )
    ]
  },
  {
    id: "retrieval-augmented-generation",
    number: "03",
    title: "Retrieval-Augmented Generation (RAG)",
    shortTitle: "RAG",
    time: "18 hours",
    hours: 18,
    summary: "Retrieve relevant, current information before an LLM writes an answer.",
    prerequisite: "LLM Fundamentals and practical familiarity with files, APIs, and data structures.",
    outcome: "You can design, inspect, and evaluate a RAG feature that uses the right evidence for a response.",
    accent: "coral",
    lessons: [
      lesson(
        "what-is-retrieval-augmented-generation",
        "What Is Retrieval-Augmented Generation?",
        "3 hours",
        "Understand the RAG pattern, its two stages, and when it is the right source of information for an AI feature.",
        [
          "Retrieval-augmented generation, usually called RAG, is an application pattern that retrieves relevant information at request time and supplies it to a model before the model generates a response. It is useful when an answer should be based on documents that are too recent, too specific, or too changeable to rely on the model’s training knowledge alone.",
          "RAG has two separate stages. At indexing time, the application prepares documents, creates searchable records, and stores metadata such as source, audience, and effective date. At query time, it interprets a question, searches the eligible records, chooses the best evidence, and places that evidence into the model’s context with source references.",
          "RAG is not the answer to every data problem. Use a database or tool for exact, transactional facts such as an order status. Use deterministic code for policy calculations and permissions. Use a static prompt only for information that is small and stable. RAG is most useful for explanatory knowledge that lives in changing documents."
        ],
        "The capstone will use RAG to answer questions about a fictional refund policy. It will use a read-only order tool, rather than RAG, when it needs the exact items and delivery date for a particular order.",
        ["RAG", "indexing", "query-time retrieval", "grounded answers"]
      ),
      lesson(
        "document-ingestion-and-chunking",
        "Document Ingestion and Chunking",
        "4 hours",
        "Prepare source documents as searchable records that retain the structure and metadata needed for safe retrieval.",
        [
          "Document ingestion turns source files into a consistent internal representation. The system extracts text, preserves meaningful headings and source locations, normalizes formats, and records metadata. Metadata is not an optional decoration: it can identify a document version, the intended audience, an effective date, a product area, or a source URL.",
          "Chunking divides a document into smaller units that can be retrieved independently. A useful chunk carries enough surrounding context to be understood on its own, often including the section heading and a small amount of adjacent text. Fixed-size chunks are easy to create, but structure-aware chunks often preserve policy conditions and exceptions more effectively.",
          "There is no universal chunk size. A chunk that is too small may lose the rule’s qualifiers; a chunk that is too large may contain several unrelated ideas and retrieve poorly. Engineers inspect actual chunks, test them against real questions, and retain stable identifiers so an answer can cite the original source."
        ],
        "The Customer Service Agent will ingest three fictional policy documents: a current return policy, a superseded policy, and an internal escalation guide. Each searchable chunk will keep its document version, audience, heading, and source location.",
        ["document ingestion", "chunking", "metadata", "document versions"]
      ),
      lesson(
        "embeddings-and-vector-databases",
        "Embeddings and Vector Databases",
        "4 hours",
        "Learn how semantic search represents meaning and why similarity is only one part of evidence selection.",
        [
          "An embedding is a numerical representation of text produced by an embedding model. Texts with related meaning tend to be positioned near one another in the embedding space, which allows a system to retrieve a policy section even when the customer uses different wording. A question about a broken delivery may therefore retrieve a section titled “damaged items.”",
          "A vector database or vector index stores embeddings alongside the original content and metadata. At query time, the system embeds the question and finds nearby records using a similarity measure. The returned similarity score is a search signal, not a truth score. It does not prove that a record is current, permitted for the user, or sufficient to support the final answer.",
          "Embedding quality depends on the source text, chunk boundaries, model choice, and query wording. Engineers use metadata filters and evaluation cases to compensate for those limits. They inspect results directly rather than assuming a vector search result is suitable evidence just because it is ranked first."
        ],
        "A customer asking “my parcel was damaged when it arrived” will be matched to the fictional retailer’s “Damaged items” policy section even though the customer did not use the document’s exact language. The system will still verify that the section is current and customer-safe before using it.",
        ["embeddings", "vector search", "similarity", "vector databases"]
      ),
      lesson(
        "hybrid-search-and-reranking",
        "Hybrid Search and Reranking",
        "3 hours",
        "Improve retrieval by combining exact-term search, semantic search, filtering, and a second-stage ranking step.",
        [
          "Semantic retrieval helps with different wording, while keyword retrieval is strong for exact product names, policy codes, dates, and uncommon terms. Hybrid search combines candidates from both methods so the system can benefit from each. A common approach merges the ranked lists before the application selects a small candidate set for the next stage.",
          "Metadata filtering should happen before the final evidence is chosen. It limits the search to records the user is allowed to see and records that are valid for the request. This is especially important for policy systems where an expired or internal document may use very similar language to the current public policy.",
          "Reranking applies a more precise relevance model to a small number of retrieved candidates. It can improve the order of results, but it adds latency and cost. Add it because an evaluation set shows a need, not because it is expected in every RAG architecture."
        ],
        "For a return question, the capstone will first restrict retrieval to current customer-facing documents. It will then combine semantic and keyword candidates, and use reranking only if evaluation cases show that the first results often miss the relevant policy condition.",
        ["hybrid search", "metadata filters", "reranking", "reciprocal rank fusion"]
      ),
      lesson(
        "rag-evaluation-and-grounded-answers",
        "RAG Evaluation and Grounded Answers",
        "4 hours",
        "Evaluate retrieval separately from generation and define how the application behaves when the evidence is missing or unsuitable.",
        [
          "A RAG answer can fail because the search missed the right source, selected an ineligible source, assembled poor context, or generated a claim that the retrieved text did not support. Evaluating only the final wording hides these distinct causes. Retrieval evaluation asks whether the expected evidence was found and ranked highly enough; answer evaluation asks whether the response uses that evidence correctly.",
          "A useful evaluation case includes a realistic question, the search scope, expected evidence, and forbidden evidence. The forbidden set is important when a document is outdated, internal-only, or unrelated but lexically similar. Measures such as recall at a chosen number of results and rank quality help diagnose whether the search layer is doing its job.",
          "A grounded answer cites the evidence it relied on and avoids making a policy claim when no adequate evidence is available. The appropriate response to missing information may be a clarification question, an explanation of the limitation, or escalation to a person. It should not be a polished guess."
        ],
        "The capstone evaluation set will include a question whose answer is present only in the current policy, a similar rule in a superseded policy that must be excluded, and an internal escalation note that must never reach a customer response.",
        ["RAG evaluation", "recall", "forbidden evidence", "citations"]
      )
    ]
  },
  {
    id: "tool-calling-and-mcp",
    number: "04",
    title: "Tool Calling and Model Context Protocol (MCP)",
    shortTitle: "Tools & MCP",
    time: "15 hours",
    hours: 15,
    summary: "Connect an LLM to tools while application code keeps control of permissions and execution.",
    prerequisite: "LLM Fundamentals and structured-output concepts.",
    outcome: "You can design tool boundaries, approve model-proposed calls, and understand where MCP fits into an AI application.",
    accent: "yellow",
    lessons: [
      lesson(
        "function-calling-and-tool-design",
        "Function Calling and Tool Design",
        "5 hours",
        "Understand how models propose typed tool calls and how a well-designed tool limits a task to one clear business capability.",
        [
          "Function calling gives a model a list of tools, their descriptions, and their parameter schemas. Instead of producing a natural-language instruction such as “look up order 123,” the model can propose a structured call with a tool name and arguments. The application receives that proposal, validates it, performs deterministic work, and returns the result as another piece of context.",
          "A tool should have a narrow purpose and a stable contract. Its description should explain when it is appropriate, its input schema should constrain what can be requested, and its result should return only the data needed by the task. Timeouts, clear errors, and idempotent behavior matter because models can retry or choose a tool at an unexpected point in a conversation.",
          "The model proposes an action; it does not gain direct system access. Authorization, input validation, rate limits, and data handling remain in the tool implementation. This separation lets an engineer change prompts or models without weakening the boundary around a business system."
        ],
        "The capstone will offer a read-only order lookup tool. The model can ask for an order by its reference, but the tool will return only item, delivery, and refund-history facts needed for the refund task.",
        ["function calling", "tool schemas", "typed interfaces", "idempotency"]
      ),
      lesson(
        "tool-safety-and-permissions",
        "Tool Safety and Permissions",
        "5 hours",
        "Design clear boundaries between a model’s proposal, a policy decision, human approval, and a consequential action.",
        [
          "Tools can give an AI application useful access to current information or external systems, but each tool also creates a trust boundary. A model can misunderstand a request, receive an adversarial instruction, or select the wrong operation. The system should therefore apply least privilege: make only the minimum capabilities available for the task and expose read-only access when write access is unnecessary.",
          "Consequential actions need additional controls. Separate a proposed action from execution, validate it against deterministic policy, verify user authorization, and require confirmation or human review when appropriate. For operations that may be retried, use idempotency so the same approved request cannot create multiple side effects.",
          "Tool safety is more than a warning inside a prompt. It is enforced by schemas, permissions, data projections, policy code, logs, and approval state. That allows a safe failure even if a model produces an unexpected tool request."
        ],
        "A refund specialist may produce a typed refund proposal, but it will not have a refund-write tool. Deterministic policy logic and a simulated human reviewer will decide whether the proposal can move forward, keeping the model away from the final side effect.",
        ["least privilege", "authorization", "human approval", "side effects"]
      ),
      lesson(
        "model-context-protocol",
        "Model Context Protocol (MCP)",
        "5 hours",
        "Learn how MCP standardizes the connection between AI clients and external tools, resources, and prompts.",
        [
          "Model Context Protocol, or MCP, is an open protocol for connecting AI applications to external capabilities. An MCP server can publish tools, resources, and prompt templates; an MCP client discovers and uses the approved capabilities. The protocol provides a common interface so the same integration can be used by different AI clients without each client inventing its own connection format.",
          "MCP describes how a client and server communicate. It does not automatically make a tool secure or authorized. The server still determines identity, authentication, data access, parameter validation, audit logging, and which operations are available. An unsafe tool exposed through MCP remains unsafe; a well-designed tool keeps its protections regardless of the protocol used to reach it.",
          "For application design, use MCP when a capability is valuable across several clients or should be managed as a separate integration boundary. Keep the first server small and explicit. A simple read-only capability is enough to learn discovery, schemas, calls, errors, and access controls."
        ],
        "The Customer Service Agent will expose the fictional order lookup through a small MCP server. An approved client can request a safe order summary, while any operation that would modify an order or issue a refund remains unavailable through the server.",
        ["MCP", "MCP server", "MCP client", "integration boundaries"]
      )
    ]
  },
  {
    id: "agentic-workflows",
    number: "05",
    title: "Agentic Workflows",
    shortTitle: "Agentic workflows",
    time: "17 hours",
    hours: 17,
    summary: "Design agent workflows with state, controlled decisions, and human oversight where needed.",
    prerequisite: "LLM APIs, structured outputs, and basic tool calling.",
    outcome: "You can distinguish a workflow from an agent and design bounded, stateful graph workflows when they are justified.",
    accent: "blue",
    lessons: [
      lesson(
        "what-is-an-agent",
        "What Is an Agent?",
        "3 hours",
        "Define an agent precisely and distinguish it from a single LLM request or a fixed workflow.",
        [
          "An LLM request is one input and one output. A workflow is a sequence controlled by application code, such as validate input, search documents, call a service, and return a result. An agent is a bounded loop in which a model examines the current goal and observations, chooses one permitted next action, receives the outcome, and continues until it reaches a completion condition.",
          "Agents are useful when the next step genuinely depends on interpreting the current situation. They are not automatically better than a workflow. A known sequence is simpler to test, less expensive, and easier to explain when it remains in ordinary application code. Policy decisions, authorization, and irreversible actions should normally stay deterministic even when an agent is involved.",
          "A practical agent definition includes a goal, a small set of tools, an explicit observation format, limits on steps and cost, and clear conditions for completion, clarification, or escalation. Without these boundaries, the term agent can hide a system that is difficult to control or evaluate."
        ],
        "In the capstone, a model may decide whether the next useful step is to request an order reference, use the order lookup tool, search the policy, or ask a clarification question. The subsequent policy check and approval flow will remain fixed application logic.",
        ["agents", "workflows", "agent loop", "bounded actions"]
      ),
      lesson(
        "agent-loops-and-workflows",
        "Agent Loops and Workflows",
        "4 hours",
        "Design the sequence around an agent so the system has clear transitions, stopping rules, and control points.",
        [
          "An agent loop alternates between model decisions and observations from tools or application state. Common patterns include react-style loops, where the model acts on the next available information, and plan-and-execute flows, where a high-level plan is followed by narrower steps. The pattern matters less than making the available actions and exit conditions explicit.",
          "Workflow code should own predictable transitions. It can validate a tool request, persist state, enforce a limit, route a policy outcome, or send a task to review. The model should decide only within the part of the process that benefits from language interpretation or variable next steps. This hybrid approach makes the system easier to inspect than either a fully scripted flow or an unbounded agent.",
          "Every loop needs limits. Step count, execution time, token budget, tool timeout, and maximum retry count prevent a request from continuing indefinitely. When a limit is reached, the application should return a defined state rather than quietly repeating the same model call."
        ],
        "The refund flow will first run a fixed validation step. If information is missing, a bounded agent can choose a clarification question. Once sufficient information is available, the workflow will move deterministically to policy evaluation and, when needed, human review.",
        ["agent loop", "workflow orchestration", "stop conditions", "budgets"]
      ),
      lesson(
        "state-memory-and-durable-workflows",
        "State, Memory, and Durable Workflows",
        "4 hours",
        "Store the facts and progress of a task explicitly instead of relying on a growing chat transcript.",
        [
          "State is the structured record of a request while it moves through a workflow. It can include the customer’s stated issue, an order reference, retrieved evidence, a proposal, the current status, and a reason for escalation. Explicit state makes it clear which facts are confirmed, who owns them, and which transition is allowed next.",
          "Memory is broader. It may include recent conversation history, a summary of older messages, selected preferences, or prior task outcomes. Memory should not become a replacement for authoritative records. An order database remains the source of truth for the order; policy code remains the source of truth for eligibility; the workflow state records what has happened in this request.",
          "Durable workflows persist enough state to recover from delays, restarts, or human review. A checkpoint after an expensive lookup or before a review step lets the system continue without guessing what happened earlier. The design should make resumed tasks predictable and auditable."
        ],
        "The Customer Service Agent will use named states such as awaiting order reference, awaiting details, proposal ready, needs human review, and complete. A stored proposal and evidence references will let a reviewer resume the same request without reconstructing it from model conversation history.",
        ["workflow state", "memory", "checkpoints", "durable execution"]
      ),
      lesson(
        "graph-based-workflows-with-langgraph",
        "Graph-Based Workflows with LangGraph",
        "3 hours",
        "Model a stateful workflow as named steps and transitions, then use LangGraph where durable execution and human oversight are needed.",
        [
          "A graph-based workflow represents work as named nodes and edges. A node performs one responsibility, such as validating input, calling a model, retrieving evidence, applying a policy, or preparing a review task. An edge describes where the request can go next. Conditional edges make the route depend on explicit state, such as whether an order reference is present or whether a proposal requires review.",
          "Graphs are useful when a request has several meaningful paths, can return to a previous step, or must pause and resume. The graph should make model-directed decisions and deterministic transitions equally visible. It is not an excuse to turn every small feature into a complex diagram; a linear function remains the better choice when the sequence is fixed and short.",
          "LangGraph is a framework for running stateful agent and workflow graphs. It provides concepts for graph state, checkpoints, streaming, and interrupts for human review. Learn the workflow design first, then use LangGraph to implement the parts that need persistence or controlled pauses. The same engineering boundaries still apply if another framework or ordinary application code is used."
        ],
        "The capstone graph will contain nodes for request validation, triage, policy retrieval, read-only order lookup, refund-proposal validation, policy evaluation, and human review. A high-value proposal will follow an explicit edge to a paused review state instead of allowing a model to continue on its own.",
        ["graph workflows", "LangGraph", "nodes and edges", "conditional routing"]
      ),
      lesson(
        "specialists-and-multi-agent-systems",
        "Specialists and Multi-Agent Systems",
        "3 hours",
        "Use multiple agents only when distinct responsibilities require different context, tools, instructions, or evaluation criteria.",
        [
          "A specialist is a focused model component or agent with a narrow responsibility. It has a defined input, a small allowed tool set, a clear output contract, and evaluation cases for its own task. A multi-agent system routes work between two or more specialists. The value comes from meaningful separation of responsibilities, not from adding more named agents.",
          "Specialists are appropriate when one task needs a different source of information, permission boundary, or success measure than another. For example, a triage component can identify the request type, while a refund component can gather order and policy evidence. Passing a concise structured handoff is usually better than passing an entire unfiltered conversation between agents.",
          "Avoid a multi-agent design when one well-scoped workflow or agent can perform the work. More agents increase latency, cost, context management, and the number of failure paths. Each specialist should justify its existence through a clear responsibility and a measurable improvement."
        ],
        "The capstone will use a triage specialist to identify refund-related requests and a refund specialist to collect evidence and prepare a proposal. Neither specialist will own the policy decision or execute a refund; those remain deterministic components outside the multi-agent boundary.",
        ["specialists", "multi-agent systems", "handoffs", "routing"]
      )
    ]
  },
  {
    id: "evaluation-observability-safety",
    number: "06",
    title: "Evaluation, Observability, and Safety",
    shortTitle: "Evaluation & safety",
    time: "18 hours",
    hours: 18,
    summary: "Evaluate AI behavior, trace requests, protect users and data, and manage cost and releases.",
    prerequisite: "The earlier phases. These practices should be applied continuously as the application grows.",
    outcome: "You can present evidence for an AI feature’s quality, inspect a failed run, and explain its safety and operating boundaries.",
    accent: "green",
    lessons: [
      lesson(
        "evaluation-driven-development",
        "Evaluation and Testing",
        "4 hours",
        "Use a versioned set of realistic cases to guide changes to prompts, retrieval, models, tools, and workflows.",
        [
          "Evaluation-driven development treats behavior as something to measure before and after a change. An evaluation case describes an input, the expected behavior, and unacceptable outcomes. Depending on the feature, it can check structured extraction, retrieved evidence, selected tools, a workflow route, a final answer, or an escalation decision.",
          "AI evaluations should be specific to the system boundary being tested. Retrieval quality and final answer quality are different measures. A tool-using agent should be evaluated on the tools it selects and the resulting state, not only on whether its final paragraph sounds good. Automated checks, human review, and model-based judging can all be useful when their limitations are understood.",
          "The evaluation set grows from real usage. A failed or surprising request should be categorized, anonymized if needed, and added as a regression case. This creates a disciplined way to improve the application instead of relying on a few memorable demonstrations."
        ],
        "The capstone will begin with cases for damaged items, a missing order reference, conflicting policy versions, a tool failure, and a request requiring review. Each change to retrieval or instructions will be compared against the same set before it is accepted.",
        ["evaluation sets", "regression testing", "task metrics", "failure categories"]
      ),
      lesson(
        "observability-and-tracing",
        "Observability and Tracing",
        "4 hours",
        "Record the information needed to understand how a model-backed request moved through the system.",
        [
          "Observability makes an AI application inspectable after it runs. A trace connects one customer request to the model calls, assembled context, retrieved evidence, tool proposals, tool results, state changes, and final response that occurred along the way. It helps an engineer identify the first incorrect step instead of treating the whole run as a black box.",
          "Useful trace records include stable request IDs, timestamps, model and prompt versions, document versions, tool names, latency, token usage, and evaluation labels. Sensitive customer data should be minimized or redacted according to the application’s privacy rules. The goal is enough evidence to debug behavior without logging everything indiscriminately.",
          "Tracing also supports product decisions. It shows which tools are slow, which context is repeatedly irrelevant, where a workflow loops, and how much a task costs. A trace is most useful when it can be connected to an evaluation case, an incident, or a clear engineering question."
        ],
        "A complete capstone trace will show a customer request entering the system, the safe order lookup, the policy documents retrieved, the refund proposal returned by the specialist, the deterministic policy result, and any human-review transition.",
        ["tracing", "observability", "version records", "debugging"]
      ),
      lesson(
        "safety-and-guardrails",
        "Safety and Guardrails",
        "4 hours",
        "Protect the application from untrusted content, misuse of tools, unnecessary data exposure, and unsafe outcomes.",
        [
          "AI application safety begins with clear trust boundaries. Customer messages, web pages, and retrieved documents may contain instructions that conflict with the application’s intent. Treat this material as data, not as authority. The system instructions, tool permissions, schemas, and deterministic policy checks should remain outside that untrusted content.",
          "Guardrails are the controls that keep a request within acceptable boundaries. They can include content checks, input validation, data minimization, access controls, rate limits, step limits, approval requirements, and safe fallback states. A guardrail is effective when the application enforces it even if the model produces an unexpected answer or tool request.",
          "Safety testing is practical engineering work. It includes adversarial inputs, prompt-injection attempts in retrieved text, requests for unavailable data, malformed tool arguments, and transitions that should require human oversight. The resulting controls should be documented as part of the system design."
        ],
        "One fictional internal policy document will include a malicious instruction intended to change the assistant’s behavior. The capstone will treat the text only as retrieved content, exclude the document from customer search, and verify that no specialist can gain access to an unavailable refund-write operation.",
        ["prompt injection", "guardrails", "data minimization", "approval controls"]
      ),
      lesson(
        "cost-latency-and-release-management",
        "Cost, Latency, and Release Management",
        "3 hours",
        "Balance quality with the time and cost of operating an AI application, then release changes with evidence.",
        [
          "An AI request has several sources of latency and cost: model input and output tokens, retrieval, reranking, tool execution, retries, and workflow steps. Measuring only the final model call misses much of the user experience. Record the end-to-end time and cost for representative cases, then identify which component is responsible when a target is missed.",
          "Common improvements include using a smaller model for a narrow task, reducing irrelevant context, caching stable results, parallelizing independent operations, or removing an unnecessary agent step. Each improvement has tradeoffs. A cache can return stale data; a smaller model can reduce structured-output quality; a reranker can improve evidence selection while adding latency.",
          "A release should compare an intended change against the existing behavior. Rerun evaluations, review traces for important cases, track key operating measures, and keep a rollback path if behavior regresses. This treats a prompt, model, or retrieval update with the same care as a change to other production dependencies."
        ],
        "The capstone will compare two policy-answer configurations: one with a smaller context and one with additional retrieval steps. The team will use evaluation quality, response time, and cost to decide whether the added complexity is worthwhile before documenting the chosen configuration.",
        ["cost", "latency", "caching", "release management"]
      ),
      lesson(
        "deploying-ai-applications",
        "Deploying AI Applications",
        "3 hours",
        "Prepare an AI application for a real environment with safe configuration, external-service boundaries, and a controlled release process.",
        [
          "Deploying an AI application includes the same foundations as other services: separate environments, configuration outside source code, secret management, request authentication, useful logs, and a clear way to roll back a change. Model providers, vector stores, and MCP servers are external dependencies, so their failures, permissions, timeouts, and rate limits belong in the application design.",
          "The first production-ready version does not need complex infrastructure. It needs a clear request boundary, predictable error handling, a way to run evaluations before release, and monitoring that shows whether the live service is behaving differently from the tested version. The architecture should keep private data out of logs and should never rely on a local development setting in a deployed environment.",
          "Continuous integration can run ordinary tests and the evaluation set whenever the application changes. Deployment should be an explicit step after those checks, with the selected model, prompt, document index, and tool contracts identified. That creates a practical baseline for a portfolio project without requiring learners to study model-serving infrastructure."
        ],
        "The Customer Service Agent will be deployed with fictional data and environment-specific configuration. Before a new version is released, the project will run its evaluation cases and confirm that the deployed service has only the read-only tools and document sources intended for the demo.",
        ["deployment", "configuration", "secrets", "release checks"]
      )
    ]
  },
  {
    id: "customer-service-agent-capstone",
    number: "07",
    title: "Customer Service Agent Capstone",
    shortTitle: "Capstone",
    time: "25 hours",
    hours: 25,
    summary: "Bring the roadmap together in a small public application for customer refund requests.",
    prerequisite: "Completion of the core modules, or equivalent experience with LLMs, RAG, tools, and evaluation.",
    outcome: "You can demonstrate a coherent AI application with explicit boundaries, evidence, and engineering documentation.",
    accent: "coral",
    lessons: [
      lesson(
        "capstone-scope-and-architecture",
        "Capstone Scope and Architecture",
        "5 hours",
        "Define a small, finishable customer-service scenario and the components that own each responsibility.",
        [
          "The capstone is a public, fictionalized customer-service application rather than a copy of any private system. Its purpose is to demonstrate the engineering patterns from the course through one complete journey: a customer asks about a refund, the application gathers permitted facts and policy evidence, produces a proposal, applies deterministic rules, and routes the outcome appropriately.",
          "The architecture should stay intentionally small. It needs a request boundary, a knowledge component for policy documents, a read-only order capability, a workflow state, an LLM component for interpretation and explanation, and an approval path. It does not need a large microservice estate, production payment integration, or real customer data to demonstrate the relevant decisions.",
          "Scope is part of the engineering design. Supported requests, excluded requests, synthetic data, success measures, and human-review conditions should be written down before implementation begins. A narrow project with a complete evaluation story is more valuable than a broad project that cannot be explained or finished."
        ],
        "The initial scope will support damaged-item refund questions for a fictional retailer. It will contain a small set of invented orders and policies, and it will explicitly exclude payment processing, real customer accounts, and automatic refund execution.",
        ["system design", "scope", "synthetic data", "architecture"],
        "Capstone"
      ),
      lesson(
        "capstone-rag-and-policy-knowledge",
        "Capstone RAG and Policy Knowledge",
        "5 hours",
        "Apply the RAG concepts to a policy knowledge base that can support customer-safe explanations.",
        [
          "The knowledge component turns fictional policy documents into an auditable source for answers. Each document should carry its version, audience, and effective date. The retrieval path should filter this metadata before the model sees any text, so customer-facing answers cannot rely on an expired rule or expose an internal escalation note.",
          "The application should preserve evidence references throughout the request. A retrieved passage is not only temporary model context; it is also an input to evaluation, a citation in the customer-facing answer, and a record that helps an engineer explain a later result. The capstone should define what happens when no suitable policy evidence is found.",
          "The RAG implementation remains a component of the larger workflow. It answers document-based policy questions, but it does not determine a specific customer’s eligibility on its own. That decision depends on current order facts and deterministic policy logic."
        ],
        "For a damaged-item question, the capstone will retrieve the current public policy section and show its citation in the explanation. If only the superseded policy matches, the application will not use it as a basis for a customer-facing answer.",
        ["knowledge base", "policy evidence", "metadata filtering", "citations"],
        "Capstone"
      ),
      lesson(
        "capstone-tools-and-refund-proposals",
        "Capstone Tools and Refund Proposals",
        "5 hours",
        "Use a read-only order capability and structured output to turn a customer request into a proposal for review.",
        [
          "The order tool provides authoritative facts that are not appropriate for document retrieval: the order’s items, delivery status, delivery date, and a limited refund history. It exposes a minimal projection of those facts and has no ability to modify an order. Its result becomes trusted context for the narrow task of understanding the request.",
          "The model’s responsibility is to prepare a structured proposal. It can identify which item appears relevant, what the customer is asking for, what evidence was used, and what information is still missing. The application validates identifiers against the order record and keeps any calculation or eligibility decision outside the model output.",
          "This separation makes the proposal inspectable. A reviewer can see the customer’s stated issue, the order facts, the policy evidence, and the proposed action without assuming that generated text itself is a decision."
        ],
        "The refund specialist will use the read-only order tool for an order reference, select a damaged item from the returned list, and create a proposal describing the requested refund. The application will reject the proposal if it names an item that is not present in the order.",
        ["read-only tools", "structured proposals", "validation", "authoritative data"],
        "Capstone"
      ),
      lesson(
        "capstone-agentic-workflow-and-approval",
        "Capstone Agentic Workflow and Human Oversight",
        "5 hours",
        "Combine bounded specialists, deterministic policy logic, and human oversight in a visible request lifecycle.",
        [
          "The workflow begins by deciding whether enough information is available to proceed. A triage specialist can identify the request type and a refund specialist can gather the right evidence or ask a clarification question. Their work remains bounded by specific input, context, tools, and output contracts.",
          "Once a proposal is ready, deterministic policy code evaluates it against the fictional rules. This is the deliberate boundary between model assistance and a business decision. The workflow can approve a low-risk simulated outcome, deny a request with a clear reason, or mark a higher-risk or ambiguous case for human review.",
          "Human review is a workflow state, not an exceptional afterthought. The reviewer receives the evidence and proposal, records a decision, and lets the request move to a clear final state. No agent or model component is allowed to issue a real refund."
        ],
        "A high-value refund proposal will move from proposal ready to needs human review. The reviewer will see the order facts, selected policy evidence, and structured proposal, then record an approval or rejection that the workflow can explain to the customer.",
        ["specialists", "workflow state", "deterministic policy", "human review"],
        "Capstone"
      ),
      lesson(
        "capstone-evaluation-documentation-and-demo",
        "Capstone Evaluation, Documentation, and Demo",
        "5 hours",
        "Prepare the evidence and explanation that make the finished project useful as an engineering portfolio piece.",
        [
          "The final project should be demonstrated through more than a happy-path conversation. Its evaluation set should cover normal requests, missing information, policy-version conflicts, unavailable tools, prompt-injection attempts, and review-required cases. Results should make clear what the project handles today and where it deliberately stops.",
          "Documentation should describe the system boundary, its data sources, RAG design, tool contracts, workflow states, specialist responsibilities, safety controls, and key tradeoffs. A short architecture diagram and selected traces can help another engineer understand the request flow without reading every implementation detail.",
          "The demo should follow a reproducible request and show the evidence behind the outcome. The strongest explanation is straightforward: what the system knows, which component did each piece of work, what was validated deterministically, and how the team measured the behavior."
        ],
        "The final demo will show one damaged-item request from customer message to policy retrieval, order lookup, refund proposal, deterministic policy result, and human-review outcome. It will also include one case that is safely declined or escalated to demonstrate the system boundary.",
        ["evaluation report", "documentation", "traces", "portfolio"],
        "Capstone"
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

export const totalHours = curriculum.reduce((sum, phase) => sum + phase.hours, 0);
