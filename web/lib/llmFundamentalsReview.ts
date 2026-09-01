export type ReviewChange = {
  category: "Added" | "Renamed" | "Revised";
  current: string;
  previous?: string;
  title: string;
};

export type LessonReview = {
  changes: ReviewChange[];
  lesson: string;
};

export const llmFundamentalsReview: LessonReview[] = [
  {
    lesson: "What Is a Large Language Model?",
    changes: [
      {
        category: "Added",
        title: "Generative AI",
        current: "A new opening section defines Generative AI, distinguishes generation from fixed label prediction, introduces common content types, and positions large language models within the broader field."
      },
      {
        category: "Renamed",
        title: "Opening topic",
        previous: "LLM Systems",
        current: "Large Language Models"
      },
      {
        category: "Revised",
        title: "Direct definition",
        previous: "The lesson began by describing an LLM as one component inside a larger product.",
        current: "The lesson now begins by defining Generative AI and positioning language models within it. The following topic defines an LLM as a neural network trained to estimate probability distributions over token sequences."
      },
      {
        category: "Renamed",
        title: "Capabilities and limitations",
        previous: "Emergent Capabilities",
        current: "Capabilities and Limitations"
      },
      {
        category: "Added",
        title: "Concept examples",
        current: "New examples explain token counts, next token distributions, autoregressive generation, base and assistant models, runtime evidence, hallucinations, tool boundaries, and evaluation cases."
      }
    ]
  },
  {
    lesson: "Transformer Architecture and Attention",
    changes: [
      {
        category: "Revised",
        title: "Architecture opening",
        previous: "The lesson began with a broad comparison to earlier sequence models.",
        current: "The lesson now begins with a direct transformer definition, then explains why recurrent processing made long dependencies and training parallelism more difficult."
      },
      {
        category: "Revised",
        title: "Attention explanation",
        previous: "Queries, keys, values, and attention weights were explained inside one broad section.",
        current: "Self attention, attention scores, attention weights, multiple heads, and transformer blocks are now separated into a more precise sequence."
      },
      {
        category: "Added",
        title: "Mixture of Experts",
        current: "A new section explains expert feed forward networks, learned routing, total and active parameters, serving tradeoffs, and what parameter counts do not reveal about application performance."
      },
      {
        category: "Added",
        title: "Architecture examples",
        current: "New examples show how position changes meaning, how attention connects related tokens, how causal masking hides future tokens, and how selected experts affect active computation."
      }
    ]
  },
  {
    lesson: "How LLMs Are Trained and Improved",
    changes: [
      {
        category: "Revised",
        title: "Training definition",
        previous: "The lesson began by listing pretraining and post training stages.",
        current: "The lesson now defines model training as parameter updates that reduce prediction error before explaining the major training stages."
      },
      {
        category: "Added",
        title: "Generalization",
        current: "Generalization is now defined separately from current knowledge, with examples showing how related customer language can be recognized without access to live order facts."
      },
      {
        category: "Added",
        title: "RLHF, reward models, PPO, and DPO",
        current: "The preference optimization section now explains the full review and training workflow, distinguishes PPO from RLHF, and compares the traditional reward model approach with DPO."
      },
      {
        category: "Added",
        title: "Model benchmarks",
        current: "The evaluation section now introduces common reasoning, code, instruction following, tool use, and long context benchmarks, followed by their limitations and the need for application evaluations."
      }
    ]
  },
  {
    lesson: "LLM Inference, Tokens, Context Windows, and Latency",
    changes: [
      {
        category: "Revised",
        title: "Inference definition",
        previous: "The lesson described one request and then introduced prefill and decoding.",
        current: "The revised opening defines inference, explains what changes and what remains fixed, then traces the request from the serving system through prefill and decoding."
      },
      {
        category: "Added",
        title: "Serving systems",
        current: "A new section explains the runtime software that loads models, schedules requests, manages accelerator memory, batches work, and streams results."
      },
      {
        category: "Added",
        title: "Quantization and local inference",
        current: "A new section explains lower precision model representations, memory and speed benefits, possible quality effects, and why teams must benchmark the complete local stack."
      },
      {
        category: "Revised",
        title: "Sampling and latency",
        previous: "Temperature and top p were described without a numerical example, and latency was presented mainly as first and final response time.",
        current: "The lesson now includes a concrete sampling distribution and separates time to first token, inter token latency, generation throughput, and time to last token."
      }
    ]
  },
  {
    lesson: "Using LLM APIs and LangChain",
    changes: [
      {
        category: "Revised",
        title: "API boundary",
        previous: "The opening described an LLM response as one dependency result inside an application request.",
        current: "The revised opening directly defines an LLM API and traces the complete request boundary through validation, context assembly, model execution, output validation, and application response."
      },
      {
        category: "Revised",
        title: "Source identity",
        previous: "Trust and provenance were mentioned briefly when constructing messages.",
        current: "The lesson now explains why customer claims, authenticated records, retrieved policy, and tool results need separate identities and scoped authority."
      },
      {
        category: "Revised",
        title: "Framework visibility",
        previous: "LangChain was introduced as an optional integration abstraction.",
        current: "The revised section states exactly what a framework may simplify and which provider, prompt, schema, tool, retry, usage, latency, and error details must remain visible."
      },
      {
        category: "Added",
        title: "Basic agent",
        current: "A new section defines an agent and builds one bounded support workflow with typed messages, one read only tool, validated arguments, a step limit, traces, and a validated final response."
      }
    ]
  }
];
