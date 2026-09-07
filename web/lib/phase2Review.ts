export type Phase2ReviewLesson = {
  additions: string[];
  slug: string;
  time: string;
  title: string;
};

export const phase2ReviewLessons: Phase2ReviewLesson[] = [
  {
    slug: "prompt-engineering",
    title: "Prompt Engineering",
    time: "1.5 hours",
    additions: [
      "Prompt anatomy, roles, clarity, output formats, constraints, reusable patterns, examples, anti patterns, and cross model design",
      "A prompt template library, example selection guidance, and three exercises with worked solutions"
    ]
  },
  {
    slug: "context-engineering",
    title: "Context Engineering",
    time: "3 hours",
    additions: [
      "Context windows, components, budgets, provenance, ordering, position effects, compression, conversation history, memory boundaries, dynamic assembly, and observability",
      "A budget allocator, source and conversation selectors, citation checks, five exercises with worked solutions, and deterministic context tests"
    ]
  },
  {
    slug: "prompt-injection-and-trust-boundaries",
    title: "Prompt Injection and Trust Boundaries",
    time: "1.5 hours",
    additions: [
      "Direct and indirect injection, instruction and data separation, least privilege, output controls, and defense in depth",
      "Tests for unauthorized records, restricted sources, injected text, and unsupported action claims"
    ]
  },
  {
    slug: "prompt-evaluation",
    title: "Prompt Evaluation",
    time: "2 hours",
    additions: [
      "Task specific criteria, dataset design, deterministic and model graders, controlled comparisons, and failure analysis",
      "Twelve development cases and twelve held out cases with inspectable field and evidence checks"
    ]
  },
  {
    slug: "customer-support-response-assistant",
    title: "Customer Support Response Assistant",
    time: "2.5 hours",
    additions: [
      "A fixed two call application with request analysis, authorization, context selection, response validation, and traces",
      "OpenAI and Ollama configuration, 55 offline tests, live evaluation commands, and a complete local setup guide"
    ]
  }
];
