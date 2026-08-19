export type AgentBlog = {
  headline: string;
  intro: string[];
  deepDive: string[];
  simpleExample: string;
  realWorldUseCases: string[];
  pros: string[];
  cons: string[];
  technologies: string[];
  references?: {
    label: string;
    url: string;
  }[];
  takeaway: string;
};

export const agentBlogs = {
  "semantic-search": {
    headline: "Semantic search retrieves documents by meaning.",
    intro: [
      "Semantic search lets an application search by meaning instead of exact keywords. The document is split into chunks, each chunk is converted into an embedding vector, and a vector store finds chunks that are close to the user's question.",
      "This implementation introduces the core mechanics behind RAG before adding tool calling or multi-step agent workflows."
    ],
    deepDive: [
      "Traditional search depends heavily on matching words. Semantic search works with meaning, so a question and a document can match even when they use different vocabulary.",
      "The first important object is a document. In LangChain, a document usually contains page content plus metadata such as source file, page number, or URL.",
      "Large documents are split into chunks because embedding an entire PDF page or full report often loses detail and makes retrieval less precise.",
      "Chunk size and overlap matter. Small chunks can be precise but lose context, while large chunks preserve context but may retrieve noisy text.",
      "Embeddings convert text into vectors. Similar ideas should land close together in vector space, which makes similarity search possible.",
      "A vector store saves those vectors and lets the application ask, 'Which chunks are closest to this query vector?'",
      "The lab uses an in-memory vector store, which keeps the implementation simple but does not persist data after the script exits.",
      "The embedding model is local by default, which avoids hosted embedding cost and helps engineers understand the full retrieval pipeline.",
      "Semantic search does not generate an answer. It retrieves evidence that another layer, such as a RAG chain or agent, can use.",
      "These retrieval concepts support knowledge assistants, documentation systems, and enterprise search applications."
    ],
    simpleExample:
      "If a user asks, 'What risks did Nike mention in the annual report?', the system does not search only for the word risks. It embeds the question, compares it against embedded PDF chunks, and returns passages that are semantically related to risk disclosures.",
    realWorldUseCases: [
      "Internal document search over PDFs, policies, onboarding docs, and support manuals.",
      "Legal or finance search where users need source passages instead of generic answers.",
      "Developer search across architecture notes, runbooks, and incident reports."
    ],
    pros: [
      "No LLM call is required for retrieval, so query execution can be low cost and fast after embeddings exist.",
      "Retrieved chunks are easy to inspect, which makes debugging simpler.",
      "It creates the reusable retrieval layer for later RAG and agent systems."
    ],
    cons: [
      "It returns relevant passages and requires a separate generation layer for a synthesized answer.",
      "Quality depends heavily on chunk size, overlap, embedding model, and source document quality.",
      "An in-memory vector store does not provide the persistence required for production."
    ],
    technologies: [
      "LangChain document loaders",
      "Recursive text splitting",
      "Qwen local embeddings through Hugging Face",
      "InMemoryVectorStore"
    ],
    references: [
      {
        label: "LangChain Python docs",
        url: "https://docs.langchain.com/oss/python/langchain/overview"
      }
    ],
    takeaway:
      "Learn semantic search first because it gives you the mental model for documents, chunks, embeddings, vector stores, and retrieval quality."
  },
  "rag-chain": {
    headline: "A RAG chain follows a deterministic retrieval and generation sequence.",
    intro: [
      "A RAG chain follows a deterministic sequence: retrieve relevant context, place that context into the model input, and ask the model to answer from the retrieved information.",
      "Unlike an agent, the model does not decide whether retrieval is needed. The application decides retrieval is mandatory, which makes the system easier to reason about."
    ],
    deepDive: [
      "RAG stands for retrieval-augmented generation. The model is augmented with retrieved context before it generates an answer.",
      "A RAG chain is deterministic because the application always retrieves first. The model does not choose whether to use the retriever.",
      "This is useful when you know every user question should be answered from a specific knowledge base.",
      "The chain usually has three parts: retriever, prompt builder, and model call.",
      "The retriever finds relevant chunks from a vector store using semantic similarity.",
      "The prompt builder places the user question and retrieved context into a clear instruction format.",
      "The model then answers from the supplied context and should say it does not know when context is insufficient.",
      "The main advantage is predictability. You can log the exact retrieved context and the exact model input.",
      "The main limitation is flexibility. The chain retrieves even for questions that may not need retrieval.",
      "This pattern is common in production because it has lower operating costs and is easier to test and debug than a free-form agent loop."
    ],
    simpleExample:
      "For a question like 'What does this blog say about task decomposition?', the chain retrieves matching chunks first, builds a prompt with those chunks, and makes one model call to generate the answer.",
    realWorldUseCases: [
      "Customer support answers where every response should be grounded in a knowledge base.",
      "Documentation assistants that must cite product docs before answering.",
      "Enterprise search systems where predictable latency matters."
    ],
    pros: [
      "Usually fewer LLM calls than an agentic RAG loop.",
      "Simple to debug because retrieval always happens before generation.",
      "Appropriate when every question should use the same knowledge source."
    ],
    cons: [
      "It may retrieve even when the user asks a question that does not need retrieval.",
      "It has less flexibility than an agent that can choose between tools.",
      "If retrieval fails, the model has limited ways to recover unless you add more logic."
    ],
    technologies: [
      "LangChain retrieval middleware pattern",
      "Vector store similarity search",
      "Prompt context injection",
      "Local Qwen or hosted OpenAI chat model"
    ],
    references: [
      {
        label: "LangChain Python docs",
        url: "https://docs.langchain.com/oss/python/langchain/overview"
      }
    ],
    takeaway:
      "Use a RAG chain when you want predictable, grounded answers and do not need the model to make tool-use decisions."
  },
  "rag-agent": {
    headline: "A RAG agent turns retrieval into a model-controlled tool.",
    intro: [
      "In an agentic RAG system, retrieval is exposed as a tool. The model reads the user request, decides whether it needs external context, calls the retriever if needed, then uses the returned context to answer.",
      "This design supports assistants that combine direct responses with selective searches of private or external sources."
    ],
    deepDive: [
      "A RAG agent is different from a RAG chain because retrieval becomes optional and model-controlled.",
      "The retriever is wrapped as a tool, which means the model can call it only when the user request requires external knowledge.",
      "The agent receives the user message, reasons about the task, and may produce a tool call instead of a final answer.",
      "The application executes the retrieval tool and sends the retrieved content back as a tool message.",
      "The model then receives both the original question and the tool result, and it can generate a grounded response.",
      "This pattern teaches the full agent loop: user message, AI tool call, tool message, and final AI message.",
      "It is more realistic than always-on retrieval because many assistants must mix normal conversation, reasoning, and knowledge lookup.",
      "It can also be more expensive because every tool decision and final answer may require separate LLM calls.",
      "Tool-calling reliability depends on the model. Strong hosted models usually follow tool schemas better than small local models.",
      "Use this pattern when retrieval is one capability among several, not the only thing the system ever does."
    ],
    simpleExample:
      "If the user asks 'Summarize the retrieved article', the model should call the retriever. If the user asks 'Say hello', the model can skip retrieval and answer directly.",
    realWorldUseCases: [
      "Research copilots that decide when to search documents.",
      "Support assistants that mix general conversation with knowledge-base lookups.",
      "Agent workflows where retrieval is one tool among many."
    ],
    pros: [
      "More flexible than a fixed RAG chain.",
      "Demonstrates the model-tool-message loop clearly.",
      "Can combine retrieval with other tools later."
    ],
    cons: [
      "Can cost more because the agent may need multiple LLM calls.",
      "Local models may skip tool calls or call tools less reliably than stronger hosted models.",
      "Debugging requires inspecting messages, tool calls, and retrieved context."
    ],
    technologies: [
      "LangChain create_agent",
      "Retriever tool",
      "Tool messages",
      "Qwen or OpenAI model providers"
    ],
    references: [
      {
        label: "LangChain agents docs",
        url: "https://docs.langchain.com/oss/python/langchain/overview"
      }
    ],
    takeaway:
      "Use agentic RAG when retrieval is optional, conditional, or part of a larger tool-using workflow."
  },
  "langgraph-rag": {
    headline: "LangGraph RAG makes retrieval control flow explicit.",
    intro: [
      "A custom LangGraph RAG workflow breaks the RAG process into named graph nodes: decide, retrieve, grade, rewrite, and answer.",
      "Instead of relying on a hidden agent loop, every decision becomes visible. This is valuable when you want reliability, observability, and control over how the system recovers from weak retrieval."
    ],
    deepDive: [
      "LangGraph is an orchestration framework for building stateful, long-running agent workflows as graphs.",
      "A graph is made of nodes and edges. Nodes do work, and edges decide which node runs next.",
      "State is the shared data object that moves through the graph. It can contain messages, retrieved documents, flags, counters, or decisions.",
      "This is different from a simple LangChain agent because the workflow is not hidden inside one generic loop.",
      "In this RAG workflow, the graph can decide whether retrieval is needed, retrieve documents, grade relevance, rewrite the query, and generate the answer.",
      "Document grading is important because retrieval can return weak or unrelated chunks even when the vector search technically succeeds.",
      "Query rewriting is a recovery step. If the first query is too vague, the graph can improve the query and try again.",
      "The graph makes these steps inspectable, so an engineer can see where the system failed: retrieval, grading, rewriting, or generation.",
      "LangGraph is useful when agent behavior needs checkpoints, branching, retries, human review, or careful state transitions.",
      "The tradeoff is more code, but the reward is control. For production-grade RAG, that control is often worth it."
    ],
    simpleExample:
      "The graph can retrieve a blog chunk, grade whether it answers the question, rewrite the query if the chunk is not relevant, and only then generate the final response.",
    realWorldUseCases: [
      "Production RAG systems that need query rewriting and document relevance grading.",
      "Compliance-sensitive assistants where every step should be inspected.",
      "Long-running workflows that need checkpoints or explicit retry paths."
    ],
    pros: [
      "Clear graph nodes make behavior easier to inspect and test.",
      "Supports controlled retries, rewrites, grading, and fallback logic.",
      "Works well when agent behavior needs production guardrails."
    ],
    cons: [
      "More code than a simple RAG chain.",
      "More nodes can mean more model calls and more latency.",
      "Requires careful state design so messages and retrieved context stay understandable."
    ],
    technologies: [
      "LangGraph StateGraph",
      "Conditional edges",
      "Retriever tools",
      "Document grading",
      "Vector cache for local testing"
    ],
    references: [
      {
        label: "Official LangGraph docs",
        url: "https://docs.langchain.com/oss/python/langgraph/overview"
      },
      {
        label: "LangGraph graph API",
        url: "https://docs.langchain.com/oss/python/langgraph/graph-api"
      }
    ],
    takeaway:
      "Use LangGraph RAG when the retrieval workflow requires explicit state, inspectable decisions, and controlled recovery paths."
  },
  "sql-agent": {
    headline: "A SQL agent translates natural-language questions into controlled database queries.",
    intro: [
      "A SQL agent converts a natural-language question into a database workflow. It can list tables, inspect schema, draft a query, check the query, execute it, and explain the result.",
      "The primary engineering requirement is controlled database access through schema inspection, query validation, permissions, and execution limits."
    ],
    deepDive: [
      "A SQL agent connects natural language to structured data, but the model should not blindly write and run arbitrary SQL.",
      "The first step is schema discovery. The agent needs to know which tables exist before it can choose a table.",
      "The second step is schema inspection. The agent needs column names, relationships, and data types before it can write a valid query.",
      "The third step is query generation. The model turns the user's question into SQL using the inspected schema.",
      "The fourth step is query checking. This is where the system can catch common mistakes before execution.",
      "The fifth step is execution, ideally with read-only permissions and strict limits.",
      "The final step is explanation, where the raw database rows are translated into a clear answer.",
      "This lab uses the Chinook database because it is small enough to inspect but realistic enough to show joins, grouping, and aggregation.",
      "Human review matters for SQL because databases may contain sensitive or business-critical data.",
      "A production SQL agent should include access control, query timeouts, audit logs, row limits, and protection against destructive operations."
    ],
    simpleExample:
      "For 'Which genre has the longest tracks on average?', the agent inspects the Genre and Track tables, writes a SELECT query with a JOIN and AVG, runs it, then turns the result into a human-readable answer.",
    realWorldUseCases: [
      "Business intelligence assistants over analytics databases.",
      "Internal support tools for non-technical teams who need database answers.",
      "Data exploration workflows with human approval before execution."
    ],
    pros: [
      "Makes databases accessible through natural language.",
      "Schema inspection helps the model use the right tables and columns.",
      "Read-only and human-review guardrails reduce risk."
    ],
    cons: [
      "Generated SQL can still be wrong or inefficient.",
      "Production systems need strict permissions, query timeouts, and audit logs.",
      "Ambiguous business questions may require clarification."
    ],
    technologies: [
      "LangChain SQL tools",
      "SQLite Chinook database",
      "Query checker",
      "Human-in-the-loop review",
      "Token usage reporting"
    ],
    references: [
      {
        label: "LangChain Python docs",
        url: "https://docs.langchain.com/oss/python/langchain/overview"
      }
    ],
    takeaway:
      "A SQL agent is useful when people need data answers, but production versions must be designed around safety before convenience."
  },
  "langgraph-sql": {
    headline: "A LangGraph SQL workflow replaces open-ended looping with controlled steps.",
    intro: [
      "The LangGraph SQL workflow takes the same database-answering idea and turns it into a graph. Each stage has a clear responsibility: list tables, select schema, generate SQL, execute SQL, and synthesize the final answer.",
      "This pattern is useful when an open-ended SQL agent is too unpredictable for production."
    ],
    deepDive: [
      "LangGraph is useful for SQL because database workflows naturally have stages that should happen in a controlled order.",
      "Instead of letting a model call SQL tools repeatedly, the graph defines a path: list tables, choose schema, generate query, execute query, and answer.",
      "Each node has one job. This makes it easier to debug when the model chooses the wrong table or writes the wrong query.",
      "The graph state stores the conversation and tool results as the workflow moves forward.",
      "The model still performs reasoning, but the application controls when and where that reasoning happens.",
      "This is a major difference between orchestration and simple prompting. The graph becomes the system boundary.",
      "Recursion limits protect the workflow from accidental loops.",
      "Max-token limits protect the workflow from responses that are cut off or too expensive.",
      "This design is appropriate when an organization needs natural-language analytics with bounded execution behavior.",
      "The explicit workflow improves auditability and control for data access."
    ],
    simpleExample:
      "The graph guides the model through a bounded sequence and uses recursion and token limits to prevent uncontrolled execution.",
    realWorldUseCases: [
      "Analytics copilots with strict execution policies.",
      "Internal dashboards where SQL generation must be audited.",
      "Database assistants that need predictable control flow."
    ],
    pros: [
      "More predictable than a free-form SQL agent loop.",
      "Graph nodes make debugging easier.",
      "Limits and guards can be applied at workflow boundaries."
    ],
    cons: [
      "Less flexible than a general SQL agent.",
      "Requires more upfront graph design.",
      "A weak model can still generate poor SQL if the prompt or schema context is unclear."
    ],
    technologies: [
      "LangGraph StateGraph",
      "SQLite",
      "Custom SQL tools",
      "Query validation",
      "Recursion and token limits"
    ],
    references: [
      {
        label: "Official LangGraph docs",
        url: "https://docs.langchain.com/oss/python/langgraph/overview"
      },
      {
        label: "LangGraph graph API",
        url: "https://docs.langchain.com/oss/python/langgraph/graph-api"
      }
    ],
    takeaway:
      "Use a graph-based SQL workflow when reliability and inspectability matter more than maximum agent flexibility."
  },
  "arithmetic-tool-agent": {
    headline: "The arithmetic tool agent demonstrates the mechanics of tool calling.",
    intro: [
      "This focused agent gives the model arithmetic tools and shows how the model requests a tool call, how the application executes it, and how the result returns as a tool message.",
      "The narrow domain isolates the agent loop from external API and business-domain complexity."
    ],
    deepDive: [
      "Tool calling allows a model to request a controlled action from application code.",
      "A tool has a name, description, and input schema. The model uses that schema to decide how to call it.",
      "The model does not execute the tool by itself. It emits a structured tool call, and the application runs the function.",
      "The function result comes back as a tool message, which becomes part of the conversation history.",
      "The model then reads the tool result and produces the final answer.",
      "Arithmetic removes business-domain complexity and makes the message loop easier to inspect.",
      "This example helps beginners understand why one user request can create multiple model calls.",
      "It also shows why local models and hosted models can behave differently with tool schemas.",
      "In real applications, the same pattern powers calendar tools, database tools, search tools, email tools, and API actions.",
      "Once this loop is clear, more complex agent systems become much easier to reason about."
    ],
    simpleExample:
      "If the user asks 'What is 7 times 10?', the model can call multiply with a=7 and b=10. The tool returns 70, and the model uses that result in the final answer.",
    realWorldUseCases: [
      "Learning how LLM tool calls are represented in messages.",
      "Testing whether a local model can reliably call tools.",
      "Prototyping tool loops before connecting real business tools."
    ],
    pros: [
      "The narrow scope makes the message sequence straightforward to inspect.",
      "No external dependencies or paid APIs are required.",
      "Demonstrates why one agent run may require multiple model calls."
    ],
    cons: [
      "The narrow task demonstrates the protocol but does not represent a production domain.",
      "It does not cover tool authorization, API failures, or long-running side effects.",
      "Some models may solve the math directly instead of calling the tool."
    ],
    technologies: [
      "LangChain tools",
      "Tool messages",
      "Model/tool loop",
      "Local and hosted chat models"
    ],
    references: [
      {
        label: "LangChain Python docs",
        url: "https://docs.langchain.com/oss/python/langchain/overview"
      }
    ],
    takeaway:
      "Use this lab to understand the message sequence that supports more complex tool-using agents."
  },
  "weather-tool-graph": {
    headline: "The weather tool graph demonstrates simulated tool execution.",
    intro: [
      "This example uses a simple weather-style tool to demonstrate how a graph can route a user request through a tool call and final response.",
      "The weather result is simulated, which keeps the learning focused on graph execution rather than API keys, rate limits, or third-party reliability."
    ],
    deepDive: [
      "The weather graph uses a simulated alternative to a live API-backed assistant.",
      "It teaches the same shape as production tools without requiring a live weather provider.",
      "The model receives the user request and can decide to call the weather tool.",
      "The tool returns a simulated result, which keeps the demonstration deterministic and low cost.",
      "The final model response should be based on the tool result, not invented from prior knowledge.",
      "This pattern is useful because many production agents start with mocked tools before real integrations are added.",
      "A graph wrapper makes the tool path explicit and inspectable.",
      "If a real API were added later, the same interface could support retries, validation, and error messages.",
      "This example also teaches that tools are trust boundaries. The model requests action, but application code executes action.",
      "That boundary is essential when tools can spend money, send emails, update records, or expose private data."
    ],
    simpleExample:
      "When the user asks about a city's weather, the model can call the weather tool, receive the simulated result, and then produce a concise answer using that tool output.",
    realWorldUseCases: [
      "Prototyping external API tools before connecting real services.",
      "Teaching how tool-backed graph messages move through a workflow.",
      "Building safe demos where side effects and external dependencies are removed."
    ],
    pros: [
      "The stubbed tool avoids external side effects and service costs.",
      "Makes graph and tool flow visible.",
      "Easy to replace later with a real API adapter."
    ],
    cons: [
      "A simulated weather tool does not prove production API reliability.",
      "Real tools need retries, validation, auth, and monitoring.",
      "The scope is limited to one tool-execution path."
    ],
    technologies: [
      "LangGraph",
      "LangChain tool definitions",
      "Tool messages",
      "Simulated API response"
    ],
    references: [
      {
        label: "Official LangGraph docs",
        url: "https://docs.langchain.com/oss/python/langgraph/overview"
      },
      {
        label: "LangChain Python docs",
        url: "https://docs.langchain.com/oss/python/langchain/overview"
      }
    ],
    takeaway:
      "Use stubbed tools to validate agent control flow before introducing live APIs and external dependencies."
  },
  "voice-agent": {
    headline: "A voice agent connects streaming audio input and output to a text-based agent.",
    intro: [
      "Most voice agents can be understood as three stages: speech-to-text, text agent reasoning, and text-to-speech.",
      "The principal engineering challenge is coordinating these stages with sufficiently low latency for a responsive interaction."
    ],
    deepDive: [
      "A voice agent commonly reuses a text-based agent and adds audio input and output layers.",
      "The first stage is speech-to-text, where audio bytes become text the language model can understand.",
      "The second stage is the agent step, where the text request can trigger reasoning, tool calls, retrieval, or workflow execution.",
      "The third stage is text-to-speech, where the final or partial text response becomes audio for the user.",
      "Streaming matters because users do not want to wait for a full transcript, full reasoning step, and full audio file every time.",
      "Async generators are a useful programming pattern because they let each stage yield events as soon as they are available.",
      "The mock mode in this lab removes microphone and audio-provider complexity so the architecture is easier to learn.",
      "Real voice systems add interruption handling, turn detection, latency tuning, audio codecs, and privacy controls.",
      "The same text agent can often be reused across chat and voice interfaces if the I/O layer is designed cleanly.",
      "The curriculum places voice after tool calling and streaming because the implementation combines both concepts."
    ],
    simpleExample:
      "The demo can run in mock mode: fake audio becomes text, the LangChain agent responds, and the response is streamed as simulated audio chunks.",
    realWorldUseCases: [
      "Voice customer support assistants.",
      "Hands-free copilots for field workers or drivers.",
      "Interactive tutoring and interview-practice assistants."
    ],
    pros: [
      "Shows the architecture without requiring real microphone or TTS setup.",
      "Async generators make the streaming pipeline easier to understand.",
      "The text agent can reuse the same tool and model patterns as other demos."
    ],
    cons: [
      "Real voice systems add latency, interruption handling, audio codecs, and device concerns.",
      "Production systems need strong privacy and consent handling.",
      "Mock mode teaches architecture, not audio quality."
    ],
    technologies: [
      "Async generators",
      "RunnableGenerator",
      "STT stage",
      "LangChain agent stage",
      "TTS stage"
    ],
    references: [
      {
        label: "LangChain Python docs",
        url: "https://docs.langchain.com/oss/python/langchain/overview"
      }
    ],
    takeaway:
      "Think of voice as an I/O layer around an agent. Build the text agent well first, then make it conversational through streaming audio."
  },
  "personal-assistant": {
    headline: "A supervisor agent coordinates specialist subagents.",
    intro: [
      "The personal assistant demonstrates a common multi-agent pattern: one supervisor receives the user request and delegates specialized work to focused subagents.",
      "Instead of giving one model every tool and every responsibility, the workflow separates calendar behavior from email behavior."
    ],
    deepDive: [
      "A multi-agent system is useful when one request contains multiple responsibilities that should not all live in one prompt.",
      "The supervisor agent acts like a coordinator. It understands the user's overall goal and decides which specialist should handle each part.",
      "Specialist agents have narrower instructions and narrower tool access, which can make them easier to control.",
      "In this demo the calendar specialist handles scheduling language, while the email specialist handles reminder language.",
      "The supervisor delegates work through tools, receives each specialist result, and writes one final response to the user.",
      "This is different from simply changing prompts because each specialist can have its own tools, instructions, and execution boundary.",
      "The demo uses simulated side effects, so no real calendar invite or email is sent.",
      "In production, calendar and email actions would need user confirmation, OAuth permissions, audit logs, and undo paths.",
      "The pattern works well when tasks are parallel or separable, but it can become expensive if every subagent requires multiple model calls.",
      "A good supervisor should delegate clearly, avoid duplicate work, and summarize specialist results accurately."
    ],
    simpleExample:
      "A user asks to schedule a meeting and send a reminder. The supervisor delegates scheduling to the calendar specialist and email drafting to the email specialist, then combines both results into one final answer.",
    realWorldUseCases: [
      "Executive assistants that coordinate calendar, email, documents, and CRM actions.",
      "Workflow automations where each specialist owns a bounded tool set.",
      "Multi-step personal productivity agents."
    ],
    pros: [
      "Specialists keep prompts and tools focused.",
      "The supervisor gives users one coherent interface.",
      "Stubbed side effects make the demo safe to run."
    ],
    cons: [
      "More agents can mean more model calls and latency.",
      "The supervisor must delegate clearly or subagents may duplicate work.",
      "Real calendar and email tools need authorization, confirmations, and audit logs."
    ],
    technologies: [
      "LangChain create_agent",
      "Supervisor-as-tool pattern",
      "Calendar and email stubs",
      "Model message inspection"
    ],
    references: [
      {
        label: "LangChain Python docs",
        url: "https://docs.langchain.com/oss/python/langchain/overview"
      }
    ],
    takeaway:
      "Use supervisor-subagent design when tasks naturally belong to different specialists with different tools."
  },
  "customer-support-handoffs": {
    headline: "Customer support handoffs model a conversation as stateful stages.",
    intro: [
      "Support conversations often move through predictable phases: collect account or warranty information, classify the issue, and route to a resolution path.",
      "This demo shows how a workflow can hand control from one stage to another while preserving conversation state."
    ],
    deepDive: [
      "A handoff means one part of the system finishes its responsibility and passes control to another part.",
      "Customer support is a natural fit because support flows often have required stages and policy boundaries.",
      "The workflow should not offer a replacement, refund, or escalation before collecting the required context.",
      "State is important because the system needs to remember what the user already provided.",
      "LangGraph helps represent this as a state machine, where each node handles one support stage.",
      "The warranty step can collect account or device information before the issue-classification step runs.",
      "The classifier can decide whether the case is hardware, billing, warranty, or general troubleshooting.",
      "The resolution specialist can then respond using the correct policy path.",
      "This approach assigns a bounded responsibility to each stage, which improves control and testability.",
      "Production support agents would also need policy retrieval, escalation rules, customer identity checks, and conversation auditing."
    ],
    simpleExample:
      "A customer reports a cracked phone screen. The workflow collects warranty information, classifies the issue, and routes the conversation to the right support response.",
    realWorldUseCases: [
      "Customer support triage with product-specific policies.",
      "Warranty, refunds, onboarding, and escalation workflows.",
      "Regulated support flows where required information must be collected before action."
    ],
    pros: [
      "State makes the workflow easier to reason about.",
      "Handoffs give each stage a defined scope and policy boundary.",
      "Checkpointing makes multi-turn flows easier to resume."
    ],
    cons: [
      "Workflow design takes more effort than a single chat prompt.",
      "Too many handoffs can feel rigid if the conversation is open-ended.",
      "Production support systems need real policy sources and escalation controls."
    ],
    technologies: [
      "LangGraph state",
      "Command updates",
      "Handoff pattern",
      "Short-term memory",
      "Controlled routing"
    ],
    references: [
      {
        label: "Official LangGraph docs",
        url: "https://docs.langchain.com/oss/python/langgraph/overview"
      }
    ],
    takeaway:
      "Use handoffs when the conversation has stages and each stage needs its own policy, tools, or completion criteria."
  },
  "knowledge-base-router": {
    headline: "A knowledge-base router selects relevant information sources.",
    intro: [
      "Modern teams store knowledge across many systems: GitHub, Notion, Slack, docs, tickets, and databases. A router agent decides which sources are relevant and sends the query to the right specialist.",
      "This pattern is important because not every question should search every system."
    ],
    deepDive: [
      "A knowledge-base router solves a common enterprise problem: useful context is scattered across many tools.",
      "Searching every source for every question is slow, expensive, and often noisy.",
      "A router reads the user question and decides which specialist sources are likely relevant.",
      "One specialist might represent GitHub issues and pull requests, another might represent Notion docs, and another might represent Slack discussions.",
      "The router can send work to multiple specialists when the question needs more than one source.",
      "Fan-out means several source-specific searches can happen in parallel.",
      "The final synthesis step merges those specialist answers into one response for the user.",
      "This pattern makes source boundaries visible, which is important for trust and permission handling.",
      "The risk is routing failure. If the router chooses the wrong source, the final answer may miss important evidence.",
      "Production routers need permissions, source citations, observability, and fallback behavior when the first routing decision is uncertain."
    ],
    simpleExample:
      "If a question asks about an API error and release notes, the router can ask a GitHub specialist for code or issues and a docs specialist for product guidance, then merge the results.",
    realWorldUseCases: [
      "Internal company assistants across engineering, docs, and chat history.",
      "Incident-response assistants that search runbooks, pull requests, and Slack notes.",
      "Enterprise copilots that need source-aware answers."
    ],
    pros: [
      "Avoids searching irrelevant tools for every question.",
      "Fan-out can gather information from multiple specialists in parallel.",
      "The final synthesis can explain which sources informed the answer."
    ],
    cons: [
      "Router quality matters. Bad routing means missing important context.",
      "Parallel specialist calls can increase cost.",
      "Production source connectors need auth, permissions, and data filtering."
    ],
    technologies: [
      "LangGraph Send",
      "Fan-out routing",
      "Source-specific specialists",
      "Result synthesis",
      "Structured routing decisions"
    ],
    references: [
      {
        label: "Official LangGraph docs",
        url: "https://docs.langchain.com/oss/python/langgraph/overview"
      }
    ],
    takeaway:
      "Use a knowledge router when users ask questions whose answers may live across multiple systems."
  },
  "skills-sql-assistant": {
    headline: "Skills let an agent load deep context only when needed.",
    intro: [
      "A skills-based assistant starts with compact skill descriptions instead of loading every schema, policy, and instruction into the prompt.",
      "When the user asks a relevant question, the agent loads the full skill file and uses that domain-specific context to answer."
    ],
    deepDive: [
      "Skills are a context-management pattern. They help an agent avoid loading every possible instruction into every prompt.",
      "The model first sees a short menu of available skills and descriptions.",
      "If the user request matches a skill, the agent loads the full skill content.",
      "This is called progressive disclosure because the model receives detailed context only when it is needed.",
      "In the SQL example, the skill contains table descriptions, relationships, and business rules.",
      "The model uses that loaded skill to write a better SQL query than it could write from the user question alone.",
      "This pattern becomes more important as systems grow across many domains, datasets, policies, or customer workflows.",
      "Without skills, the prompt can become too large, expensive, and confusing.",
      "The risk is skill selection. If descriptions are vague, the model may load the wrong skill or skip the right one.",
      "A production implementation should version skills, test skill selection, and validate outputs from loaded skills."
    ],
    simpleExample:
      "For a sales analytics SQL request, the agent loads the sales_analytics skill, reads the table definitions and business rules, then writes a SQL query using that context.",
    realWorldUseCases: [
      "Large enterprise assistants with many domains and policies.",
      "SQL assistants that support multiple datasets.",
      "Developer copilots that load framework or repo-specific instructions on demand."
    ],
    pros: [
      "Keeps initial prompts smaller and cleaner.",
      "Improves context management as the number of domains grows.",
      "Makes domain knowledge reusable and easier to update."
    ],
    cons: [
      "The model must choose the right skill.",
      "Skill descriptions need to be clear and distinct.",
      "Loaded skills still need validation when they produce executable outputs like SQL."
    ],
    technologies: [
      "LangChain SkillMiddleware",
      "load_skill tool",
      "Local skill metadata",
      "Progressive disclosure",
      "SQL generation"
    ],
    references: [
      {
        label: "LangChain Python docs",
        url: "https://docs.langchain.com/oss/python/langchain/overview"
      }
    ],
    takeaway:
      "Skills reduce context load by presenting compact capability descriptions and loading detailed instructions only when required."
  },
  "deep-research-agent": {
    headline: "Deep Agents provide a structured harness for multi-step research.",
    intro: [
      "Deep Agents are designed for tasks that need planning, research, file operations, and possible delegation to subagents.",
      "This demo follows the Deep Agents research pattern: connect a search tool, define instructions, and let the harness manage a more capable research workflow."
    ],
    deepDive: [
      "Deep Agents are meant for tasks that feel more like projects than single chat answers.",
      "A normal agent may call a tool and answer. A deep agent may plan, search, write intermediate notes, use files, and delegate subtasks.",
      "Complex research requires planning, tool coordination, intermediate artifacts, and explicit completion criteria.",
      "This lab uses Tavily search so the research agent can gather current external information.",
      "The agent instructions define the research behavior and tell the system how to use the search tool.",
      "The harness can support planning and file-system style workflows, which are useful for longer research tasks.",
      "This is different from RAG because the source of knowledge is not only a pre-indexed local vector store.",
      "It is also different from a basic tool agent because the task may involve multiple steps and intermediate artifacts.",
      "Costs and latency can be higher because research work often requires several model and search calls.",
      "Use this pattern when the required output depends on multi-step research and source synthesis."
    ],
    simpleExample:
      "For a technical research request, the agent searches through Tavily, evaluates the results, and produces a sourced research summary.",
    realWorldUseCases: [
      "Research assistants that gather and synthesize current information.",
      "Competitive analysis and market research workflows.",
      "Longer-running tasks that need planning and intermediate artifacts."
    ],
    pros: [
      "Provides planning, search, file, and delegation capabilities for complex workflows.",
      "Can combine search, planning, files, and subagents.",
      "Appropriate for research tasks that require multiple searches, source comparison, or intermediate artifacts."
    ],
    cons: [
      "Requires external services like Tavily for live search.",
      "Costs and latency can be higher than simple agents.",
      "Needs careful prompt and tool design to keep research grounded."
    ],
    technologies: [
      "Deep Agents",
      "Tavily search",
      "Research instructions",
      "Planning-capable agent harness",
      "OpenAI model provider"
    ],
    references: [
      {
        label: "Deep Agents docs",
        url: "https://docs.langchain.com/oss/python/deepagents/overview"
      },
      {
        label: "Tavily",
        url: "https://www.tavily.com/"
      }
    ],
    takeaway:
      "Use Deep Agents for research tasks that require planning, multiple tool calls, intermediate artifacts, or delegated subtasks."
  },
  "langgraph-state-machine": {
    headline: "LangGraph state machines expose the control-flow primitives used by agents.",
    intro: [
      "Before building large graph agents, it helps to learn the primitives: state, nodes, edges, reducers, conditional routing, checkpoints, interrupts, subgraphs, and streaming.",
      "This implementation isolates the control-flow primitives used by the repository's larger workflows."
    ],
    deepDive: [
      "LangGraph is a framework for building agent workflows as explicit graphs instead of hidden loops.",
      "The basic unit is a node. A node is usually a function that reads the current state and returns an update.",
      "Edges connect nodes and define what runs next.",
      "Conditional edges let the graph choose different paths based on state, such as routing to an even or odd branch.",
      "State is the shared object that flows through the graph. It can contain messages, counters, flags, retrieved documents, or tool results.",
      "Reducers define how state updates are merged. For example, a reducer can append new messages to an existing message list.",
      "Checkpoints let a graph remember progress, which is important for long-running or multi-turn workflows.",
      "Interrupts allow human-in-the-loop behavior, such as pausing for approval before continuing.",
      "Subgraphs let you compose smaller graphs into larger systems, which keeps complex workflows manageable.",
      "Streaming lets you observe intermediate updates instead of waiting only for the final result.",
      "These primitives are the foundation for reliable RAG graphs, SQL workflows, support handoffs, and multi-agent systems.",
      "LangGraph is most valuable when you need state, branching, persistence, recovery, or human control around an agent."
    ],
    simpleExample:
      "A small graph can classify a number as odd or even, route to the correct node, append trace messages with a reducer, and return the final state.",
    realWorldUseCases: [
      "Workflow orchestration for agents that need clear stages.",
      "Human-in-the-loop approvals before sensitive actions.",
      "Long-running assistants that need memory, checkpoints, and resumability."
    ],
    pros: [
      "Makes control flow explicit and inspectable.",
      "Demonstrates reducers, routing, interrupts, and subgraphs in isolation.",
      "The same concepts scale into production workflows."
    ],
    cons: [
      "Simple demos can feel abstract until connected to a real agent.",
      "Graph design requires thinking about state shape carefully.",
      "More structure means more code than a direct function call."
    ],
    technologies: [
      "LangGraph StateGraph",
      "Reducers",
      "Conditional edges",
      "Checkpointers",
      "Interrupts and streaming"
    ],
    references: [
      {
        label: "Official LangGraph docs",
        url: "https://docs.langchain.com/oss/python/langgraph/overview"
      },
      {
        label: "LangGraph graph API",
        url: "https://docs.langchain.com/oss/python/langgraph/graph-api"
      }
    ],
    takeaway:
      "LangGraph provides explicit structures for implementing and executing stateful agent workflows."
  }
} satisfies Record<string, AgentBlog>;
