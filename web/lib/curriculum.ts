export type LessonFormat = "Concept" | "Capstone";

export type LessonSection = {
  id: string;
  title: string;
  content: string[];
  example?: LessonSectionExample;
};

export type LessonSectionExample = {
  content: string[];
  title: string;
};

export type LessonSectionOutline = {
  id: string;
  title: string;
  start: number;
  end?: number;
  example?: LessonSectionExample;
};

export type Lesson = {
  slug: string;
  title: string;
  time: string;
  format: LessonFormat;
  summary: string;
  content: string[];
  sectionOutline?: LessonSectionOutline[];
  sections?: LessonSection[];
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
  format: LessonFormat = "Concept",
  sectionOutline?: LessonSectionOutline[],
  sections?: LessonSection[]
): Lesson => ({
  slug,
  title,
  time,
  format,
  summary,
  content: sections ? sections.flatMap((section) => section.content) : content,
  sectionOutline,
  sections,
  example,
  concepts
});

export function getLessonSections(item: Lesson): LessonSection[] {
  if (item.sections) {
    return item.sections;
  }

  if (item.sectionOutline) {
    return item.sectionOutline.map(({ id, title, start, end, example }) => ({
      id,
      title,
      content: item.content.slice(start, end),
      example
    }));
  }

  return [{ id: "content", title: "Content", content: item.content }];
}

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
        "Learn what generative AI and large language models are, how LLMs represent and generate language, and how they should be used within a software application.",
        [
          "A large language model, or LLM, is a neural network trained to continue a sequence of language. Given the text that came before, it estimates which small piece of text is most likely to come next. It then uses the new piece as part of its input and repeats the process. A response that appears to be a single, coherent thought is therefore produced incrementally, one token after another.",
          "A token is not always a word. It may be a whole word, part of a word, punctuation, a number, or a fragment of source code. Before a model can process a request, a tokenizer converts the text into token IDs. The model operates on those IDs rather than on human readable characters. This detail matters to engineers because tokens determine the size of a request, the usable context window, the cost of a call, and part of the latency a user experiences. The next lesson studies those tradeoffs in depth.",
          "The core prediction estimates P(next token | earlier tokens). It represents the probability of a possible next token given the sequence so far. At every generation step, the model assigns a score to many candidate tokens. The serving system selects one according to its decoding settings, appends it to the sequence, and asks the model to predict again. This sequential process is called autoregressive generation. It is why a model can stream an answer as it is produced, and it is also why a long answer takes time even when the prompt has already been processed.",
          "The word large refers to both scale and capacity. Modern models are trained with enormous collections of text and code, substantial computing resources, and a very large number of learned parameters. The parameters are not a database of sentences that can be looked up one by one. They are numerical weights that capture statistical regularities in the training data. During training, the model becomes better at predicting continuations. It is not given a guaranteed, complete, or current world model.",
          "Next token prediction sounds narrower than the behavior people see in a chat interface. Yet language contains explanations, plans, programs, documents, examples, and many repeated patterns of reasoning. A model that learns to continue those patterns at scale can summarize an incident report, classify an incoming request, draft a response, transform unstructured text into fields, or help write code. These are useful capabilities, but they are generated predictions. They are not the same thing as executing a business rule, reading a live record, or proving that a statement is true.",
          "This distinction is central to AI engineering. An LLM may give a fluent answer about a product policy even when the policy has changed, the relevant exception is missing from its input, or the answer is simply mistaken. It may also make up a plausible detail because a plausible continuation has a higher probability than an admission of uncertainty. This behavior is commonly described as hallucination, but the engineering lesson is more useful than the label. Confident language is not evidence. Important claims need a trusted source and an acceptance check outside the model.",
          "Training knowledge and runtime knowledge are different. Training gives a model broad capability and a historical statistical view of language. Runtime context is the information supplied with one request, such as a customer message, the current policy excerpt, a database result, or an approved tool response. A well designed application gives the model the narrow, current evidence needed for its task. Later sections call this context engineering and retrieval augmented generation. Neither technique turns the model into a source of truth. They make the relevant source available at the moment it is needed.",
          "It is helpful to treat the LLM as a component that interprets or generates language at a boundary in the system. It can turn a customer’s informal description into a proposed issue category. It can explain a decision that application code has already made. It can extract values from a message into a typed proposal. In each case, ordinary software remains responsible for identity, authorization, data access, validation, state changes, error handling, and audit records. Those responsibilities do not become less important because a model is involved.",
          "Consider a customer who writes, ‘My order arrived damaged and I would like a refund.’ The model can identify the intent as a damaged item refund request and note that an order number or item details may be needed. The application then uses the authenticated customer identity to fetch the order, checks the delivery date and item eligibility using policy code, and retrieves the current customer facing policy if an explanation is required. The model may help present the result clearly, but it does not decide eligibility or send money merely because it generated the word ‘refund.’",
          "This separation also makes failures diagnosable. If the system gives the wrong answer, an engineer can ask whether the model misread the message, whether the right policy evidence was absent, whether the order lookup returned an incorrect record, or whether a validation rule was missing. If all of those concerns are hidden inside one large prompt, the failure is difficult to reproduce and fix. Clear boundaries let teams test deterministic components directly and evaluate model behavior against a defined task.",
          "An LLM should not receive open ended authority simply because it can describe an action persuasively. It should not choose who may access a record, calculate a final refund amount without verified inputs, write directly to a production database, or decide whether a safety sensitive request requires review. When a later lesson introduces tool calling, the model will be allowed to propose a tool and its arguments. Application code will validate the proposal, enforce permissions, execute the action, and record what happened. The model remains a participant in a controlled workflow rather than the workflow owner.",
          "This does not reduce an LLM to an autocomplete toy. Its value is precisely that it can operate on the ambiguous language surrounding a software product. It can address the issue a customer describes, the meaning of a long document, the shape of an answer a person can understand, or the next useful question to ask. The engineering work is to use that flexibility where it helps and to constrain it where correctness, security, or policy must be deterministic.",
          "By the end of this phase, you should be able to look at an AI feature and identify three things. The first is the language task assigned to the model. The second is the trusted information the model needs for that task. The third is the decision or action that must stay in application code. That mental model is the foundation for prompts, retrieval, tool use, agent workflows, and evaluation. We will add implementation examples once the course reaches the API and application integration lesson. This lesson deliberately establishes the system model before introducing a framework."
        ],
        "In the Customer Service Agent, the model receives a customer message and produces a structured proposal with the likely issue, requested outcome, and missing details. The application retrieves the authenticated customer’s order, applies the refund rules, and records any approved action. If the policy is unclear or the evidence is missing, the application asks a follow up question or routes the case to a person instead of asking the model to guess.",
        ["generative AI", "tokens", "next token prediction", "autoregressive generation", "runtime context", "grounding", "application boundaries"],
        "Concept",
        undefined,
        [
          {
            id: "generative-ai",
            title: "Generative AI",
            content: [
              "Generative AI is a category of artificial intelligence that produces new content in response to an input. The generated content may be text, source code, images, audio, video, or another data form. A generative model learns patterns from training data and uses those patterns to produce an output that fits the request and the context it receives.",
              "Generative systems differ from models that only classify or predict a fixed label. A spam classifier might choose between spam and not spam. A generative model can draft a reply, summarize a message, produce a structured record, or create an image. The output is newly constructed from learned patterns, although parts of it may resemble material encountered during training. Generated content is not automatically original, factual, current, or safe to use without review.",
              "Large language models are one important family of generative models. They work primarily with language and code by generating sequences of tokens. Other generative models work with images, speech, music, or video, and some models accept and produce several data types. Agentic AI Lab concentrates on language models because LLM applications and agents use language to interpret requests, work with documents, call software tools, and communicate results."
            ],
            example: {
              title: "Generating a support response",
              content: [
                "A customer writes that a replacement arrived damaged. A generative language model can produce a concise issue summary and draft a response in the company’s preferred tone. The application must still retrieve the authenticated order, check the current policy, and approve any action. Generating an explanation and establishing the facts are separate responsibilities."
              ]
            }
          },
          {
            id: "the-working-model",
            title: "Large Language Models",
            content: [
              "A large language model, or LLM, is a neural network trained to estimate probability distributions over sequences of tokens. Given the tokens that already appear in a sequence, it calculates which tokens are plausible next steps. During generation, one token is selected, added to the sequence, and used to calculate the following distribution. Repeating this process produces a complete response.",
              "The word large refers to the scale of the model, its training data, and the computation used to train it. A model can contain billions of learned parameters. These parameters are numerical weights that capture patterns found across language, code, and other training data. They are not rows in a knowledge database, and they do not provide a guaranteed or current record of the world.",
              "A language model is different from a product built around one. A chat product can include conversation history, file handling, search, tools, account controls, safety checks, and a user interface. The LLM provides language interpretation and generation within that system. Application code remains responsible for data access, permissions, validation, state changes, and audit records.",
              "A deployed model consists of learned parameters, a model architecture, a tokenizer, a configuration, and software that performs inference. Training creates the parameters. Inference uses those parameters to process a new request. Most application engineers work primarily with inference. They select a model, provide the appropriate context, inspect its output, and connect it to the rest of the system."
            ],
            example: {
              title: "Customer request classification",
              content: [
                "A customer writes, ‘The replacement arrived with a cracked screen.’ The model can propose that the issue is a damaged replacement and identify that the order number is missing. It cannot determine eligibility from that sentence alone. The application must retrieve the authenticated order and apply the current policy before any action is approved."
              ]
            }
          },
          {
            id: "text-is-tokens",
            title: "Tokenization",
            content: [
              "People read words and sentences. A model reads token IDs. A token is a unit produced by a tokenizer, and it is not always a complete word. It can be a whole common word, part of a word, punctuation, whitespace, a number, or a fragment of code. The phrase ‘refund approved’ might become two tokens in one tokenizer and several in another. Before the model sees a prompt, the tokenizer converts text into a sequence of integer IDs. After generation, it converts the generated IDs back into text.",
              "Why not use whole words? A vocabulary made of complete words handles typos, names, product codes, new vocabulary, and languages that do not use spaces in the same way as English poorly. Why not use individual characters? Processing individual characters works in principle but creates very long sequences. Modern tokenizers typically use subword units, which balance a manageable vocabulary with a manageable sequence length. Byte Pair Encoding is one commonly used family of methods. It starts from small units and repeatedly merges frequently occurring pairs into larger units.",
              "Tokenization has practical consequences. It influences how much context fits in a request, how a provider meters usage, how quickly a model can process a prompt, and how well a model handles source code, numbers, or less common languages. It also means that a ‘word count’ is not a reliable engineering budget. When you build an application, use the tokenizer or usage fields associated with the model you actually call. The fourth lesson returns to tokens when we discuss cost, latency, and context limits."
            ],
            example: {
              title: "Product identifiers and token counts",
              content: [
                "The text ‘Order AX10492 needs review’ may be split differently by two tokenizers. One model may represent the identifier using a few tokens while another may divide it into several fragments. The meaning appears unchanged to the user, but the token count affects request size, cost, and the context available to the application."
              ]
            }
          },
          {
            id: "a-probability-model",
            title: "Language Modeling",
            content: [
              "At a more precise level, a language model assigns probabilities to sequences of tokens. A well formed sentence such as ‘The customer received a damaged item’ is more likely under a good model of English and support conversations than a random sequence of the same tokens. The model is not checking a grammar rulebook or a database of every sentence. It has learned numerical patterns that make some continuations more likely than others in a given context.",
              "Autoregressive language models express this with the chain rule of probability. Instead of attempting to predict an entire sentence in one step, the model represents a sequence as a series of next token predictions. P(x_1, ..., x_n) = P(x_1) × P(x_2 | x_1) × ... × P(x_n | x_1, ..., x_{n-1}). There is no approximation in this decomposition. The engineering choice is to model each conditional distribution with a neural network and then generate one token after another.",
              "For a prompt ending with ‘The customer wants a’, the model may assign higher probability to ‘refund’, ‘replacement’, or ‘manager’ than to unrelated tokens. Those values form a probability distribution. The probabilities add to one across the vocabulary, but the distribution is not a statement of truth. It represents the model’s learned expectation of plausible continuation given its current input. A fluent answer is therefore evidence that a continuation fit the model’s patterns, not evidence that it was verified against your company’s current data."
            ],
            example: {
              title: "A next token distribution",
              content: [
                "For the unfinished text ‘The customer requested a’, an illustrative distribution might assign 48 percent to ‘refund’, 22 percent to ‘replacement’, and 8 percent to ‘callback’, with the remaining probability distributed across other tokens. These values describe plausible continuations. They do not prove what the customer is entitled to receive."
              ]
            }
          },
          {
            id: "generation-is-a-loop",
            title: "Autoregressive Generation",
            content: [
              "Generation is a loop. The application provides a prompt. The model produces scores for possible next tokens. A decoding method selects one token, adds it to the sequence, and asks the model to predict again. The loop ends when the model emits a stop token, reaches a configured output limit, or the application decides it has enough output. What users see as one answer is the visible result of many small prediction and selection steps.",
              "The most likely token is not always selected. If generation always chose the single highest probability continuation, outputs could become repetitive or overly rigid. Sampling controls decide how much variation is allowed. Lower temperature settings place more weight on highly likely tokens and are often appropriate for extraction or classification. Higher variation can be useful for ideation or draft writing, but it also increases behavioral variance. These controls shape the model’s wording. They do not turn uncertain source material into reliable fact.",
              "Autoregressive generation also explains two product behaviors. First, answers can stream. The provider can return text as each new token is produced instead of waiting for the whole answer. Second, generation is inherently sequential. The model cannot generate the tenth new token until the ninth exists. A longer response therefore tends to take longer than a short structured result. The inference lesson examines the prefill and decoding work behind this in more detail."
            ],
            example: {
              title: "Generating one token at a time",
              content: [
                "The model first receives ‘Your refund has’. It selects ‘been’, then evaluates ‘Your refund has been’ and selects ‘approved’. The response grows one token at a time. This is why output can be streamed and why longer responses generally require more generation time."
              ]
            }
          },
          {
            id: "parameters-and-training",
            title: "Training Objective",
            content: [
              "A neural network is a mathematical function with adjustable parameters. During training, it receives an input sequence, predicts a next token, compares that prediction with the token that actually followed in the training data, and adjusts the parameters to make similar mistakes less likely in future. A loss function measures the difference between the prediction and the expected token. For language modelling, cross entropy is the standard loss. It penalises the model when it assigns too little probability to the token that actually occurred.",
              "The parameters are not rows in a database. No single number is ‘the refund policy,’ ‘the Python syntax rule,’ or ‘the answer to a history question.’ Information is distributed across many values and layers of the network. This is why models can generalise from related examples, but it is also why they can fail in surprising ways. The model may answer a fact in one wording and fail to retrieve the same relationship when asked from the opposite direction. We can inspect behaviour and measure it, but we do not have a complete human readable map of how every learned pattern is represented internally.",
              "Thinking of a model as a lossy compression of a large body of text is a useful intuition with an important limitation. A model compresses statistical structure, relationships, styles, and fragments of knowledge into its parameters, but it is not a lossless archive and it does not perform a live lookup of its training data. It can reproduce a memorized fragment, synthesize a correct explanation from learned patterns, or generate a plausible but wrong detail. The same mechanism produces both the capability and the uncertainty."
            ],
            example: {
              title: "Learning from a prediction error",
              content: [
                "Suppose a training sequence ends with ‘The return requires manager approval’. If the model assigns little probability to ‘approval’, the loss is high. Training calculates how the model parameters contributed to that error and adjusts them slightly. Repeating this process across many sequences gradually improves next token prediction."
              ]
            }
          },
          {
            id: "why-capability-emerges",
            title: "Capabilities and Limitations",
            content: [
              "Predicting the next token appears narrow, but accurate prediction across diverse language and code requires the model to learn many reusable patterns. Continuing a program requires patterns involving syntax, APIs, names, and program structure. Continuing a support conversation requires patterns involving intent, product references, missing information, and expected response formats.",
              "This is why one general purpose model can summarize documents, classify messages, extract structured fields, translate text, draft responses, and assist with code. Each task can be expressed as producing an appropriate continuation from instructions, context, and examples.",
              "These capabilities do not guarantee competence in every situation. A model may produce valid JSON containing an incorrect identifier, explain a policy using outdated information, or generate code for the wrong library version. Engineers must therefore define the required evidence, identify likely failure modes, and validate outputs according to the risk of the task."
            ],
            example: {
              title: "Capability depends on evidence",
              content: [
                "A model can recognize that ‘the replacement arrived broken’ describes a damaged item request and produce a clear explanation. It cannot infer the authenticated order, delivery date, or current policy exception from language alone. Those facts must come from the application."
              ]
            }
          },
          {
            id: "base-models-and-assistants",
            title: "Base and Assistant Models",
            content: [
              "Pretraining creates a base model. It is a strong statistical continuation engine trained on broad data. A base model does not automatically behave like a cooperative assistant. Given a request, it may continue the text in the style of a web page, a transcript, or a document rather than answer directly. This is expected. Its objective was to continue sequences that resemble its training data, not to place a user’s instruction above all other text in a conversation.",
              "Post training changes this behaviour. In supervised fine tuning, models are trained on examples of instructions and desirable responses. Preference training then uses comparisons or feedback to make some responses more likely than others. These stages help a model follow a response format, ask a useful clarification question, refuse some requests, use structured output, or select an approved tool. The exact methods differ between model providers, but the product distinction is clear. An assistant model is a base capability shaped to participate in an interaction.",
              "This lesson introduces the distinction because it matters when you choose a model. The next lesson explains pretraining, instruction tuning, preference learning, and fine tuning in depth. For now, retain one boundary. Post training can improve how a model behaves, but it cannot make an untrusted prompt authoritative or replace your application’s permission checks, data validation, and policy logic."
            ],
            example: {
              title: "Continuation and instruction following",
              content: [
                "Given ‘Write one sentence asking for the order number’, a base model may continue the surrounding text as though it were part of a document or transcript. An assistant model is more likely to respond directly with ‘Could you provide your order number so I can review the request?’ Post training creates this difference in interaction style."
              ]
            }
          },
          {
            id: "context-is-runtime-data",
            title: "Runtime Context",
            content: [
              "Training gives a model broad learned capability. The prompt gives it the information and task for one particular request. In a production application, that prompt can contain system instructions, a user message, recent conversation, retrieved documents, tool results, and a response schema. Together, these inputs form the runtime context. The model has no memory of a customer, order, or earlier request unless your application deliberately includes or retrieves the relevant information.",
              "This is why a model can appear to learn during a chat while its parameters remain unchanged. It conditions the next response on the text in the current context window. If a conversation is long, the application may need to keep recent turns, create a summary, or retrieve the specific prior fact needed for the next task. In context learning means a model can often follow a pattern demonstrated in the prompt without parameter updates. It is powerful for a small number of examples, but it is still temporary context, not permanent training.",
              "Runtime context has different trust levels. A customer message is relevant but can contain false claims or malicious instructions. A database record may be authoritative for an order’s status. A policy document may be current, expired, for internal use only, or intended for a different audience. A good application labels and selects these sources deliberately. Later lessons call this context engineering and retrieval augmented generation. At this stage, the important idea is that sending more text is not the same as sending better context."
            ],
            example: {
              title: "The same message with different evidence",
              content: [
                "Two customers may both write, ‘Can I return this?’ One order may have been delivered yesterday and another ninety days ago. The language is identical, but the correct response depends on runtime context from the authenticated order record and current return policy."
              ]
            }
          },
          {
            id: "hallucinations-and-evidence",
            title: "Hallucinations and Grounding",
            content: [
              "A hallucination is a model output that is unsupported, invented, or incorrect. It is not necessarily a strange failure. It follows naturally from the objective. The model is rewarded during training for assigning probability to likely continuations, not for querying a live authoritative system every time it speaks. When the prompt lacks a required fact, the model may generate a detail that fits the surrounding pattern better than it generates an admission that information is missing.",
              "Suppose a customer asks whether order 10492 is eligible for a refund. The order number may look like thousands of other order numbers the model has encountered, and the policy language may sound familiar. None of that grants access to the real order, current policy version, delivery date, or customer identity. If the model says ‘yes, it is eligible’ without verified context, it has produced a plausible continuation, not a business decision. The more polished the wording, the easier it is to mistake that distinction.",
              "Grounding changes the system design, not the model’s nature. The application retrieves current policy evidence, queries approved sources for order facts, and gives the model only the information needed to interpret or explain the result. It then validates important outputs before displaying, storing, or acting on them. The goal is not to eliminate every uncertainty in language. It is to make factual claims traceable to a source and to give the system a safe path when sufficient evidence is unavailable."
            ],
            example: {
              title: "Refund eligibility",
              content: [
                "A customer asks whether order 10492 is eligible for a refund. The order number resembles identifiers seen during training, but the model has no access to the real record unless the application provides it. The system must retrieve the order and policy evidence before the model explains the result."
              ]
            }
          },
          {
            id: "models-tools-and-action",
            title: "Tool Use",
            content: [
              "A tool is a function or external capability that an application makes available to a model. Tools allow an LLM to request operations that language generation alone cannot perform, such as retrieving an order, searching approved documents, calculating a value, or submitting a structured query. The model proposes a tool and its arguments. Application code decides whether the request is valid and permitted before executing it.",
              "This division follows how people solve problems. A support representative does not calculate a refund policy in their head from memory. They consult the current policy and use the order system. The model should be treated similarly. It can determine that an order lookup is relevant, summarise the returned evidence, or draft the explanation. It should not invent tool results, decide its own privileges, or execute an irreversible action because the generated text sounds confident.",
              "Tool use makes an AI application more capable, but it creates a trust boundary. Tool descriptions and results become part of the model context. Arguments must be validated. Authorization must be enforced outside the model. Expensive, irreversible, or high risk actions may require human approval. We will cover tool calling and the Model Context Protocol later in the roadmap. This basic lesson establishes why the application, not the LLM, remains in control of execution."
            ],
            example: {
              title: "Order lookup",
              content: [
                "The model proposes an order lookup with order 10492. The application verifies that the signed in customer owns the order, validates the identifier, calls the approved read only service, and returns a limited result. The model can summarize that result, but it cannot assign itself permission or change the order."
              ]
            }
          },
          {
            id: "evaluating-empirical-systems",
            title: "Evaluation",
            content: [
              "Traditional software lets you often prove that a function returns a particular output for a particular input. LLM behaviour is different. The same task can have many acceptable wordings, model providers can release new versions, and sampling can introduce variation. Rather than relying on a single impressive demo, teams define representative cases and inspect the behaviour over the full set. They measure task success, factual support, schema validity, latency, cost, and failure handling according to the feature they are building.",
              "A benchmark score can be informative, but it is not a guarantee for your product. The benchmark may use a different prompt format, a different tokenizer, data that overlaps with training, or a task unlike your users’ work. For a customer service feature, a useful evaluation set includes ordinary requests, incomplete messages, policy conflicts, ambiguous wording, unavailable data, and attempts to make the system ignore its rules. The cases define what ‘good’ means in context.",
              "Record the conditions of an important run. Include the model identifier, system instructions, supplied context, tool results, output schema, decoding settings, token usage, and latency. This makes a bad outcome diagnosable. Without this record, a team can only say that the model ‘acted strangely.’ With it, the team can identify whether the source was missing, the prompt was ambiguous, the tool returned bad data, the validation failed, or the model itself made a poor interpretation."
            ],
            example: {
              title: "Testing beyond the successful case",
              content: [
                "An evaluation set for refund requests should include eligible orders, expired return windows, missing order numbers, policy conflicts, unavailable tools, ambiguous requests, and attempts to override system instructions. A model that succeeds only on a straightforward demonstration is not ready for the full workflow."
              ]
            }
          },
          {
            id: "what-to-carry-forward",
            title: "Key Takeaways",
            content: [
              "An LLM is a trained probability model over token sequences. It learns broad patterns from training data, then generates a response by repeatedly selecting the next token from a probability distribution. That simple loop can produce useful language, code, extraction, planning, and explanation because accurately continuing diverse text requires many reusable representations of the world and of human communication.",
              "For engineering, keep three boundaries visible. First, training knowledge is not current runtime data. Second, language generation is not verified fact or authorised action. Third, a polished response is not evidence that a system used the right source. Those boundaries lead directly to the rest of this course. Prompts define the task, context provides relevant evidence, retrieval finds changing knowledge, tools access authoritative systems, evaluation measures behaviour, and application code remains responsible for decisions and execution.",
              "Before moving on, test your own understanding. Can you explain why a model needs a tokenizer? Can you distinguish a base model from an assistant model? Can you describe why an order lookup should come from a tool rather than the model’s training knowledge? Can you name the context and validation an AI feature would need before it could safely make a customer facing claim? If you can answer those questions, you have the foundation needed for the transformer architecture and training material that follows."
            ]
          }
        ]
      ),
      lesson(
        "transformer-architecture-and-attention",
        "Transformer Architecture and Attention",
        "3 hours",
        "Understand how transformers represent tokens, preserve their order, use attention, and scale model capacity for language generation.",
        [
          "A transformer is a neural network architecture that processes a sequence of token representations through repeated attention and feed forward operations. Its central advantage is the ability to relate tokens across a sequence while processing the known input positions efficiently during training.",
          "Before transformers, recurrent neural networks commonly processed language one token at a time. Each step combined the current token with a hidden state carried from earlier steps. Information from the beginning of a long sequence had to pass through every intermediate step before influencing a later token. Gated architectures improved this process, but the sequential dependency still limited training parallelism and made distant relationships difficult to preserve.",
          "A token embedding is a learned vector that converts a token ID into a numerical representation the network can process. The initial embedding represents the token before its current context has been incorporated. The token ‘charge’ begins from the same learned embedding whether a request concerns a credit card charge or charging a device. Transformer layers update that representation using surrounding tokens so that its meaning becomes specific to the current sequence.",
          "Positional information tells a transformer where each token appears in a sequence. Self attention can compare token content, but token content alone does not express whether one event happened before another. Models may add learned position vectors or use rotation based methods such as RoPE. The implementation varies, but every approach gives the network information about token identity and sequence order.",
          "Self attention is the operation that lets each token representation incorporate information from other permitted tokens in the same sequence. For every token, the model creates three learned projections called a query, a key, and a value. The query is compared with keys to determine which positions are relevant. The corresponding values provide the information used to update the token representation.",
          "An attention score measures compatibility between one token’s query and another token’s key. The model scales the scores and applies softmax to convert them into attention weights. The output is a weighted combination of the value vectors. A larger weight means that a position contributes more through that particular attention operation. Every layer and head calculates separate weights, so there is no single attention map that completely describes how the model interpreted a request.",
          "In compact form, the operation is Attention(Q, K, V) = softmax(QKᵀ / √dₖ)V. Application engineers do not need to derive the equation. The important data flow is that queries and keys determine the weights, and the weights determine how values are combined.",
          "Transformers use multiple attention heads in parallel. Each head provides another way to relate positions in the same sequence. The roles of individual heads are learned and may overlap, so engineers should not assign permanent human descriptions to them.",
          "A transformer block combines attention with a feed forward network. Attention moves information between token positions. The feed forward network transforms each position using the contextual information attention produced. Residual connections preserve earlier representations, and normalization helps keep activations stable as information passes through many stacked blocks.",
          "A Mixture of Experts transformer replaces a single dense feed forward network with a collection of expert feed forward networks. A learned router examines each token representation and selects a limited number of experts to process it. Attention still connects information across the sequence. Expert routing changes how feed forward computation inside selected blocks is allocated.",
          "Total parameters describe all parameters available across the model. Active parameters describe the subset used for a particular token, including shared components and the experts selected by the router. A model can therefore have a large total capacity while using only part of that capacity for each token.",
          "Mixture of Experts can increase capacity without running every expert for every token, but it does not remove serving costs. All expert parameters must be stored, routing adds computation, and distributed serving may move token representations between accelerators. Uneven routing can overload some experts. Quality and latency depend on training, routing, hardware, batching, and serving implementation rather than parameter count alone.",
          "Application engineers do not normally configure expert routing through an API. The practical lesson is that total parameter count does not reveal the compute required for one request. Model selection should rely on measured quality, latency, throughput, and cost for the actual workload.",
          "A decoder only transformer predicts the next token using the tokens that precede it. The prompt and generated response occupy one sequence. The original transformer used an encoder and decoder for translation, while many generative LLMs use the decoder only arrangement most relevant to chat and text generation APIs.",
          "Causal masking prevents a token position from inspecting future tokens during training. If the model could see the token it was expected to predict, it could copy the answer. The mask lets training calculate predictions for many known positions in parallel while preserving the causal rule. During inference, future tokens do not exist, so the model must generate them one at a time.",
          "Attention weights describe information flow within one operation. They are not confidence scores, source citations, or a complete account of the computations that produced an output. A high attention score does not make a document authoritative. Production evidence should come from retrieval results, tool logs, citations, and validation records.",
          "For application engineers, the model context is a working set with competing signals. System instructions, user text, retrieved documents, tool output, examples, and previous conversation occupy the same sequence. Irrelevant documents can introduce competing language, and an excerpt without its heading can lose an important condition. Context engineering makes those inputs deliberate.",
          "For a damaged item request, the application should send a short task instruction, the latest customer message, a limited order projection, and the relevant current policy passage with its heading and source label. It should exclude unrelated history, expired policies, and internal notes.",
          "Transformer architecture explains why token order, context placement, irrelevant text, source labels, and output length affect model behavior. It does not remove the need for trusted data, validation, authorization, or application controlled execution."
        ],
        "For a damaged item request, the Customer Service Agent will send the model the customer’s latest message, a limited set of verified order facts, and the current public policy section. The policy heading stays attached to the relevant paragraph so its conditions are not separated from the rule. The application will keep internal notes and stale policies outside the model context, then validate any proposed action using deterministic code.",
        ["transformer", "token embeddings", "positional information", "self attention", "queries keys values", "multiple attention heads", "Mixture of Experts", "causal masking", "decoder only models"],
        "Concept",
        [
          {
            id: "transformer-architecture",
            title: "Transformer Architecture",
            start: 0,
            end: 4,
            example: {
              title: "Sequence order changes meaning",
              content: [
                "‘Refund after delivery’ and ‘delivery after refund’ contain the same words but describe different events. Token embeddings represent the words, while positional information lets the transformer represent their order."
              ]
            }
          },
          {
            id: "self-attention",
            title: "Self Attention",
            start: 4,
            end: 7,
            example: {
              title: "Connecting damaged to replacement",
              content: [
                "In ‘The replacement arrived damaged’, one attention head may assign a larger weight from ‘damaged’ to ‘replacement’ than to unrelated positions. That contribution helps connect the condition to the correct item. It does not prove that the replacement is eligible for a refund."
              ]
            }
          },
          { id: "transformer-blocks", title: "Transformer Blocks", start: 7, end: 9 },
          {
            id: "mixture-of-experts",
            title: "Mixture of Experts",
            start: 9,
            end: 13,
            example: {
              title: "Active and total experts",
              content: [
                "Consider a simplified layer containing eight experts where the router selects two for each token. All eight experts contribute to the total parameter count, but only the selected two perform expert computation for that token. The experts are learned numerical functions, not fixed human categories such as a refund expert or a code expert."
              ]
            }
          },
          {
            id: "decoder-only-models",
            title: "Decoder Only Architecture",
            start: 13,
            end: 15,
            example: {
              title: "Predicting the hidden token",
              content: [
                "For ‘The refund was approved’, the position processing ‘was’ may use ‘The refund’ but cannot inspect ‘approved’ when learning to predict it. The causal mask blocks that future token even though the complete training sentence is available."
              ]
            }
          },
          { id: "attention-and-evidence", title: "Attention and Interpretability", start: 15, end: 16 },
          {
            id: "context-as-input",
            title: "Context Design",
            start: 16,
            example: {
              title: "Selecting useful context",
              content: [
                "For a damaged item request, the application sends the current message, verified order facts, and the relevant policy passage with its heading. It excludes unrelated conversation, expired policies, and internal notes. The transformer relates information across the supplied sequence while the application decides what is trusted and necessary."
              ]
            }
          }
        ]
      ),
      lesson(
        "how-llms-are-trained-and-improved",
        "How LLMs Are Trained and Improved",
        "3 hours",
        "Learn how pretraining creates general capability, how post training shapes assistant behavior, and how engineers evaluate or adapt a model for a specific application.",
        [
          "Training a large language model is the process of adjusting its parameters so it becomes better at a defined prediction task. During training, the model processes examples, produces predictions, measures the difference between its predictions and the expected results, and updates its parameters to reduce that error. Repeating this process across very large datasets produces the language and reasoning capabilities that application engineers later access through an API.",
          "The model available through an API is usually the result of several training stages rather than one training run. The broad sequence is pretraining followed by post training. Pretraining develops general capability with language, code, and common patterns. Post training shapes that capability into behavior that is more useful for conversation, instruction following, structured output, tool use, and safety. Application engineers do not need to reproduce these training runs, but they need to understand what each stage can change and what must still be handled by application code.",
          "Pretraining is the large scale training stage in which a model learns from extensive collections of text, code, and other permitted data. The training objective is usually next token prediction. The model receives a sequence, predicts the next token, compares that prediction with the actual token, and adjusts its parameters through gradient based optimization. Over many examples, it learns patterns involving grammar, programming languages, factual associations, document structures, writing styles, and common problem solving approaches.",
          "Training data strongly affects the resulting model. Data quality, diversity, recency, language coverage, code coverage, duplication, and incorrect material all influence later behavior. Large training pipelines therefore include collection, filtering, deduplication, formatting, and quality assessment. These processes improve the dataset, but they do not turn it into a complete or perfectly current source of knowledge.",
          "A base model is the model produced by pretraining before it has been extensively shaped to behave as an assistant. It can continue text, complete code, imitate document structures, and reproduce many patterns learned during training. It does not automatically treat a user request as an instruction that must be answered directly. Its original objective was to predict likely continuations rather than to become a cooperative product interface.",
          "Generalization is the ability to apply learned patterns to inputs that were not reproduced verbatim during training. A model does not need to have seen every possible customer message. It can learn that phrases such as ‘the package was broken,’ ‘my delivery arrived damaged,’ and ‘the item is unusable’ describe related situations. This capability allows one model to work with the variety of language found in real applications.",
          "Generalization is not the same as access to current evidence. A model may recognize that a message concerns a damaged delivery while still lacking the customer’s order details, the current refund policy, or a recent policy exception. Rare domains, changing rules, unusual identifiers, and exact transactional facts require runtime evidence from retrieval or tools.",
          "Supervised fine tuning is a post training method that teaches a model from examples containing an input and a desirable output. When the examples are instructions paired with strong responses, the process is also called instruction tuning. The model learns patterns such as answering the requested question, respecting an output format, asking for missing information, following system instructions, and returning structured data.",
          "Supervised fine tuning helps explain the difference between a base model and an assistant model. A base model may continue a customer conversation as if it were completing a transcript. An assistant model has been trained on examples that demonstrate how to respond to the customer. The architecture may remain the same, but the expected interaction has changed.",
          "Supervised fine tuning shapes behavior. It does not guarantee that a response is correct. If the training examples contain outdated policies, inconsistent labels, or weak answers, the model can learn those weaknesses. Current facts should still come from runtime context, and important output should still be evaluated or validated.",
          "Preference optimization trains a model to favor responses that people or evaluators judge to be better. Instruction examples can demonstrate a desirable answer, but many quality decisions involve comparisons. Two answers may both address the request while differing in accuracy, clarity, safety, completeness, or adherence to policy.",
          "Reinforcement learning from human feedback, commonly called RLHF, is a family of methods that uses human preferences to improve model behavior. A common workflow begins by generating several responses to the same prompt. Human reviewers compare or rank those responses using a defined rubric. The resulting preference data is then used to guide further model training.",
          "A reward model is a learned model that estimates which response a reviewer would prefer. It receives a prompt and a candidate response, then produces a score based on patterns learned from the comparison data. The reward model is not a source of truth. It represents the preferences and rubric present in its training data.",
          "Proximal Policy Optimization, commonly called PPO, is one reinforcement learning algorithm used in traditional RLHF pipelines. In reinforcement learning terminology, the language model being improved is called the policy. The policy generates a response, the reward model scores it, and PPO adjusts the policy toward responses that receive higher scores. The update is constrained so the model does not move too far from a reference model in one step. PPO is one method used within RLHF rather than another name for RLHF.",
          "Direct Preference Optimization, commonly called DPO, is a different method for learning from preferred and rejected response pairs. It directly increases the relative probability of the preferred response without training a separate reward model or running the same reinforcement learning loop used by PPO. DPO simplifies part of the training pipeline, but the quality of the result still depends on the examples, preference rubric, and evaluation process.",
          "Preference data can come from human reviewers, domain experts, policy guided evaluation, model assisted evaluation, or automated checks. Every source has limitations. Reviewers can disagree, rubrics can omit important qualities, and automated judges can favor superficial patterns. A model can also learn responses that score well under the preference process without becoming more truthful. Teams therefore evaluate the resulting model on separate cases rather than treating preference optimization as proof of quality.",
          "Specialized post training can prepare models for structured outputs and tool calling. The model may learn when a tool is relevant, how to select from an allowed tool set, and how to produce arguments that match a schema. This behavior makes the model easier to integrate into applications.",
          "Tool training does not make a proposed tool call safe. A model can choose the wrong tool, provide invalid arguments, or respond to instructions contained in untrusted text. Application code must validate the arguments, enforce authorization, control execution, and record the outcome. Training improves the model interface. It does not replace the application security boundary.",
          "Reasoning models are models trained and served to spend additional computation on difficult tasks before returning a final answer. They can improve performance on multistep analysis, code investigation, planning, and ambiguous decisions. They can still begin with incomplete evidence, misunderstand policy, or propose an invalid action. Retrieval, validation, and evaluation remain necessary.",
          "Application fine tuning is additional training performed for a specific product, domain, or recurring task. It changes model parameters using a curated dataset. It is different from adding documents to a prompt or retrieving current information at runtime.",
          "A product team should consider fine tuning when the task is stable, a substantial collection of high quality examples exists, success can be measured, and simpler approaches have been evaluated. Fine tuning may help a smaller model perform a narrow classification task more consistently or reduce the amount of instruction needed for a repeated output style.",
          "Fine tuning is usually not the first solution to a weak prototype. Retrieval is appropriate when the model lacks current documents. A tool is appropriate when it needs exact account or order data. A schema is appropriate when the response must follow a precise structure. Deterministic code is appropriate when a business rule must be applied exactly. A clearer task definition is appropriate when the expected behavior is still ambiguous.",
          "Model evaluation is the systematic process of measuring model behavior on defined tasks. It allows engineers to compare models, prompts, training methods, and application configurations using evidence rather than general impressions.",
          "Public benchmarks measure broad categories of capability. MMLU and GPQA are examples of knowledge and reasoning benchmarks. GSM8K and MATH assess mathematical reasoning. HumanEval measures code generation, while SWE-bench evaluates work on software engineering issues. IFEval measures instruction following. BFCL evaluates aspects of tool selection and function calling. LongBench covers several long context tasks. These benchmarks help describe general capability, but no single score represents overall model quality.",
          "Benchmark results have important limitations. Test data may overlap with training data, models may be optimized for well known benchmarks, and scoring methods may hide meaningful failure modes. Results can also change with the prompt, tool access, reasoning budget, and evaluation configuration. Most importantly, a public benchmark may have little resemblance to the task in a specific product.",
          "Application evaluation should use representative inputs, trusted expected behavior, and failure cases from the intended workflow. When comparing models, engineers should record the model identifier, prompt version, available tools, supplied context, output schema, latency, cost, and evaluation results. This makes the comparison reproducible and exposes whether an improvement came from the model or from another part of the system.",
          "Training determines a model’s general capabilities and tendencies. It does not determine whether an application is correct. Pretraining supplies broad capability. Post training makes that capability easier to use. The application still defines the task, supplies current evidence, controls access to tools, validates important output, and measures whether the result is acceptable."
        ],
        "The Customer Service Agent will begin with an instruction following model and a versioned evaluation set containing damaged items, unclear requests, policy exceptions, missing order information, and unsafe refund instructions. Every candidate model will receive the same trusted context, tool definitions, and output contract. A lower cost model may handle issue classification if it meets the required quality threshold, while a stronger model may explain complex policy. Application code will continue to control customer data access, eligibility checks, and refund approval.",
        ["large language model training", "pretraining", "training data", "base model", "generalization", "supervised fine tuning", "preference optimization", "RLHF", "reward model", "PPO", "DPO", "reasoning models", "application fine tuning", "model evaluation", "benchmarks"],
        "Concept",
        [
          { id: "training-large-language-models", title: "Training Large Language Models", start: 0, end: 2 },
          {
            id: "pretraining-and-generalization",
            title: "Pretraining and Generalization",
            start: 2,
            end: 7,
            example: {
              title: "Base models and generalization",
              content: [
                "A base model given ‘Write a response to a customer requesting a refund’ may continue with another instruction or imitate a transcript. An assistant model is more likely to answer directly because post training has taught it the expected interaction.",
                "The messages ‘my parcel is cracked’, ‘the product arrived broken’, and ‘the item was damaged during delivery’ use different wording. A model can classify all three as damaged item requests through generalization. It still needs verified order data and the current policy before any refund decision can be made."
              ]
            }
          },
          {
            id: "supervised-fine-tuning",
            title: "Supervised Fine Tuning",
            start: 7,
            end: 10,
            example: {
              title: "Learning an application response format",
              content: [
                "A training example asks the model to identify the intent, urgency, and missing information in a customer message. The desirable output identifies a damaged item request, assigns normal urgency, and reports that the order identity is missing. Repeated examples teach the task and output pattern without giving the model access to live order records."
              ]
            }
          },
          {
            id: "preference-optimization",
            title: "Preference Optimization",
            start: 10,
            end: 16,
            example: {
              title: "RLHF, PPO, and DPO",
              content: [
                "Reviewers compare two responses to a damaged item request using a policy rubric. One promises an immediate refund without checking eligibility. The other explains that the order and policy conditions must be verified first. Reviewers prefer the second response. A reward model can learn to score responses with those qualities, and PPO can update the language model toward similar behavior.",
                "DPO can learn from the same preferred and rejected pair by increasing the relative probability of the preferred response without first training a separate reward model. Both approaches still depend on the quality of the examples and the evaluation rubric."
              ]
            }
          },
          { id: "specialized-post-training", title: "Specialized Post Training", start: 16, end: 19 },
          {
            id: "fine-tuning-decisions",
            title: "Fine Tuning Decisions",
            start: 19,
            end: 22,
            example: {
              title: "When fine tuning becomes reasonable",
              content: [
                "A team evaluates thousands of support messages and finds that a smaller model repeatedly confuses two stable issue categories despite a precise prompt and consistent labels. The team may fine tune that model for the narrow classification step. If the failures instead come from missing or outdated refund policy, retrieval is the appropriate solution."
              ]
            }
          },
          {
            id: "model-evaluation",
            title: "Model Evaluation",
            start: 22,
            end: 26,
            example: {
              title: "Comparing models for customer support",
              content: [
                "Two candidate models receive the same customer messages, system instructions, policy passages, tool definitions, and output schema. The evaluation measures intent classification, use of policy evidence, missing information detection, invalid tool proposals, latency, and cost. The stronger choice is the model that meets the product requirements across representative cases, not necessarily the model with the highest general benchmark score."
              ]
            }
          },
          { id: "application-responsibility", title: "Application Responsibility", start: 26 }
        ]
      ),
      lesson(
        "inference-tokens-context-and-latency",
        "LLM Inference, Tokens, Context Windows, and Latency",
        "3 hours",
        "Understand how a trained LLM serves a request from prefill through decoding, then measure and control the token, memory, latency, and cost tradeoffs that shape an application.",
        [
          "LLM inference is the runtime process of using a trained language model to generate a response. The application sends a request, the serving system converts its text into tokens, the model processes those tokens, and the serving system generates output tokens until it reaches a stopping condition or the configured output limit. Inference is different from training because the model parameters do not change when a user sends a request. Conversation history affects an answer only when the application includes that history in the current context.",
          "A useful mental model divides inference into two stages. During prefill, the model processes the input tokens and computes the internal states needed to use them as context. During decoding, it produces one new token, adds that token to the sequence, and repeats. Prefill work grows with the amount of input. Decode work grows with the number of generated tokens. A response with a long policy prompt can have a slow first token, while a long explanation can continue for several seconds after the first token appears.",
          "An LLM serving system is the runtime infrastructure that accepts requests and executes a model. It commonly includes an API layer, a request queue, a scheduler, the model runtime, accelerator hardware, memory for active requests, token streaming, and operational monitoring. The model supplies learned parameters and computes token probabilities. The serving system decides when and where the model runs, manages concurrent requests, stores temporary caches, and returns generated tokens to the application.",
          "This distinction matters because application behavior is influenced by more than the model. A request may wait in a provider queue before computation begins. A long prompt may require substantial prefill work. Several active conversations may compete for accelerator memory. A provider may batch compatible requests to improve throughput. When latency changes, engineers should investigate the complete serving path instead of assuming that the model itself became slower.",
          "Tokens are the units that prefill and decoding operate on. Character count is only a rough proxy because tokenization varies by language, punctuation, numbers, code, and model family. The text ORDER 10492 may use several tokens, while a common word may use one. Engineers should use the tokenizer and usage data for the model they actually call when estimating context size and cost. A fixed characters per token estimate is useful for early planning but is not precise enough for production limits.",
          "Every model has a context window. It is the maximum combined number of input and output tokens the model can handle for one request. It is not a separate allowance for documents. System instructions, user messages, examples, conversation history, retrieved passages, tool definitions, tool results, and the response all compete for the same budget. If the input is close to the limit, the application may leave too little room for a useful answer. If the request exceeds the limit, the provider may reject it or the application may need to trim, summarize, or retrieve less context.",
          "The output limit is an engineering control as well as a cost control. It bounds how long the model may generate and helps keep response times predictable. A label, routing decision, or structured proposal may need only a small output budget. A customer explanation may need more room. A response that regularly reaches its limit should be inspected because it may indicate an unclear task, an unsuitable response format, excessive reasoning, or a need to divide the work into smaller steps.",
          "Streaming changes the experience of waiting. Instead of holding the complete answer until generation ends, the provider sends partial output as tokens become available. The user can begin reading earlier, but streaming does not reduce the underlying generation work. The application still needs to handle interruption, disconnected clients, partial output that should not yet be persisted, and tool calls that may occur before a final answer is available. A streamed response remains subject to the same validation and safety boundaries as a response delivered at once.",
          "Decoding settings control how the serving system selects output from the model's next token probabilities. Temperature changes the shape of the probability distribution. A lower temperature concentrates more probability on the strongest candidates and usually produces more consistent output. A higher temperature spreads probability across more candidates and allows more variation. Temperature does not add knowledge or make uncertain information correct.",
          "Top p sampling limits selection to the smallest group of likely tokens whose combined probability reaches a chosen threshold. It is a candidate selection rule rather than another form of factual validation. Temperature and top p can be used together, although provider implementations and recommended ranges differ. Engineers should test decoding settings on representative tasks because the right choice depends on whether the application is extracting data, classifying a request, writing an explanation, or generating creative alternatives.",
          "Lower variation is not identical to perfect reproducibility. Providers can update model versions, use distributed infrastructure, and change serving behavior. If a provider supports a seed or a version specific model identifier, use it when comparison matters, but still record the request and response. For an important test case, capture the model identifier, prompt version, input context, decoding settings, output schema, and timestamp. That record allows a team to investigate a behavior change instead of relying on memory of what the model usually produced.",
          "During decoding, recomputing the key and value representations for every earlier token at every new step would be wasteful. A KV cache stores previously computed key and value states so the model can reuse them while generating the continuation. This reduces repeated work, but it consumes memory and does not remove the sequential nature of autoregressive decoding. Application engineers usually receive this optimization from a provider, yet understanding it explains why long conversations and many concurrent generations affect performance and capacity.",
          "Provider prompt caching is related to the KV cache but serves a different purpose. Some providers can reuse a stable prompt prefix, such as a long system instruction or a shared reference document, across separate requests. This can lower input processing time or cost when the exact prefix is reused under the provider's rules. It is an optimization to consider after measuring a repeated workload, not a reason to place unnecessary material in every prompt. Design the smallest complete context first, then assess whether a stable prefix justifies caching.",
          "Quantization represents model weights, and sometimes activations or cache values, with lower numerical precision. A model commonly stored with sixteen bit values may be converted to eight bit or four bit values. Lower precision reduces the storage and memory bandwidth required to load and run the model. This can make local inference possible on hardware that could not hold the original representation and can improve throughput when the runtime and hardware support the selected format.",
          "Quantization involves tradeoffs. More aggressive quantization can reduce output quality, particularly on tasks that depend on subtle numerical distinctions. Actual speed improvements depend on the hardware, runtime, quantization method, and model architecture. Quantization does not make the context window larger and does not remove the memory required for active requests and the KV cache. Teams should evaluate a quantized model on representative tasks instead of assuming that a smaller file behaves identically to the original model.",
          "LLM latency should be measured with several metrics because a single total duration hides where the user waited. Time to first token, commonly written as TTFT, measures the time from dispatching the model request until the first generated token arrives. It includes provider queueing, input processing, and the start of decoding. TTFT is especially important for streamed interfaces because it determines how quickly the response begins to feel active.",
          "Inter token latency, commonly written as ITL, measures the delay between generated tokens during streaming. Output tokens per second describes the average generation rate during decoding. These metrics describe similar behavior from different perspectives. A lower ITL and a higher token rate usually produce smoother streaming, although batching, network delivery, and client rendering can affect what the user sees.",
          "Time to last token, commonly written as TTLT, measures the duration from dispatching the model request until the final generated token arrives. It includes TTFT and the remaining decoding time. The complete application response can take longer because authentication, retrieval, tool calls, validation, and browser delivery may occur before or after the model call. Record both model metrics and complete application timing so the team can locate the actual bottleneck.",
          "Cost is also a property of the complete request. Providers commonly meter input and output tokens differently, while prices and caching rules change over time. A long output can cost more and take longer even when the input is small. A large retrieved context can dominate input usage even if only one sentence appears in the final answer. Log usage from the provider response, attribute it to the feature and request type, and set budgets or alerts around measured traffic.",
          "A context budget turns these ideas into a design decision. Suppose a feature has room for 16,000 tokens. It might reserve 1,000 for system instructions and the output schema, 2,000 for recent conversation, 1,500 for verified order facts and tool results, 6,000 for retrieved policy evidence, and 2,000 for the customer response. The remaining space provides headroom for variation. These numbers are illustrative. The important habit is to allocate space intentionally and define what is shortened or removed first when a request would exceed the budget.",
          "For a damaged item request, the Customer Service Agent should not send the complete conversation or every return policy document. It can send the current request, a compact summary of necessary prior turns, a limited projection of the verified order, and the few current policy passages selected for the case. The trace should show how many tokens each component used and whether latency came from retrieval, the order tool, provider queueing, prefill, or decoding.",
          "LLM inference is an observable runtime process. It has a serving path, input and output budgets, decoding settings, caches, memory requirements, measurable latency stages, and operating costs. In the next lesson, learners make these boundaries visible in code through a direct API request, response streaming, structured output, and a small agent built with selected LangChain components."
        ],
        "For a refund question, the Customer Service Agent will reserve context space for the task instruction, the latest customer message, a small verified order projection, and selected policy passages. It will reserve output space for a concise explanation, stream the final text, and record input tokens, output tokens, TTFT, ITL, tokens per second, TTLT, and the time spent in retrieval and order lookup.",
        [
          "LLM inference",
          "serving systems",
          "prefill",
          "decoding",
          "tokens",
          "context windows",
          "output limits",
          "streaming",
          "temperature",
          "top p",
          "KV cache",
          "prompt caching",
          "quantization",
          "local inference",
          "TTFT",
          "ITL",
          "tokens per second",
          "TTLT",
          "cost"
        ],
        "Concept",
        [
          {
            "id": "llm-inference",
            "title": "LLM Inference",
            "start": 0,
            "end": 2,
            "example": {
              "title": "Prefill and Decoding",
              "content": [
                "A support request includes a long policy passage and asks for a short explanation. The model must process the entire policy during prefill before the first output token can appear. Once decoding begins, it produces the short explanation one token at a time. Reducing unnecessary policy text can improve TTFT, while limiting the answer length reduces decoding work."
              ]
            }
          },
          {
            "id": "serving-systems",
            "title": "Serving Systems",
            "start": 2,
            "end": 4,
            "example": {
              "title": "A Request Moving Through a Serving System",
              "content": [
                "A customer asks why an order has not arrived. The application authenticates the customer, retrieves a limited order record, and sends the request to the model provider. The serving system queues the request, processes the prompt during prefill, generates the explanation during decoding, and streams tokens back to the application. The model produces the language, while the serving system controls scheduling, memory, streaming, and usage measurement."
              ]
            }
          },
          {
            "id": "tokens-and-context-windows",
            "title": "Tokens and Context Windows",
            "start": 4,
            "end": 7,
            "example": {
              "title": "Competing for the Context Window",
              "content": [
                "A request contains 2,000 tokens of instructions, 7,000 tokens of conversation, 10,000 tokens of retrieved documents, and an expected 2,000 token answer. A model with a 16,000 token context window cannot accept that complete plan. The application must select fewer documents, summarize older conversation, reduce the answer budget, or choose a model with a larger context window."
              ]
            }
          },
          {
            "id": "streaming-and-sampling",
            "title": "Streaming and Sampling",
            "start": 7,
            "end": 10,
            "example": {
              "title": "Temperature and Top P",
              "content": [
                "Suppose the prompt ends with 'The customer requested a' and the model assigns probability 0.58 to 'refund,' 0.21 to 'replacement,' 0.12 to 'return,' and 0.03 to 'review.' A low temperature makes 'refund' more dominant. A higher temperature gives the less likely choices more opportunity to be selected. With top p set to 0.90, the serving system can keep 'refund,' 'replacement,' and 'return' because their combined probability reaches 0.91. These controls affect variation in wording. They do not determine whether a refund is permitted."
              ]
            }
          },
          {
            "id": "reproducibility-and-caching",
            "title": "Reproducibility and Caching",
            "start": 10,
            "end": 13,
            "example": {
              "title": "Two Different Caches",
              "content": [
                "During one generated response, the KV cache lets the model reuse attention states for earlier tokens. Across several separate requests, provider prompt caching may reuse an identical policy prefix. The first cache accelerates continued decoding inside a request. The second can reduce repeated input processing across requests."
              ]
            }
          },
          {
            "id": "quantization-and-local-inference",
            "title": "Quantization and Local Inference",
            "start": 13,
            "end": 15,
            "example": {
              "title": "Running a Model Locally",
              "content": [
                "A model with seven billion parameters needs roughly fourteen gigabytes just for its weights when each parameter uses sixteen bits. Representing those weights with four bits reduces the raw weight size to roughly three and a half gigabytes. The complete process still needs additional memory for the runtime, metadata, activations, and KV cache. The smaller representation may allow the model to run on a developer laptop, but the team must compare response quality and latency before choosing it for an application."
              ]
            }
          },
          {
            "id": "latency-metrics-and-cost",
            "title": "Latency Metrics and Cost",
            "start": 15,
            "end": 19,
            "example": {
              "title": "Reading Latency Metrics",
              "content": [
                "A support response has a TTFT of 1.8 seconds and then generates 240 tokens at about 35 tokens per second. The response begins after 1.8 seconds but needs several more seconds to finish. If TTFT increases while the token rate remains stable, queueing or prefill may be responsible. If TTFT remains stable but generation becomes slow, model size, serving load, or decoding performance may be responsible. If both remain healthy while the page still feels slow, retrieval or tool execution may be the actual bottleneck."
              ]
            }
          },
          {
            "id": "context-budgeting",
            "title": "Context Budgeting",
            "start": 19,
            "end": 22,
            "example": {
              "title": "A Budget for a Support Request",
              "content": [
                "The Customer Service Agent reserves space for its task instruction, a compact conversation summary, verified order facts, selected policy evidence, and a concise answer. When the request grows, it removes older conversational detail before dropping the current order record or the policy passage needed for the decision. The priority follows the task rather than the order in which the text was collected."
              ]
            }
          }
        ]
      ),
      lesson(
        "using-llm-apis-and-langchain",
        "Using LLM APIs and LangChain",
        "3 hours",
        "Build a basic agent through a direct provider integration and selected LangChain components while keeping requests, model versions, tools, outputs, and failures visible to application code.",
        [
          "An LLM API is a network interface that allows an application to send input to a hosted language model and receive generated output. A request usually contains a model identifier, instructions, task input, configuration, and sometimes an output schema or tool definitions. The provider returns generated content and operational metadata such as a request identifier, token usage, and completion status. The application must treat that response as the result of an external dependency and decide whether it is valid for the product workflow.",
          "A basic integration follows a familiar software lifecycle. The server authenticates the caller, validates the application request, assembles permitted context, calls the model, validates the returned result, and sends an application response. The model output is probabilistic and may be incomplete, malformed, or unsuitable for the requested task. Application code therefore remains responsible for permissions, validation, business rules, and side effects.",
          "Provider SDKs are usually the best place to start. A direct SDK call exposes the actual model identifier, messages, output settings, streaming events, errors, and usage fields. This visibility is valuable while a feature is small because an engineer can see what crosses the boundary and compare prompt or model changes. A framework can be introduced when it removes real repetition rather than becoming the first abstraction in the project.",
          "Chat APIs commonly represent a request as an ordered collection of messages or content blocks. A system instruction describes the task and application boundaries. A user message contains the person's request. Retrieved documents, tool results, and earlier conversation may appear as additional content. The exact message types differ across providers, but the application should preserve the identity and role of each source.",
          "Source identity describes where information came from and what that source is allowed to establish. A customer message is authoritative for what the customer is asking, but it is not proof of an order status. An authenticated order record can establish selected order facts. A policy passage can support a policy explanation only when its version and scope are current. The traceable origin of this information is often called provenance. Recording it helps engineers understand why the model received a claim and whether the application was entitled to rely on it.",
          "Labels alone do not create trust. Untrusted text can still contain false claims or instructions designed to influence the model. The application must enforce permissions, restrict data access, and decide which source can support each business decision. Keeping sources separate makes those boundaries easier to review, test, and debug.",
          "The API contract should fit the task. A routing step might return a small structured proposal containing an issue category, missing details, and a recommended next step. A customer explanation might return text only after application code has determined the outcome. Avoid asking one model call to interpret a request and execute a business decision. Separating those jobs gives each call a clearer input, a smaller output budget, and a better test surface.",
          "Set explicit limits on output and time. An output token limit prevents an extraction call from producing an unnecessary essay and establishes a bound on generation work. A timeout prevents an upstream delay from holding an application request indefinitely. A cancellation path matters when the user leaves the page or changes the request. These are familiar service concerns, but generation can take longer than a database read and may deliver partial output while it is still running.",
          "Retries require care. A transient network failure may justify retrying a model request, but a retry can increase cost and create duplicate work. The safe policy depends on what completed before the failure and whether the workflow can produce side effects. Retrying a classification request that only reads data is different from retrying a workflow that already sent an email or created a ticket. Consequential actions need their own idempotency and approval controls instead of relying on a general API retry.",
          "Streaming is a delivery choice rather than a correctness feature. When a provider streams, the server receives incremental events and can forward suitable text to the browser before the final response is complete. This can improve perceived responsiveness for a long explanation. It also means the interface must handle interruption, reconnects, final metadata, and content that should not be accepted until the run finishes. For a structured decision, it is often simpler to wait for a complete validated result.",
          "The model choice belongs to the task. A smaller model may be sufficient for classifying a short message, extracting a few fields, or selecting from a fixed set of routes. A stronger reasoning model can be useful when the task requires complex synthesis or planning. Compare candidates on representative cases under the same context. Measure task quality, schema validity, latency, and cost rather than choosing from a provider's broad model description.",
          "Pin the model identifier when the provider allows it and record the version actually called. A model name can be an alias that changes over time. The same principle applies to prompts, schemas, tools, and framework versions. For an important request, a trace should answer which model received which approved context, what settings were used, and what the application accepted or rejected. This is the minimum evidence needed to investigate a behavior change.",
          "LangChain is an application framework with integrations for model providers, message types, structured output, tools, document loaders, retrieval components, and workflow composition. Its value is not that it makes the model more capable. It can give common components a consistent interface and reduce repeated adapter code as a system grows.",
          "Use LangChain when its abstractions solve an integration problem. It can help when a team tests two providers behind one model interface, binds one structured output schema to several model calls, or composes reusable retrieval components. A direct SDK is often easier to debug for one small endpoint. Whichever approach is used, the prompt, input data, tool permissions, model choice, errors, and returned usage should remain understandable to a teammate who did not create the feature.",
          "An agent is an LLM application in which the model can propose the next action from a bounded set of choices while application code controls execution. The model may decide to answer directly, request more information, or call an available tool. The application validates the proposal, executes an allowed action, returns the result to the model when needed, and stops the process when it reaches a final response or a configured step limit.",
          "In this lesson, learners build a basic customer service agent using selected LangChain concepts. The implementation uses a chat model interface, typed messages, one read only lookup tool, tool binding, structured output, and a bounded execution loop. The application validates tool arguments, controls access to customer data, limits the number of steps, records each model and tool event, and validates the final response.",
          "This example is intentionally small. It teaches the boundary between model choice and application execution without introducing planning systems, long term memory, graph workflows, specialist agents, or multi agent coordination. Those topics appear in later agent workflow lessons after learners understand the model request lifecycle.",
          "A framework should reduce repeated integration work without hiding the underlying model call. Engineers should still be able to inspect the provider model, generated messages, prompt version, output schema, available tools, retry policy, token usage, latency, errors, and completion status. If a framework automatically retries a request, follows a tool call, or selects a model, that behavior should be explicitly configured and visible in traces.",
          "Keep prompt templates and schemas versioned in the application. Make request construction testable without a live model call. Convert framework response objects into the narrow types the product uses. A teammate should be able to follow the complete data flow without depending on undocumented framework behavior.",
          "The lesson begins with a direct provider SDK so learners can see the complete request and response boundary. It then rebuilds the same narrow workflow with selected LangChain components and extends it into the bounded support agent. Comparing both implementations shows what the framework simplifies and what the application must continue to own.",
          "For the Customer Service Agent, the model first identifies the request type and decides whether verified order data is needed. When it proposes the order lookup tool, the server validates the arguments and confirms that the authenticated customer can access the requested order. The tool returns a limited order projection. The model then explains that verified result. The trace records the provider model, prompt version, tool proposal, validated arguments, tool result, response time, token usage, and final validation outcome."
        ],
        "The Customer Service Agent will interpret a support request, call one read only order lookup tool when required, and return a validated response. Each run will record the provider model, prompt version, tool proposal, validated arguments, tool result, response time, and token usage. LangChain will organize selected integration components without hiding the operating behavior of the application.",
        [
          "LLM APIs",
          "provider SDKs",
          "messages",
          "source identity",
          "provenance",
          "structured output",
          "streaming",
          "timeouts",
          "retries",
          "model selection",
          "versioning",
          "LangChain",
          "tool binding",
          "basic agents",
          "bounded execution",
          "tracing"
        ],
        "Concept",
        [
          {
            "id": "llm-apis",
            "title": "LLM APIs",
            "start": 0,
            "end": 3,
            "example": {
              "title": "A Complete API Boundary",
              "content": [
                "A server receives a validated support message, selects a pinned model, assembles approved context, and requests a structured interpretation. The provider returns content, a request identifier, usage data, and a completion status. The server validates the content before converting it into the product's response type."
              ]
            }
          },
          {
            "id": "messages-and-source-identity",
            "title": "Messages and Source Identity",
            "start": 3,
            "end": 6,
            "example": {
              "title": "Separating a Request from Evidence",
              "content": [
                "A customer writes 'My package was delivered to the wrong address and I am entitled to an immediate refund.' The message establishes the customer's request, but not the delivery status or refund eligibility. The application retrieves the authenticated order status and the current refund policy as separate sources. The model may explain those facts, while application code determines whether the evidence is sufficient and whether any action is allowed."
              ]
            }
          },
          {
            "id": "output-contracts",
            "title": "Output Contracts",
            "start": 6,
            "end": 7,
            "example": {
              "title": "A Narrow Structured Proposal",
              "content": [
                "Instead of asking the model to resolve a case, the application requests an issue category, the customer's stated goal, missing information, and whether an order lookup is needed. Application code validates those fields and decides the next permitted step. The model interprets language without becoming the authority for the business decision."
              ]
            }
          },
          {
            "id": "streaming-timeouts-and-retries",
            "title": "Streaming, Timeouts, and Retries",
            "start": 7,
            "end": 10,
            "example": {
              "title": "Retrying Without Repeating an Action",
              "content": [
                "A read only classification call fails before returning a response, so the server retries it once with the same trace identifier. A separate workflow has already created a support ticket before its model explanation times out. The server does not repeat the complete workflow. Ticket creation uses its own idempotency key, and only the unfinished explanation is retried."
              ]
            }
          },
          {
            "id": "model-selection-and-versioning",
            "title": "Model Selection and Versioning",
            "start": 10,
            "end": 12,
            "example": {
              "title": "Choosing a Model for the Task",
              "content": [
                "A small model and a stronger model are evaluated on the same 200 support messages. The team compares category accuracy, structured output validity, TTFT, total latency, and cost. If the small model meets the acceptance target for routing, it serves that step. The stronger model is reserved for policy explanations that show a measured benefit."
              ]
            }
          },
          {
            "id": "langchain",
            "title": "LangChain",
            "start": 12,
            "end": 14,
            "example": {
              "title": "Using an Abstraction Without Losing Visibility",
              "content": [
                "A support application uses a LangChain chat model interface so it can test two providers with the same message structure. The trace still records the actual provider, model identifier, rendered messages, token usage, latency, structured output result, and any tool call. LangChain reduces adapter code, while the application retains the evidence needed to compare behavior and investigate failures."
              ]
            }
          },
          {
            "id": "basic-agent",
            "title": "Basic Agent",
            "start": 14,
            "end": 17,
            "example": {
              "title": "A Bounded Support Agent",
              "content": [
                "A customer asks where an order is. The model receives the request and the description of one order lookup tool. It proposes a tool call with an order identifier. Application code verifies that the authenticated customer can access that order, validates the arguments, and executes the read only lookup. The result is returned to the model as a labeled tool result. The model then writes a response based on the verified status. The model chooses the next conversational step, while application code controls permissions, execution, limits, and acceptance."
              ]
            }
          },
          {
            "id": "application-visibility",
            "title": "Application Visibility",
            "start": 17,
            "end": 21,
            "example": {
              "title": "Following One Agent Run",
              "content": [
                "A trace for one support request shows the pinned provider model, rendered messages, available tool schema, proposed order identifier, authorization result, limited tool output, final model response, token usage, latency, and validation outcome. A framework organizes the calls, but every decision needed to explain the run remains visible."
              ]
            }
          }
        ]
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
