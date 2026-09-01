export type GlossaryTerm = {
  definition: string;
  term: string;
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "generative AI",
    definition: "A category of artificial intelligence that produces new content such as text, code, images, audio, or video from learned patterns and the input it receives."
  },
  {
    term: "neural network",
    definition: "A mathematical model made of many learned numerical transformations. It changes input data into a prediction by applying its learned parameters."
  },
  {
    term: "parameters",
    definition: "The learned numerical values inside a model. Training adjusts them. Inference uses them without changing them."
  },
  {
    term: "inference",
    definition: "Running a trained model on a new request to produce an output. It is different from training, which changes the model parameters."
  },
  {
    term: "tokenizer",
    definition: "The component that converts text into token IDs before a language model reads it, and converts generated token IDs back into text."
  },
  {
    term: "token",
    definition: "A unit of text a model processes. It can be a word, part of a word, punctuation, whitespace, a number, or a fragment of code."
  },
  {
    term: "sequence",
    definition: "An ordered list of items. For an LLM, it is the ordered token stream in a prompt or response."
  },
  {
    term: "probability distribution",
    definition: "A set of probabilities across possible outcomes. For the next token, it describes how likely the model considers each token to be."
  },
  {
    term: "autoregressive",
    definition: "A generation method that produces one token at a time, using the prompt and all previously generated tokens as context for the next one."
  },
  {
    term: "context window",
    definition: "The maximum number of combined input and output tokens a model can use in one request."
  },
  {
    term: "pretraining",
    definition: "The broad training stage in which a model learns language and code patterns from a very large body of data."
  },
  {
    term: "base model",
    definition: "A model after broad pretraining but before it has been tuned to behave like a helpful assistant. It predicts plausible continuations but may not reliably follow a user's request."
  },
  {
    term: "post training",
    definition: "Training applied after pretraining to make a base model more useful for instructions, conversation, safety policies, tool use, or a particular response style."
  },
  {
    term: "instruction tuning",
    definition: "A form of post-training that uses examples of instructions and desirable answers to teach a model to respond more directly and follow a requested format."
  },
  {
    term: "preference training",
    definition: "Training with comparisons between candidate answers so a model learns which response better meets a quality or policy standard."
  },
  {
    term: "generalization",
    definition: "The ability to apply learned patterns to inputs that were not reproduced exactly in the training data. It does not give a model access to current facts."
  },
  {
    term: "RLHF",
    definition: "Reinforcement Learning from Human Feedback. A family of methods that uses human preference signals to shape a model's responses after pretraining."
  },
  {
    term: "reward model",
    definition: "A learned model that scores candidate responses according to preference data and a review rubric. Its score is not proof that a response is correct."
  },
  {
    term: "PPO",
    definition: "Proximal Policy Optimization. A reinforcement learning algorithm that can update a language model toward responses receiving higher reward while limiting how far each update moves from a reference model."
  },
  {
    term: "DPO",
    definition: "Direct Preference Optimization. A method that learns from preferred and less preferred response pairs without using the same reinforcement learning loop as traditional RLHF."
  },
  {
    term: "fine tuning",
    definition: "Additional training of an existing model on a narrower dataset to change its behavior for a task or response style."
  },
  {
    term: "transformer",
    definition: "The architecture used by most modern LLMs. It uses attention to relate tokens across a sequence."
  },
  {
    term: "self attention",
    definition: "The transformer operation that lets each token weigh information from other permitted tokens in the same sequence when building its representation."
  },
  {
    term: "positional encoding",
    definition: "Information added to token representations so a transformer can distinguish where each token appears in a sequence."
  },
  {
    term: "causal mask",
    definition: "A restriction used by a generative language model so a token cannot inspect future tokens while predicting the next one."
  },
  {
    term: "residual connections",
    definition: "Paths in a neural network that carry an earlier representation forward alongside a transformed version, helping deep networks retain useful information and train stably."
  },
  {
    term: "embedding",
    definition: "A vector of numbers that represents a token, phrase, or document in a way a model can process."
  },
  {
    term: "normalization",
    definition: "A numerical technique that keeps values in a stable range so a deep network can train and run predictably."
  },
  {
    term: "Mixture of Experts",
    definition: "A transformer design with several expert feed forward networks and a learned router that selects a limited subset to process each token."
  },
  {
    term: "router",
    definition: "The learned component in a Mixture of Experts model that selects which experts process each token representation."
  },
  {
    term: "active parameters",
    definition: "The subset of a model's parameters used to process a particular token. In a Mixture of Experts model, this includes shared components and the selected experts."
  },
  {
    term: "loss function",
    definition: "A numerical measure of how far a model prediction is from the expected answer. Training tries to reduce it."
  },
  {
    term: "cross entropy",
    definition: "A common loss function for classification and next token prediction. It increases the penalty when the model assigns low probability to the correct token."
  },
  {
    term: "softmax",
    definition: "A mathematical operation that turns a set of raw model scores into probabilities that add up to one."
  },
  {
    term: "prefill",
    definition: "The inference stage in which a model processes the input prompt before it begins generating a response."
  },
  {
    term: "decoding",
    definition: "The inference stage that selects and produces output tokens one at a time after the input has been processed."
  },
  {
    term: "KV cache",
    definition: "Stored attention key and value states from earlier tokens. It avoids recomputing the whole prior sequence for every new generated token."
  },
  {
    term: "prompt caching",
    definition: "A provider optimization that can reuse processing for an identical stable prompt prefix across requests. It is separate from the model's internal KV cache."
  },
  {
    term: "serving system",
    definition: "The runtime software and infrastructure that loads a trained model, schedules requests, manages memory, performs inference, and returns results to applications."
  },
  {
    term: "temperature",
    definition: "A decoding setting that reshapes the next token probability distribution. Lower values usually concentrate probability on likely tokens, while higher values spread it more broadly."
  },
  {
    term: "top p",
    definition: "A sampling control that limits candidate tokens to the smallest set whose combined probability reaches a chosen threshold."
  },
  {
    term: "quantization",
    definition: "Representing model weights or activations with fewer bits to reduce memory use and sometimes improve inference speed, with a possible effect on model quality."
  },
  {
    term: "TTFT",
    definition: "Time to first token. The elapsed time between sending a request and receiving the first generated token."
  },
  {
    term: "ITL",
    definition: "Inter token latency. The time between consecutive generated tokens after a response has started."
  },
  {
    term: "TTLT",
    definition: "Time to last token. The total elapsed time between sending a request and receiving the completed generated response."
  },
  {
    term: "LLM API",
    definition: "A network interface that lets an application send a model request and receive generated output, usage, and operational metadata from a model provider."
  },
  {
    term: "SDK",
    definition: "Software Development Kit. A library maintained by the provider that makes it easier for application code to call that provider's API."
  },
  {
    term: "schema",
    definition: "A formal description of the fields, types, and allowed values in a data structure. It lets application code validate a model's structured result."
  },
  {
    term: "idempotency",
    definition: "A property of an operation where repeating the same approved request does not create an additional side effect."
  },
  {
    term: "provenance",
    definition: "Information about where data came from, how it was produced, and which version or source supplied it."
  },
  {
    term: "agent",
    definition: "An LLM application in which a model can propose the next action from a bounded set while application code controls permissions, execution, state, and stopping conditions."
  },
  {
    term: "grounding",
    definition: "Basing a model response on trusted, relevant evidence supplied at request time instead of relying only on the model's learned patterns."
  }
];
