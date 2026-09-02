export type LessonLab = {
  description: string;
  path: string;
  title: string;
  url: string;
};

const lessonLabs: Record<string, LessonLab> = {
  "using-llm-apis-and-langchain": {
    title: "Support Request Analyzer",
    description:
      "Run the same Support Request Analyzer through the OpenAI SDK, LangChain, or a local Ollama model running qwen3:14b.",
    path: "labs/01-llm-fundamentals/customer-service-agent",
    url: "https://github.com/chaitanya-y/agentic-ai-lab/tree/main/labs/01-llm-fundamentals/customer-service-agent"
  },
  "building-a-basic-agent-with-langchain": {
    title: "Customer Service Agent",
    description:
      "Run one bounded LangChain order status agent with OpenAI or local Ollama while keeping the same tool controls, validation, trace, and tests.",
    path: "labs/01-llm-fundamentals/customer-service-agent",
    url: "https://github.com/chaitanya-y/agentic-ai-lab/tree/main/labs/01-llm-fundamentals/customer-service-agent"
  }
};

export function getLessonLab(lessonSlug: string) {
  return lessonLabs[lessonSlug];
}
