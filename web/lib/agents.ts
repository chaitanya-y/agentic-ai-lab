export type AgentCategory =
  | "Retrieval"
  | "Tool Agents"
  | "LangGraph"
  | "SQL"
  | "Multi-Agent"
  | "Deep Agents"
  | "Voice";

export type Agent = {
  slug: string;
  name: string;
  category: AgentCategory;
  status: "Local" | "OpenAI" | "Hybrid" | "Docs-backed";
  sourcePath: string;
  summary: string;
  problem: string;
  architecture: string[];
  concepts: string[];
  runCommand: string;
  githubUrl: string;
};

export const repoUrl = "https://github.com/chaitanya-y/agentic-ai-lab";
export const profileUrl = "https://github.com/chaitanya-y";
export const issuesUrl = `${repoUrl}/issues`;
const mainBranchUrl = `${repoUrl}/blob/main`;

export const agents: Agent[] = [
  {
    slug: "semantic-search",
    name: "Semantic Search",
    category: "Retrieval",
    status: "Local",
    sourcePath: "src/retrieval/semantic_search.py",
    summary: "Document loading, chunking, local embeddings, and vector similarity search.",
    problem: "Turns a PDF into searchable chunks so questions can retrieve semantically related passages.",
    architecture: ["PDF loader", "Recursive text splitter", "Qwen local embeddings", "InMemoryVectorStore", "Similarity search"],
    concepts: ["Documents", "chunks", "embeddings", "vector stores", "retrieval quality"],
    runCommand: "MAX_CHUNKS=20 uv run python src/retrieval/semantic_search.py",
    githubUrl: `${mainBranchUrl}/src/retrieval/semantic_search.py`
  },
  {
    slug: "rag-agent",
    name: "RAG Agent",
    category: "Retrieval",
    status: "Hybrid",
    sourcePath: "src/agents/rag_agent.py",
    summary: "A model decides when to call retrieval as a tool before answering.",
    problem: "Demonstrates agentic RAG where retrieval is optional and controlled by the model.",
    architecture: ["Load blog post", "Split and embed", "Expose retriever as tool", "Model decides tool call", "Grounded answer"],
    concepts: ["Tool calling", "retrieval artifacts", "agent loop", "grounding"],
    runCommand: "MAX_CHUNKS=20 MODEL_PROVIDER=qwen uv run python src/agents/rag_agent.py",
    githubUrl: `${mainBranchUrl}/src/agents/rag_agent.py`
  },
  {
    slug: "rag-chain",
    name: "RAG Chain",
    category: "Retrieval",
    status: "Hybrid",
    sourcePath: "src/agents/rag_chain.py",
    summary: "A deterministic RAG path that retrieves first, then calls the model once.",
    problem: "Shows the lower-latency alternative to agentic RAG when retrieval is always needed.",
    architecture: ["Retrieve before model", "Inject context", "Single model call", "Answer from context"],
    concepts: ["Middleware", "context injection", "single-call RAG", "debuggable prompts"],
    runCommand: "MAX_CHUNKS=20 MODEL_PROVIDER=qwen uv run python src/agents/rag_chain.py",
    githubUrl: `${mainBranchUrl}/src/agents/rag_chain.py`
  },
  {
    slug: "langgraph-rag",
    name: "LangGraph Agentic RAG",
    category: "LangGraph",
    status: "Hybrid",
    sourcePath: "src/workflows/langgraph_rag_agent.py",
    summary: "Custom RAG graph with retrieval decisions, grading, rewriting, and vector cache.",
    problem: "Makes each RAG control-flow decision explicit instead of hiding it inside a high-level agent.",
    architecture: ["Decide retrieve or answer", "Retrieve documents", "Grade relevance", "Rewrite query when needed", "Generate answer"],
    concepts: ["StateGraph", "conditional edges", "document grading", "query rewriting", "embedding cache"],
    runCommand: "MAX_CHUNKS=20 RAG_GRAPH_USE_VECTOR_CACHE=true MODEL_PROVIDER=qwen uv run python src/workflows/langgraph_rag_agent.py",
    githubUrl: `${mainBranchUrl}/src/workflows/langgraph_rag_agent.py`
  },
  {
    slug: "sql-agent",
    name: "SQL Agent",
    category: "SQL",
    status: "Hybrid",
    sourcePath: "src/agents/sql_agent.py",
    summary: "LangChain SQL agent over Chinook with query checking and read-only guardrails.",
    problem: "Lets a model inspect a database schema, draft SQL, check it, and run safe SELECT queries.",
    architecture: ["List tables", "Inspect schema", "Check SQL", "Read-only execution", "Final answer"],
    concepts: ["SQL tools", "human review", "query validation", "read-only execution"],
    runCommand: "MODEL_PROVIDER=qwen AUTO_APPROVE_SQL=true uv run python src/agents/sql_agent.py",
    githubUrl: `${mainBranchUrl}/src/agents/sql_agent.py`
  },
  {
    slug: "langgraph-sql",
    name: "LangGraph SQL Workflow",
    category: "SQL",
    status: "Hybrid",
    sourcePath: "src/workflows/langgraph_sql_agent.py",
    summary: "Explicit SQL workflow graph for schema selection, query generation, execution, and answer synthesis.",
    problem: "Shows how to replace an open-ended SQL agent loop with controlled graph steps.",
    architecture: ["List tables", "Choose schema", "Generate query", "Execute query", "Synthesize answer"],
    concepts: ["StateGraph", "tool nodes", "query guards", "recursion limits"],
    runCommand: "MODEL_PROVIDER=qwen uv run python src/workflows/langgraph_sql_agent.py",
    githubUrl: `${mainBranchUrl}/src/workflows/langgraph_sql_agent.py`
  },
  {
    slug: "arithmetic-tool-agent",
    name: "Arithmetic Tool Agent",
    category: "Tool Agents",
    status: "Hybrid",
    sourcePath: "src/agents/arithmetic_tool_agent.py",
    summary: "Small tool-calling agent that demonstrates explicit model/tool message loops.",
    problem: "Makes tool calls, tool results, and final routing easy to inspect.",
    architecture: ["User message", "Model tool call", "Tool execution", "Tool message", "Final answer"],
    concepts: ["Tool schemas", "message history", "tool loop", "LLM call counting"],
    runCommand: "MODEL_PROVIDER=qwen uv run python src/agents/arithmetic_tool_agent.py",
    githubUrl: `${mainBranchUrl}/src/agents/arithmetic_tool_agent.py`
  },
  {
    slug: "weather-tool-graph",
    name: "Weather Tool Graph",
    category: "Tool Agents",
    status: "Hybrid",
    sourcePath: "src/agents/weather_tool_graph.py",
    summary: "A minimal graph-backed tool agent with a weather tool.",
    problem: "Demonstrates tool-backed graph execution without external weather APIs.",
    architecture: ["User city request", "Weather tool call", "Simulated tool result", "Final answer"],
    concepts: ["Tool calling", "graph messages", "safe stubs"],
    runCommand: "MODEL_PROVIDER=qwen uv run python src/agents/weather_tool_graph.py",
    githubUrl: `${mainBranchUrl}/src/agents/weather_tool_graph.py`
  },
  {
    slug: "voice-agent",
    name: "Voice Agent",
    category: "Voice",
    status: "Hybrid",
    sourcePath: "src/agents/voice_agent.py",
    summary: "Documentation-aligned speech-to-text, agent, and text-to-speech pipeline.",
    problem: "Shows how spoken input can be transformed into agent text and streamed back as audio chunks.",
    architecture: ["Audio bytes", "STT events", "Agent chunks", "TTS audio", "WebSocket-ready endpoint"],
    concepts: ["Async generators", "RunnableGenerator", "streaming", "provider adapters"],
    runCommand: "VOICE_AGENT_MODE=mock MODEL_PROVIDER=qwen uv run python src/agents/voice_agent.py",
    githubUrl: `${mainBranchUrl}/src/agents/voice_agent.py`
  },
  {
    slug: "personal-assistant",
    name: "Multi-Agent Personal Assistant",
    category: "Multi-Agent",
    status: "Hybrid",
    sourcePath: "src/multi_agent/personal_assistant.py",
    summary: "Supervisor delegates calendar and email work to specialist subagents.",
    problem: "Demonstrates the subagents pattern for multi-step personal assistant tasks.",
    architecture: ["Supervisor", "Calendar specialist", "Email specialist", "Stubbed side effects", "Final summary"],
    concepts: ["Supervisor tools", "subagents", "delegation", "safe simulation"],
    runCommand: "MODEL_PROVIDER=qwen uv run python src/multi_agent/personal_assistant.py",
    githubUrl: `${mainBranchUrl}/src/multi_agent/personal_assistant.py`
  },
  {
    slug: "customer-support-handoffs",
    name: "Customer Support Handoffs",
    category: "Multi-Agent",
    status: "Hybrid",
    sourcePath: "src/multi_agent/customer_support_handoffs.py",
    summary: "State-machine handoffs for warranty collection, issue classification, and resolution.",
    problem: "Shows how support workflows can move through controlled stages instead of one long model response.",
    architecture: ["Warranty step", "Issue classifier", "Resolution specialist", "Command state updates", "Checkpointing"],
    concepts: ["Handoffs", "Command", "state schema", "return_direct", "short-term memory"],
    runCommand: "MODEL_PROVIDER=qwen uv run python src/multi_agent/customer_support_handoffs.py",
    githubUrl: `${mainBranchUrl}/src/multi_agent/customer_support_handoffs.py`
  },
  {
    slug: "knowledge-base-router",
    name: "Knowledge Base Router",
    category: "Multi-Agent",
    status: "OpenAI",
    sourcePath: "src/multi_agent/knowledge_base_router.py",
    summary: "Router fans out a question to GitHub, Notion, and Slack specialists.",
    problem: "Demonstrates parallel specialist routing and synthesis across multiple knowledge sources.",
    architecture: ["Classify query", "Send to specialists", "Merge results", "Synthesize final answer"],
    concepts: ["LangGraph Send", "fan-out", "operator.add", "source routing"],
    runCommand: "MODEL_PROVIDER=openai ALLOW_PAID_API_CALLS=true uv run python src/multi_agent/knowledge_base_router.py",
    githubUrl: `${mainBranchUrl}/src/multi_agent/knowledge_base_router.py`
  },
  {
    slug: "skills-sql-assistant",
    name: "Skills SQL Assistant",
    category: "Multi-Agent",
    status: "OpenAI",
    sourcePath: "src/multi_agent/skills_sql_assistant.py",
    summary: "Progressive disclosure SQL assistant using SkillMiddleware and on-demand skill loading.",
    problem: "Shows how an agent can load full domain context only when the task needs it.",
    architecture: ["Skill descriptions", "SkillMiddleware", "load_skill tool", "SQL generation"],
    concepts: ["Skills", "middleware", "context management", "progressive disclosure"],
    runCommand: "MODEL_PROVIDER=openai ALLOW_PAID_API_CALLS=true uv run python src/multi_agent/skills_sql_assistant.py",
    githubUrl: `${mainBranchUrl}/src/multi_agent/skills_sql_assistant.py`
  },
  {
    slug: "deep-research-agent",
    name: "Deep Agents Research Agent",
    category: "Deep Agents",
    status: "Docs-backed",
    sourcePath: "src/deep_agents/research_agent.py",
    summary: "Deep Agents quickstart implementation with Tavily search and a research harness.",
    problem: "Shows the higher-level Deep Agents harness for planning, file tools, subagents, and research tasks.",
    architecture: ["Tavily search tool", "create_deep_agent", "Research prompt", "Harness planning", "Final report"],
    concepts: ["Deep Agents", "Tavily", "planning", "virtual filesystem", "subagent-ready harness"],
    runCommand: "ALLOW_PAID_API_CALLS=true uv run python src/deep_agents/research_agent.py",
    githubUrl: `${mainBranchUrl}/src/deep_agents/research_agent.py`
  },
  {
    slug: "langgraph-state-machine",
    name: "LangGraph State Machine",
    category: "LangGraph",
    status: "Local",
    sourcePath: "src/orchestration/langgraph_state_machine.py",
    summary: "Concept demos for reducers, routing, checkpoints, interrupts, subgraphs, and streaming.",
    problem: "Teaches the building blocks behind LangGraph orchestration.",
    architecture: ["State schema", "Nodes", "Edges", "Reducers", "Runtime demos"],
    concepts: ["Reducers", "routing", "checkpoints", "interrupts", "subgraphs", "streaming"],
    runCommand: "uv run python src/orchestration/langgraph_state_machine.py --demo routing",
    githubUrl: `${mainBranchUrl}/src/orchestration/langgraph_state_machine.py`
  }
];

export const categories: ("All" | AgentCategory)[] = [
  "All",
  "Retrieval",
  "SQL",
  "LangGraph",
  "Tool Agents",
  "Multi-Agent",
  "Deep Agents",
  "Voice"
];

export function getAgent(slug: string) {
  return agents.find((agent) => agent.slug === slug);
}
