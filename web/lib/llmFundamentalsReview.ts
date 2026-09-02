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
        title: "Training Compute and Cost",
        current: "A new section explains accelerator hours, the infrastructure and engineering costs surrounding a training run, published examples from large model reports, and why reported compute figures cannot be compared as complete project costs."
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
      },
      {
        category: "Revised",
        title: "Hosted API visibility",
        previous: "The closing described caches, memory requirements, and serving stages together as boundaries learners would make visible in application code.",
        current: "The closing now distinguishes request identifiers, usage, streaming events, latency, completion status, and errors that an application can record from provider scheduling, accelerator memory, and KV cache details that normally remain internal to a hosted provider."
      }
    ]
  },
  {
    lesson: "LLM APIs, Provider SDKs, and LangChain",
    changes: [
      {
        category: "Renamed",
        title: "Lesson title",
        previous: "Using LLM APIs and LangChain",
        current: "LLM APIs, Provider SDKs, and LangChain"
      },
      {
        category: "Revised",
        title: "API boundary",
        previous: "The API boundary, LangChain abstractions, and a basic agent were taught together.",
        current: "The lesson now separates provider responsibilities from application responsibilities and follows one request through validation, provider execution, response parsing, and application acceptance."
      },
      {
        category: "Added",
        title: "Direct provider SDK",
        current: "The OpenAI Python SDK and Responses API provide the concrete direct integration. A Support Request Analyzer demonstrates request construction, structured output, streaming, identifiers, usage, latency, timeouts, retries, cancellation, and validation."
      },
      {
        category: "Revised",
        title: "Structured output contract",
        previous: "The order identifier type allowed null without explaining whether the key itself could be omitted.",
        current: "The lesson now explains that order_id is a required nullable field. Every result contains the key, and a null value represents a request without an order number. Tests cover valid, null, missing, and malformed values."
      },
      {
        category: "Added",
        title: "LangChain model operations",
        current: "ChatOpenAI, typed messages, invoke, stream, with_structured_output, bind_tools, response metadata, and usage metadata are now introduced through the same Support Request Analyzer."
      },
      {
        category: "Added",
        title: "LangChain message types",
        current: "SystemMessage, HumanMessage, AIMessage, and ToolMessage now have separate definitions, examples, trust boundaries, and an end to end customer service message sequence."
      },
      {
        category: "Added",
        title: "Local models with Ollama",
        current: "An optional local route now runs the same analyzer with Ollama and qwen3:14b. It introduces local setup, an explicit JSON contract, Pydantic validation, local streaming, token counts, latency, and the practical hardware tradeoff without making local inference a course requirement."
      },
      {
        category: "Revised",
        title: "Framework scope",
        previous: "LangChain was introduced broadly as an optional integration abstraction.",
        current: "The lesson now compares the direct SDK and LangChain on the same task and states which prompt, RAG, and LangGraph components will be learned later when they become relevant."
      },
      {
        category: "Added",
        title: "Agent foundations",
        current: "New sections define an AI agent, explain reasoning, planning, acting, observing, state, memory, autonomy, and collaboration, trace the execution loop, compare agents with deterministic workflows, and explain when an agent is appropriate."
      },
      {
        category: "Revised",
        title: "Code placement",
        previous: "Code examples were collected in a separate walkthrough at the end of the lesson.",
        current: "Each short code example appears with the provider SDK, structured output, streaming, or LangChain topic that it implements. One note at the beginning explains that these snippets are for observation before the final coding topic."
      },
      {
        category: "Added",
        title: "Build a Support Request Analyzer",
        current: "The final topic guides the learner through project setup, the files and functions to inspect, direct SDK execution, trace review, controlled input changes, LangChain execution, optional Ollama setup, and a comparison of all three implementations."
      }
    ]
  },
  {
    lesson: "Building an Agent with LangChain",
    changes: [
      {
        category: "Renamed",
        title: "Lesson title",
        previous: "Building a Basic Agent with LangChain",
        current: "Building an Agent with LangChain"
      },
      {
        category: "Revised",
        title: "Implementation focus",
        previous: "The lesson repeated the agent definition and several concepts already explained in the previous lesson.",
        current: "The lesson now refers to the earlier agent foundation and concentrates on implementation, tool execution, limits, tracing, tests, and running the completed agent."
      },
      {
        category: "Added",
        title: "Customer Service Agent",
        current: "The first agent handles only order status. It asks for a missing order identifier, proposes one read only lookup, verifies customer access in application code, and explains the limited tool result."
      },
      {
        category: "Added",
        title: "Bounded execution",
        current: "The run permits at most two model calls and one tool call. Repeated proposals, malformed arguments, authorization failures, unknown orders, timeouts, and invalid final responses use controlled completion paths."
      },
      {
        category: "Added",
        title: "Agent observability",
        current: "The lesson defines the provider, model, prompt, token, cache, latency, retry, tool, authorization, validation, step count, completion, and error fields recorded for each run without placing complete customer records in ordinary logs."
      },
      {
        category: "Added",
        title: "OpenAI and Ollama model selection",
        current: "The agent is implemented once against the LangChain chat model interface. MODEL_PROVIDER explicitly selects ChatOpenAI or ChatOllama with qwen3:14b while the tool, authorization, validation, execution loop, trace, and tests remain unchanged."
      }
    ]
  }
];
