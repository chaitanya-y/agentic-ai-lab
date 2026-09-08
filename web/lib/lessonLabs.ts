export type LessonLab = {
  description: string;
  path: string;
  roadmapLabel: "Coding exercise" | "Hands on project";
  title: string;
  url: string;
};

const lessonLabs: Record<string, LessonLab> = {
  "using-llm-apis-and-langchain": {
    title: "Support Request Analyzer",
    description:
      "Run the same Support Request Analyzer through the OpenAI SDK, LangChain, or a local Ollama model running qwen3:14b.",
    path: "labs/01-llm-fundamentals/customer-service-agent",
    roadmapLabel: "Coding exercise",
    url: "https://github.com/chaitanya-y/agentic-ai-lab/tree/main/labs/01-llm-fundamentals/customer-service-agent"
  },
  "building-a-basic-agent-with-langchain": {
    title: "Customer Service Agent",
    description:
      "Run one bounded LangChain order status agent with OpenAI or local Ollama while keeping the same tool controls, validation, trace, and tests.",
    path: "labs/01-llm-fundamentals/customer-service-agent",
    roadmapLabel: "Coding exercise",
    url: "https://github.com/chaitanya-y/agentic-ai-lab/tree/main/labs/01-llm-fundamentals/customer-service-agent"
  },
  ...Object.fromEntries(
    [
      "prompt-engineering",
      "context-engineering",
      "prompt-injection-and-trust-boundaries",
      "prompt-evaluation",
      "customer-support-response-assistant"
    ].map((slug) => [
      slug,
      {
        title: "Customer Support Response Assistant",
        description:
          "Use the Phase 2 application to practise prompt design, context selection, trust boundaries, and evaluation with OpenAI or optional local Ollama.",
        path: "labs/02-prompt-context-engineering/customer-support-assistant",
        roadmapLabel:
          slug === "customer-support-response-assistant" ? "Hands on project" : "Coding exercise",
        url: "https://github.com/chaitanya-y/agentic-ai-lab/tree/dev/labs/02-prompt-context-engineering/customer-support-assistant"
      } satisfies LessonLab
    ])
  )
};

export function getLessonLab(lessonSlug: string) {
  return lessonLabs[lessonSlug];
}
