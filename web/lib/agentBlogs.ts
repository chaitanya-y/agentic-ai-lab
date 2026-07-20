export type AgentBlog = {
  headline: string;
  intro: string[];
  simpleExample: string;
  realWorldUseCases: string[];
  pros: string[];
  cons: string[];
  technologies: string[];
  takeaway: string;
};

export const agentBlogs = {
  "semantic-search": {
    headline: "Semantic search is the foundation of practical AI retrieval.",
    intro: [
      "Semantic search lets an application search by meaning instead of exact keywords. The document is split into chunks, each chunk is converted into an embedding vector, and a vector store finds chunks that are close to the user's question.",
      "This is usually the first hands-on retrieval system an agentic engineer should build. It teaches the core mechanics behind RAG without adding the complexity of tool-calling or multi-step agent loops."
    ],
    simpleExample:
      "If a user asks, 'What risks did Nike mention in the annual report?', the system does not search only for the word risks. It embeds the question, compares it against embedded PDF chunks, and returns passages that are semantically related to risk disclosures.",
    realWorldUseCases: [
      "Internal document search over PDFs, policies, onboarding docs, and support manuals.",
      "Legal or finance search where users need source passages instead of generic answers.",
      "Developer search across architecture notes, runbooks, and incident reports."
    ],
    pros: [
      "No LLM call is required for retrieval, so it can be cheap and fast after embeddings exist.",
      "Retrieved chunks are easy to inspect, which makes debugging simpler.",
      "It creates the reusable retrieval layer for later RAG and agent systems."
    ],
    cons: [
      "It returns relevant passages, not a polished final answer.",
      "Quality depends heavily on chunk size, overlap, embedding model, and source document quality.",
      "An in-memory vector store is great for learning but not persistent enough for production."
    ],
    technologies: [
      "LangChain document loaders",
      "Recursive text splitting",
      "Qwen local embeddings through Hugging Face",
      "InMemoryVectorStore"
    ],
    takeaway:
      "Learn semantic search first because it gives you the mental model for documents, chunks, embeddings, vector stores, and retrieval quality."
  },
  "rag-chain": {
    headline: "A RAG chain is the simplest reliable path from documents to answers.",
    intro: [
      "A RAG chain follows a deterministic sequence: retrieve relevant context, place that context into the model input, and ask the model to answer from the retrieved information.",
      "Unlike an agent, the model does not decide whether retrieval is needed. The application decides retrieval is mandatory, which makes the system easier to reason about."
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
      "Good fit when every question should use the same knowledge source."
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
    takeaway:
      "Use a RAG chain when you want predictable, grounded answers and do not need the model to make tool-use decisions."
  },
  "rag-agent": {
    headline: "A RAG agent turns retrieval into a model-controlled tool.",
    intro: [
      "In an agentic RAG system, retrieval is exposed as a tool. The model reads the user request, decides whether it needs external context, calls the retriever if needed, then uses the returned context to answer.",
      "This is closer to how real assistants behave: they do not always search, but they can search when the task needs facts from a private or external source."
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
    takeaway:
      "Use agentic RAG when retrieval is optional, conditional, or part of a larger tool-using workflow."
  },
  "langgraph-rag": {
    headline: "LangGraph RAG makes retrieval control flow explicit.",
    intro: [
      "A custom LangGraph RAG workflow breaks the RAG process into named graph nodes: decide, retrieve, grade, rewrite, and answer.",
      "Instead of relying on a hidden agent loop, every decision becomes visible. This is valuable when you want reliability, observability, and control over how the system recovers from weak retrieval."
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
    takeaway:
      "Use LangGraph RAG when you want an inspectable retrieval workflow instead of a black-box agent loop."
  },
  "sql-agent": {
    headline: "A SQL agent lets a model ask questions of a database safely.",
    intro: [
      "A SQL agent converts a natural-language question into a database workflow. It can list tables, inspect schema, draft a query, check the query, execute it, and explain the result.",
      "The important engineering lesson is not just SQL generation. It is how to put guardrails around a model that can touch data."
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
    takeaway:
      "A SQL agent is useful when people need data answers, but production versions must be designed around safety before convenience."
  },
  "langgraph-sql": {
    headline: "A LangGraph SQL workflow replaces open-ended looping with controlled steps.",
    intro: [
      "The LangGraph SQL workflow takes the same database-answering idea and turns it into a graph. Each stage has a clear responsibility: list tables, select schema, generate SQL, execute SQL, and synthesize the final answer.",
      "This pattern is useful when an open-ended SQL agent is too unpredictable for production."
    ],
    simpleExample:
      "Instead of letting the model repeatedly call SQL tools until it feels done, the graph guides the model through a bounded path and uses recursion limits and max-token settings to prevent runaway behavior.",
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
    takeaway:
      "Use a graph-based SQL workflow when reliability and inspectability matter more than maximum agent flexibility."
  },
  "arithmetic-tool-agent": {
    headline: "The arithmetic tool agent teaches the basic mechanics of tool calling.",
    intro: [
      "This small agent is intentionally simple. It gives the model arithmetic tools and shows how the model asks for a tool call, how the application executes the tool, and how the result returns as a tool message.",
      "Because the domain is tiny, it is easier to focus on the agent loop instead of getting distracted by external APIs."
    ],
    simpleExample:
      "If the user asks 'What is 7 times 10?', the model can call multiply with a=7 and b=10. The tool returns 70, and the model uses that result in the final answer.",
    realWorldUseCases: [
      "Learning how LLM tool calls are represented in messages.",
      "Testing whether a local model can reliably call tools.",
      "Prototyping tool loops before connecting real business tools."
    ],
    pros: [
      "Very easy to inspect and understand.",
      "No external dependencies or paid APIs are required.",
      "Great for learning why multiple LLM calls can happen in one agent run."
    ],
    cons: [
      "The task is intentionally simple and not a production use case by itself.",
      "It does not cover tool authorization, API failures, or long-running side effects.",
      "Some models may solve the math directly instead of calling the tool."
    ],
    technologies: [
      "LangChain tools",
      "Tool messages",
      "Model/tool loop",
      "Local and hosted chat models"
    ],
    takeaway:
      "Start here if tool calling feels confusing. The same loop powers much more serious agents."
  },
  "weather-tool-graph": {
    headline: "The weather tool graph shows safe tool-backed graph execution.",
    intro: [
      "This example uses a simple weather-style tool to demonstrate how a graph can route a user request through a tool call and final response.",
      "The weather result is simulated, which keeps the learning focused on graph execution rather than API keys, rate limits, or third-party reliability."
    ],
    simpleExample:
      "When the user asks about a city's weather, the model can call the weather tool, receive the simulated result, and then produce a concise answer using that tool output.",
    realWorldUseCases: [
      "Prototyping external API tools before connecting real services.",
      "Teaching how tool-backed graph messages move through a workflow.",
      "Building safe demos where side effects and external dependencies are removed."
    ],
    pros: [
      "Safe and cheap because the tool is stubbed.",
      "Makes graph and tool flow visible.",
      "Easy to replace later with a real API adapter."
    ],
    cons: [
      "A simulated weather tool does not prove production API reliability.",
      "Real tools need retries, validation, auth, and monitoring.",
      "The example is intentionally narrow."
    ],
    technologies: [
      "LangGraph",
      "LangChain tool definitions",
      "Tool messages",
      "Simulated API response"
    ],
    takeaway:
      "Stubbed tools are a smart way to learn and test agent flow before paying for or depending on real APIs."
  },
  "voice-agent": {
    headline: "A voice agent is a streaming sandwich around a text agent.",
    intro: [
      "Most voice agents can be understood as three stages: speech-to-text, text agent reasoning, and text-to-speech.",
      "The hard part is not only transcription or audio generation. It is streaming the stages cleanly so users feel the assistant is responsive."
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
    takeaway:
      "Think of voice as an I/O layer around an agent. Build the text agent well first, then make it conversational through streaming audio."
  },
  "personal-assistant": {
    headline: "A supervisor agent coordinates specialist subagents.",
    intro: [
      "The personal assistant demonstrates a common multi-agent pattern: one supervisor receives the user request and delegates specialized work to focused subagents.",
      "Instead of giving one model every tool and every responsibility, the workflow separates calendar behavior from email behavior."
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
    takeaway:
      "Use supervisor-subagent design when tasks naturally belong to different specialists with different tools."
  },
  "customer-support-handoffs": {
    headline: "Customer support handoffs model a conversation as stateful stages.",
    intro: [
      "Support conversations often move through predictable phases: collect account or warranty information, classify the issue, and route to a resolution path.",
      "This demo shows how a workflow can hand control from one stage to another while preserving conversation state."
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
      "Handoffs reduce the chance that one giant prompt handles every scenario poorly.",
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
    takeaway:
      "Use handoffs when the conversation has stages and each stage needs its own policy, tools, or completion criteria."
  },
  "knowledge-base-router": {
    headline: "A knowledge-base router sends questions to the right source.",
    intro: [
      "Modern teams store knowledge across many systems: GitHub, Notion, Slack, docs, tickets, and databases. A router agent decides which sources are relevant and sends the query to the right specialist.",
      "This pattern is important because not every question should search every system."
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
    takeaway:
      "Use a knowledge router when users ask questions whose answers may live across multiple systems."
  },
  "skills-sql-assistant": {
    headline: "Skills let an agent load deep context only when needed.",
    intro: [
      "A skills-based assistant starts with compact skill descriptions instead of loading every schema, policy, and instruction into the prompt.",
      "When the user asks a relevant question, the agent loads the full skill file and uses that domain-specific context to answer."
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
    takeaway:
      "Skills are a practical answer to context overload: show the model a menu first, then load the full recipe only when needed."
  },
  "deep-research-agent": {
    headline: "Deep Agents provide a higher-level harness for complex work.",
    intro: [
      "Deep Agents are designed for tasks that need planning, research, file operations, and possible delegation to subagents.",
      "This demo follows the Deep Agents research pattern: connect a search tool, define instructions, and let the harness manage a more capable research workflow."
    ],
    simpleExample:
      "A user asks for research on a technical topic. The agent searches the web through Tavily, reasons over the results, and produces a more complete research-style answer.",
    realWorldUseCases: [
      "Research assistants that gather and synthesize current information.",
      "Competitive analysis and market research workflows.",
      "Longer-running tasks that need planning and intermediate artifacts."
    ],
    pros: [
      "Provides a more capable starting point for complex agent behavior.",
      "Can combine search, planning, files, and subagents.",
      "Good fit for research tasks that are too broad for one simple tool call."
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
    takeaway:
      "Use Deep Agents when the task looks like a project, not just a single answer."
  },
  "langgraph-state-machine": {
    headline: "LangGraph state machines teach the control-flow primitives behind agents.",
    intro: [
      "Before building large graph agents, it helps to learn the primitives: state, nodes, edges, reducers, conditional routing, checkpoints, interrupts, subgraphs, and streaming.",
      "This file is the concept gym for the rest of the repository."
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
      "Great for learning reducers, routing, interrupts, and subgraphs in isolation.",
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
    takeaway:
      "If agents are systems, LangGraph teaches you how to draw and execute the system map."
  }
} satisfies Record<string, AgentBlog>;
