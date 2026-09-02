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
  example?: string;
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
  example: string | undefined,
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
    time: "12 hours",
    hours: 12,
    summary: "Understand how large language models generate responses, use context, and fit into an application.",
    prerequisite: "Comfort with a programming language, HTTP APIs, JSON, and basic backend development.",
    outcome: "You can describe the role of an LLM in an application and make informed decisions about models, context, and generated output.",
    accent: "blue",
    lessons: [
      lesson(
        "what-is-a-large-language-model",
        "What Is a Large Language Model?",
        "1.5 hours",
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
        "The customer writes, ‘Where is my refund?’ The tokenizer converts the message into token IDs. The LLM processes those tokens and generates a structured interpretation one token at a time, identifying the request as a refund status question and noting that an order number may be needed. This output reflects learned language patterns and the context supplied to the model. It does not reveal the actual refund status. The application must retrieve the authenticated refund record before the model can explain the verified result.",
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
              "A large language model, or LLM, is a neural network trained to estimate a probability distribution over sequences of tokens. Given the tokens that already appear in a sequence, it calculates which tokens are plausible next steps. During generation, one token is selected, added to the sequence, and used to calculate the following distribution. Repeating this process produces a complete response.",
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
        "1.5 hours",
        "Understand how transformers represent tokens, preserve their order, use attention, and scale model capacity for language generation.",
        [
          "A transformer is a neural network architecture built from a stack of similar layers called transformer blocks. Each transformer block centers on two main operations called self attention and a feed forward network. Self attention is a type of attention that lets each token weigh and combine relevant information from other permitted tokens in the same sequence. The feed forward network then processes each token separately and changes which learned features are emphasized. For example, after self attention connects ‘charge’ with ‘credit card,’ the feed forward network can strengthen features associated with a payment issue rather than charging a device. Repeating these operations across many blocks allows the model to develop a more useful understanding of the sequence. The known input positions can also be processed together during training, which makes transformers more efficient to train than earlier sequence models.",
          "Before transformers, recurrent neural networks commonly processed language one token at a time. Each step combined the current token with a hidden state carried from earlier steps. Information from the beginning of a long sequence had to pass through every intermediate step before influencing a later token. Gated architectures improved this process, but the sequential dependency still limited training parallelism and made distant relationships difficult to preserve.",
          "A token embedding is a learned vector that converts a token ID into a numerical representation the network can process. The initial embedding represents the token before its current context has been incorporated. The token ‘charge’ begins from the same learned embedding whether a request concerns a credit card charge or charging a device. Transformer layers update that representation using surrounding tokens so that its meaning becomes specific to the current sequence.",
          "Positional information is numerical information that represents where each token appears in a sequence. Without it, self attention can compare token content but cannot distinguish ‘refund after delivery’ from ‘delivery after refund’ using order alone. The model combines position with each token representation so the same token can be treated differently when it appears in a different place. Models may use learned position vectors or rotation based methods such as RoPE. The implementation varies, but each method gives the network both token identity and sequence order.",
          "Self attention is the operation that lets each token representation incorporate information from other permitted tokens in the same sequence. For every token, the model creates three learned projections called a query, a key, and a value. The query is compared with keys to determine which positions are relevant. The corresponding values provide the information used to update the token representation.",
          "Masked self attention is self attention with a causal mask applied. Each token can use information from tokens that appear before it, but it cannot inspect tokens that appear later in the sequence. This allows the model to learn next token prediction without seeing the answer in advance.",
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
        "The customer writes, ‘The replacement arrived damaged.’ Token embeddings represent each token, positional information preserves their order, and attention connects ‘damaged’ with ‘replacement.’ Transformer blocks refine these representations, and the decoder generates an issue summary one token at a time. This processing helps the model interpret the request, but it does not verify the order or determine refund eligibility.",
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
            end: 8,
            example: {
              title: "Connecting damaged to replacement",
              content: [
                "In ‘The replacement arrived damaged’, one attention head may assign a larger weight from ‘damaged’ to ‘replacement’ than to unrelated positions. That contribution helps connect the condition to the correct item. It does not prove that the replacement is eligible for a refund."
              ]
            }
          },
          { id: "transformer-blocks", title: "Transformer Blocks", start: 8, end: 10 },
          {
            id: "mixture-of-experts",
            title: "Mixture of Experts",
            start: 10,
            end: 14,
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
            start: 14,
            end: 16,
            example: {
              title: "Predicting the hidden token",
              content: [
                "For ‘The refund was approved’, the position processing ‘was’ may use ‘The refund’ but cannot inspect ‘approved’ when learning to predict it. The causal mask blocks that future token even though the complete training sentence is available."
              ]
            }
          },
          { id: "attention-and-evidence", title: "Attention and Interpretability", start: 16, end: 17 },
          {
            id: "context-as-input",
            title: "Context as Model Input",
            start: 17,
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
          "The model available through an API usually comes from a model development pipeline rather than one training run. A common order begins with pretraining and continues through post training stages such as instruction tuning, preference optimization, and specialized training for reasoning, safety, structured output, or tool use. Teams evaluate the model between stages and again before deployment. The exact pipeline varies, and a stage may be repeated when evaluation reveals a weakness. Pretraining develops general capability, which means a reusable ability to work with many kinds of language and code tasks rather than one narrow product workflow. Post training shapes that broad capability into more useful assistant behavior. Application engineers do not need to reproduce these training runs, but they need to understand what each stage can change and what must still be handled by application code.",
          "Pretraining is the large scale training stage in which a model learns from extensive collections of text, code, and other permitted data. The training objective is usually next token prediction. The model receives a sequence, predicts the next token, compares that prediction with the actual token, and adjusts its parameters through gradient based optimization. Over many examples, it learns patterns involving grammar, programming languages, factual associations, document structures, writing styles, and common problem solving approaches.",
          "Training data strongly affects the resulting model. Data quality, diversity, recency, language coverage, code coverage, duplication, and incorrect material all influence later behavior. Large training pipelines therefore include collection, filtering, deduplication, formatting, and quality assessment. These processes improve the dataset, but they do not turn it into a complete or perfectly current source of knowledge.",
          "A base model is the model produced by pretraining before it has been extensively shaped to behave as an assistant. It can continue text, complete code, imitate document structures, and reproduce many patterns learned during training. It does not automatically treat a user request as an instruction that must be answered directly. Its original objective was to predict likely continuations rather than to become a cooperative product interface.",
          "Generalization is the ability to apply learned patterns to inputs that were not reproduced verbatim during training. A model does not need to have seen every possible customer message. It can learn that phrases such as ‘the package was broken,’ ‘my delivery arrived damaged,’ and ‘the item is unusable’ describe related situations. This capability allows one model to work with the variety of language found in real applications.",
          "Generalization is not the same as access to current evidence. A model may recognize that a message concerns a damaged delivery while still lacking the customer’s order details, the current refund policy, or a recent policy exception. Rare domains, changing rules, unusual identifiers, and exact transactional facts require runtime evidence from retrieval or tools.",
          "Training compute is commonly measured in accelerator hours. One accelerator running for one hour equals one accelerator hour. A training run using 1,024 accelerators for 30 days consumes 737,280 accelerator hours. This measure makes the scale visible, but it does not describe the speed of the hardware, how efficiently it was used, or how much useful training the system completed.",
          "The direct compute cost depends on the accelerator type, the number of accelerators, the duration of the run, system utilization, and the cost assigned to each accelerator hour. Training also requires high speed networking, storage for data and checkpoints, power, cooling, data processing, monitoring, and engineers who operate the system. A slow or unstable training system can therefore cost more even when the model and dataset remain unchanged.",
          "Published model reports illustrate this scale. Meta reports 39.3 million cumulative H100 80 GB GPU hours for the Llama 3.1 model family. The DeepSeek V3 technical report records 2.788 million H800 GPU hours for its complete training and estimates a cost of 5.576 million dollars using an assumed rate of two dollars per GPU hour. These figures are not a direct price comparison. They cover different hardware, architectures, model families, training data, training stages, and accounting boundaries.",
          "A reported final training run is not the full cost of developing a model. It may exclude earlier experiments, failed runs, ablation studies, data collection, data cleaning, evaluation, staff, and the capital cost of owning the infrastructure. Reproducing a model can therefore cost substantially more than multiplying one published GPU hour figure by a rental rate.",
          "For most application teams, training a foundation model is unnecessary. Engineers should first measure whether prompting, retrieval, tools, structured output, or a focused fine tuning job can solve the task. Foundation model training becomes reasonable only when an organization has a strong data or research advantage, substantial compute infrastructure, and requirements that existing models cannot meet.",
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
        "A customer writes, ‘My replacement arrived damaged.’ A base model may continue the text as though it were part of a document or support transcript. After instruction tuning, the model is more likely to respond as an assistant and ask for the missing order number. Preference optimization can teach it to favor a helpful response that avoids promising a refund without evidence. Specialized tool use training can teach it to produce a structured order lookup request. These stages improve the model’s behavior, but they do not give it access to the customer’s order or authority to approve a refund.",
        ["large language model training", "pretraining", "training data", "base model", "generalization", "training compute", "accelerator hours", "training cost", "supervised fine tuning", "preference optimization", "RLHF", "reward model", "PPO", "DPO", "reasoning models", "application fine tuning", "model evaluation", "benchmarks"],
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
                "A base model given ‘Write a response to a customer requesting a refund’ may continue the pattern by writing an instruction to ask for the order number instead of producing the response. If the prompt resembles a conversation, it may generate lines for both the agent and the customer as though extending a transcript. An assistant model is more likely to write the customer facing reply directly because post training has taught it the expected interaction.",
                "The messages ‘my parcel is cracked’, ‘the product arrived broken’, and ‘the item was damaged during delivery’ use different wording. A model can classify all three as damaged item requests through generalization. It still needs verified order data and the current policy before any refund decision can be made."
              ]
            }
          },
          {
            id: "training-compute-and-cost",
            title: "Training Compute and Cost",
            start: 7,
            end: 12,
            example: {
              title: "Counting accelerator hours",
              content: [
                "A training run that uses 1,024 accelerators continuously for 30 days consumes 737,280 accelerator hours. Multiplying that number by an hourly rate estimates only the compute portion of the run. A complete budget must also account for data preparation, storage, networking, power, experiments, evaluation, infrastructure, and the people operating the training system."
              ]
            }
          },
          {
            id: "supervised-fine-tuning",
            title: "Supervised Fine Tuning",
            start: 12,
            end: 15,
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
            start: 15,
            end: 21,
            example: {
              title: "RLHF, PPO, and DPO",
              content: [
                "Reviewers compare two responses to a damaged item request using a policy rubric. One promises an immediate refund without checking eligibility. The other explains that the order and policy conditions must be verified first. Reviewers prefer the second response. A reward model can learn to score responses with those qualities, and PPO can update the language model toward similar behavior.",
                "DPO can learn from the same preferred and rejected pair by increasing the relative probability of the preferred response without first training a separate reward model. Both approaches still depend on the quality of the examples and the evaluation rubric."
              ]
            }
          },
          { id: "specialized-post-training", title: "Specialized Post Training", start: 21, end: 24 },
          {
            id: "fine-tuning-decisions",
            title: "Fine Tuning Decisions",
            start: 24,
            end: 27,
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
            start: 27,
            end: 31,
            example: {
              title: "Comparing models for customer support",
              content: [
                "Two candidate models receive the same customer messages, system instructions, policy passages, tool definitions, and output schema. The evaluation measures intent classification, use of policy evidence, missing information detection, invalid tool proposals, latency, and cost. The stronger choice is the model that meets the product requirements across representative cases, not necessarily the model with the highest general benchmark score."
              ]
            }
          },
          { id: "application-responsibility", title: "Application Responsibility", start: 31 }
        ]
      ),
      lesson(
        "inference-tokens-context-and-latency",
        "LLM Inference, Tokens, Context Windows, and Latency",
        "1 hour",
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
          "LLM inference is an observable runtime process, but a hosted API exposes only part of that process to the application. Engineers can record the request identifier, model identifier, configured input and output budgets, streaming events, token usage, completion status, errors, time to first token, and total model latency. Internal details such as accelerator memory allocation, provider scheduling, and the exact KV cache implementation usually remain inside the provider. In the next lesson, learners make the application visible boundary concrete through direct API requests, streaming, structured output, and LangChain model operations."
        ],
        "A customer asks, ‘Where is my refund?’ The application retrieves the verified refund record in 180 milliseconds, then sends the task instructions, the customer’s message, and the retrieved result to the model. The request uses 850 input tokens. The first output token arrives 420 milliseconds after the model request begins, and the complete 70 token response finishes after 1.6 seconds. Recording retrieval time, input and output tokens, time to first token, and total response time helps the team determine whether a delay came from data retrieval, prompt processing, or token generation.",
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
          "cost",
          "application visible metrics",
          "provider internal details"
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
        "LLM APIs, Provider SDKs, and LangChain",
        "3 hours",
        "Learn how application code connects to hosted and local models. You will examine how agents differ from deterministic workflows, then build the same Support Request Analyzer with the OpenAI SDK, LangChain, and Ollama running qwen3:14b before building an agent in the next lesson.",
        [
          "An LLM API is a network interface for sending input to a hosted language model and receiving generated output. The request identifies a model and supplies instructions, task input, configuration, and optional output schemas or tool definitions. The provider runs the model and returns content with operational metadata. The application must decide whether that result is complete, valid, and suitable for its workflow.",
          "The API boundary divides responsibilities. The provider owns model hosting, inference scheduling, accelerator memory, internal caches, and model execution. The application owns authentication, approved context, permissions, request construction, output validation, business rules, and side effects. A provider response can propose or explain an outcome, but it does not bypass those application controls.",
          "A model call follows a familiar service lifecycle. The server authenticates the caller, validates the incoming request, assembles permitted context, calls the provider, receives the result, validates it, and returns an application response. Network failures, timeouts, rate limits, invalid output, and changing model behavior must be handled like failures from any other external dependency.",
          "A provider SDK is an official language library that represents the provider's HTTP API as familiar program objects and methods. This lesson uses the OpenAI Python SDK as its concrete example. Learners use the Responses API directly before adding LangChain, so the model identifier, input, output configuration, streaming events, request metadata, usage, and errors remain visible.",
          "The SDK does not remove the API boundary. It builds the network request, authenticates it, parses the response, and converts provider errors into language specific exceptions. Engineers should still understand which values are sent, which defaults the SDK applies, how long the call may wait, and which metadata is returned.",
          "A request begins with a narrow task. The Support Request Analyzer receives a customer message and returns the issue type, any order identifier found in the message, whether verified order data is required, and which required detail is missing. It does not retrieve an order, determine eligibility, or perform an action. Those responsibilities belong to later application steps.",
          "Request content should preserve the identity of each source. An application instruction defines the task and its limits. A user input contains the customer message. Retrieved records and tool results are separate evidence when they are introduced. A customer can state that an order was delivered, but only an authenticated order record can establish the current delivery status.",
          "The request also includes operating controls. The application selects a model, sets an output budget, chooses whether to stream, and supplies a structured output schema when the result is intended for code. These values should be configured deliberately and recorded with a prompt version. Provider defaults can change and are difficult to investigate when the application never records what it relied on.",
          "A provider response contains more than visible text. Depending on the interface, it can include a response identifier, provider request identifier, model information, token usage, completion status, output items, and error details. The exact fields vary by provider and API version. Convert the response into the narrow application type needed by the feature instead of passing a large provider object through the product.",
          "Request identifiers are important diagnostic evidence. An application trace identifier connects all work performed for one product request. A provider request identifier identifies one external model call. Record both because one application request may contain more than one model call, and a provider support investigation may require its identifier rather than the application's identifier.",
          "Structured output asks the model to produce data that follows a defined schema. The Support Request Analyzer uses a typed result rather than asking code to parse free form prose. The schema constrains field names, value types, and allowed categories. The application validates the returned object before accepting it. In this schema, order_id is a required key with a nullable value. Every result includes the key. When the customer provides no order number, the value is null. This produces a stable response shape while still representing missing information.",
          "Schema validity is not factual validity. A model can return a perfectly valid order identifier that does not exist or does not belong to the authenticated customer. A schema definition can also be wrong. An overly strict rule can reject a valid result, while a loose rule can accept an unusable one. Test the contract with present, absent, malformed, and unexpected values. Application code must still verify identifiers, permissions, and business facts against trusted systems.",
          "Streaming lets the application receive output events before generation finishes. It is useful for a customer explanation that may take several seconds. The first usable text event provides a practical time to first token measurement, while the final event supplies completion data and often the complete usage record. Partial text should not be treated as a finished or validated result.",
          "A streaming client must handle interruption and cancellation. If the user leaves the page or starts a new request, the application should stop forwarding old output and cancel upstream work when the interface supports it. Cancellation can reduce unnecessary work, but it does not guarantee that the provider stopped before recording usage.",
          "Timeouts define how long the application will wait for a model call. Connect, read, and complete request timeouts may fail at different stages. A clear timeout policy prevents one slow dependency from consuming an application worker indefinitely and gives the user a controlled failure path.",
          "Retries should be limited to failures that may succeed on a later attempt. A short provider outage or rate limit may justify a delayed retry. Invalid structured output usually requires a different repair path, not repeated identical calls. Every retry adds latency and cost, and a model call connected to a side effect needs idempotency controls before any part of the workflow is repeated.",
          "Useful measurements begin before the call is dispatched and finish after the result is validated. Record the provider and model identifier, prompt version, configured output budget, input and output token usage, cache usage when exposed, time to first token for streaming, total model latency, retry configuration and attempt count when exposed, completion status, error category, and output validation result. End to end latency should also include authentication, retrieval, tool execution, and application processing when those stages exist.",
          "The direct SDK exercise makes these measurements visible around a small Support Request Analyzer. Given 'Where is order 10492? It was supposed to arrive yesterday,' the model returns that the issue concerns order status, identifies 10492, marks that verified order data is required, and reports that no required detail is missing. The trace records the call without pretending that the model knows the actual order status.",
          "LangChain is an application framework that provides common interfaces for models, messages, structured output, tools, retrieval, and workflows. It does not make a model more capable and it does not replace the provider. A LangChain provider integration still reaches an underlying model API and still depends on provider authentication, availability, limits, and pricing.",
          "A LangChain chat model represents a configured model integration. In this lesson, ChatOpenAI connects LangChain model operations to an OpenAI model. The chat model accepts an ordered list of messages and returns a model response. Each message type records the role that a piece of content plays in that exchange.",
          "SystemMessage represents instructions supplied by the application for the model to follow during a request. It commonly describes the task, boundaries, response style, and expected behavior. For the Support Request Analyzer, it tells the model to classify the issue, extract a five digit order identifier when present, and avoid inventing customer details. A system message guides model behavior, but application code must still enforce permissions and business rules.",
          "HumanMessage represents content sent in the user role. The content often comes from a person, but the class name does not prove that a human wrote it or that the content is trustworthy. In this lesson, the customer request becomes a HumanMessage. The application treats it as input to interpret rather than evidence that an order exists or belongs to the customer.",
          "AIMessage represents output returned by the model. It may contain generated text, structured content, response metadata, usage metadata, or proposals to call tools. An AIMessage records what the model produced. It does not prove that the content is factually correct, and a proposed tool call inside it has not been executed.",
          "ToolMessage represents the result of a tool execution that application code sends back to the model. It is associated with the tool call identifier from the earlier AIMessage so the model can connect a result to the request that produced it. In the next lesson, the application executes an approved order lookup and places its limited result in a ToolMessage before asking the model for a final response.",
          "The message sequence preserves the source and purpose of each contribution. A SystemMessage contains application instructions, a HumanMessage contains request input, an AIMessage contains model output, and a ToolMessage contains an application supplied tool result. These roles help assemble and inspect a model interaction, but they do not replace validation, authorization, or decisions about whether the underlying content can be trusted.",
          "The invoke operation sends one complete request and waits for one complete result. It is appropriate for the structured Support Request Analyzer because the application must validate the whole object before using it. The stream operation yields incremental model events or chunks and is appropriate when the interface should show an explanation while it is generated.",
          "The with_structured_output operation binds a schema to a chat model and returns a typed result supported by the selected integration. The bind_tools operation supplies tool definitions that a model may choose to call. Binding a tool does not execute it. Application code receives the proposal and remains responsible for argument validation, authorization, execution, and step limits.",
          "LangChain response objects can expose content, tool calls, response metadata, and usage metadata. The exact metadata depends on the provider integration. The application should extract the fields it needs into its own trace rather than assuming that every provider returns identical details.",
          "Ollama runs supported models through a local service on the learner's computer. Instead of sending a request to a hosted provider, application code sends it to the local Ollama endpoint. The model still has input and output limits, can produce invalid output, and needs the same validation and application controls as a hosted model.",
          "This lab uses qwen3:14b as the local example. The Ollama download is approximately 9.3 GB, and the memory and response time required at runtime depend on the computer and its available hardware. The local path is optional. If qwen3:14b does not run comfortably on a learner's machine, they should continue with the OpenAI exercises rather than treating the local route as a requirement.",
          "The Ollama analyzer uses the native Python client and the same SupportRequest Pydantic schema. It explicitly asks the model to return only JSON, validates the returned JSON with Pydantic, then streams a short explanation in a second local model call. This keeps the local implementation comparable to the hosted examples without depending on a model specific schema runtime.",
          "A local model does not require an OpenAI API key, but local does not automatically mean safe or private in every respect. The application still decides which customer data it sends to the model, what it stores in logs, and which tools it may use. The Ollama runtime returns local token counts and completion details, but it does not provide a hosted provider request identifier.",
          "The same Support Request Analyzer is implemented three times. The direct SDK version exposes OpenAI specific request and response objects. The LangChain version uses ChatOpenAI, message objects, invoke, stream, and with_structured_output. The Ollama version uses a local client and the native structured output format. All three use the same task and Pydantic contract, which makes the comparison meaningful.",
          "A direct provider SDK is often the simplest choice for one hosted provider and a small number of calls. LangChain becomes useful when consistent model operations, message types, schemas, tool definitions, or multiple integrations reduce repeated application code. Ollama is useful when local execution is a deliberate product or development choice. In every case, keep the model identifier, rendered input, output schema, token usage, latency, errors, and retry behavior visible to the engineer operating the feature.",
          "This lesson teaches only the LangChain components needed for model calls and the basic agent in the next lesson. Prompt composition appears when prompts and context are designed in the next phase. The RAG phase introduces Documents, document loaders, text splitters, embedding integrations, vector stores, and retrievers. The agent workflow phase introduces LangGraph, state, nodes, transitions, checkpoints, and human review when those concepts become relevant.",
          "An AI agent is a software system that uses a model to pursue a goal and complete work on behalf of a user or another system. Instead of producing one response and ending, an agent can examine its current state, choose from permitted actions, observe the result, and continue until it reaches a defined completion or stopping condition.",
          "Agency exists on a spectrum. A simple agent may choose whether to answer, ask for missing information, or propose one tool call. A more capable agent may create a plan, use several tools, revise the plan after observing results, and coordinate with another agent. Greater autonomy does not mean unrestricted control. The surrounding application still defines what the agent can access and what it is allowed to do.",
          "Reasoning and planning help an agent interpret a goal, compare possible actions, and decide what information or operation is needed next. These capabilities come from model inference and should not be treated as proof that the chosen plan is correct. Important decisions still require evidence, validation, and evaluation.",
          "Acting lets an agent affect an external environment through approved tools. Observing means receiving the result of an action and using it in the next decision. State records what has happened during the run, while memory can preserve selected information across a longer interaction or across runs. Collaboration allows several agents or humans to contribute to the same goal. Not every agent needs planning, long term memory, collaboration, or multiple tools.",
          "An agent begins with a goal, instructions, current context, available state, and descriptions of the actions it may request. The model evaluates that information and returns either a response or a proposed action. Application code validates the proposal, checks permissions, executes approved work, and returns an observation to the agent.",
          "The cycle of deciding, acting, and observing may repeat as the state changes. The run ends when the goal is complete, the agent needs human input, a policy blocks further work, an error occurs, or an execution limit is reached. The model proposes decisions inside the loop, but the application owns the loop and the stopping conditions.",
          "A deterministic workflow has steps and branches selected by engineers before the program runs. Given the same input and state, it follows the same defined path. An agentic workflow allows the model to select among permitted next steps at runtime because the correct path may depend on natural language, available evidence, or the result of an earlier action.",
          "Most production agents are hybrid systems. The model interprets language, plans, and selects among bounded actions. Deterministic code handles authentication, authorization, argument validation, calculations, business rules, database writes, side effects, retries, and execution limits. Giving a model access to a tool does not remove these application responsibilities.",
          "Use an agent when a task has several possible paths and the appropriate next step depends on unstructured language, changing evidence, or results discovered during execution. A customer support request may require a clarifying question, a knowledge search, an order lookup, or escalation depending on what the customer asks and what earlier steps reveal.",
          "Do not create an agent merely because an LLM is present. Classification, extraction, summarization, fixed API sequences, deterministic calculations, and approval rules often need only one model call or an ordinary workflow. Agents add model calls, latency, cost, state, testing requirements, and additional failure paths. Start with deterministic code and add model selected decisions only where the added flexibility produces measurable value.",
          "This lab introduces a small Customer Service Agent now because it connects the fundamentals to a complete application and makes the learning process more engaging. Learners can see how model output, structured data, a tool, permissions, latency, and validation work together instead of waiting until the later agent workflow phase.",
          "The first agent has one goal, one read only order lookup, no long term memory, and strict execution limits. It can ask for a missing order identifier, propose one lookup, and explain verified status. The next lesson implements the complete loop before later phases introduce retrieval, durable state, LangGraph, human review, and specialist agents.",
          "The earlier snippets were provided for observation. This final section is where you set up the project, inspect the complete files, run the model calls, and compare the direct provider SDK with LangChain. Follow the steps in order so each result has a clear purpose.",
          "Step 01. Install the required tools for your operating system. Confirm that Git is available first, then use the official standalone uv installer for macOS or Windows. Reopen the terminal if the uv command is not immediately available. After installing uv, use it to install Python 3.12. Python 3.12 is the recommended version for this lab. The project supports Python 3.11 or newer, but all instructions and examples are tested with Python 3.12. Using the recommended version helps avoid dependency and environment differences.",
          "Step 02. Clone the Agentic AI Lab repository from GitHub and enter the repository directory. If Git reports an authentication request, confirm that you used the public HTTPS address shown in the command. No GitHub account or access token is required to clone the public repository.",
          "Step 03. Enter the Support Request Analyzer lab directory, create a local .env file from the supplied example, and install the locked dependencies with Python 3.12. The command for copying a file differs between macOS Terminal and Windows PowerShell. uv creates the virtual environment and installs the OpenAI SDK, LangChain, Pydantic, and python dotenv. You do not need to activate the environment because uv run uses it automatically.",
          "Step 04. Choose the hosted or local route in the new .env file. The OpenAI SDK and LangChain examples require an OpenAI API key. The local Ollama example requires no API key and uses qwen3:14b by default. The sample customer message can also be changed in this file. Never commit the .env file or place an API key inside Python source code. OpenAI requests are paid. Local inference uses the learner's computer instead.",
          "Step 05. Read shared.py before calling a model. Start with SupportRequest because it defines the structured result accepted by the application. Then inspect ModelCallMetrics, RunTrace, openai_usage, and langchain_usage to understand which operational fields the examples record.",
          "Step 06. Read provider_sdk.py from top to bottom. Begin with ANALYZER_INSTRUCTIONS and the output budgets. Then inspect analyze_request to see the direct structured model call, stream_explanation to see streamed text and time to first token, and main to see configuration, execution order, error handling, and final trace output.",
          "Step 07. Run the provider SDK example without changing the code. The program should print a structured SupportRequest, stream a short explanation, and finish with run metadata. Confirm that the structured result identifies the issue and order identifier without claiming that an order lookup occurred.",
          "Step 08. Inspect the run metadata after the request completes. Find the model name, prompt version, provider request identifier when available, input and output token usage, time to first token for the streamed call, total model latency, validation result, and final completion reason. These fields connect the API concepts to observable application behavior.",
          "Step 09. Change only CUSTOMER_MESSAGE in .env and run the provider example again. First remove the order identifier and confirm that missing information is reported. Then try the damaged item request 'Order 10492 arrived with a cracked screen. What should I do?' Compare the structured fields, streamed explanation, token usage, and latency across the runs.",
          "Step 10. Read langchain_analyzer.py after understanding the direct SDK version. Inspect ChatOpenAI in main, the SystemMessage and HumanMessage inputs, with_structured_output inside analyze_request, and model.stream inside stream_explanation. Then run the LangChain example with the same customer message.",
          "Step 11. Install Ollama from ollama.com/download for macOS or Windows, then pull qwen3:14b. Read ollama_analyzer.py before running it. Inspect the Client configuration, the SupportRequest JSON schema passed to format, Pydantic validation, local token counts, and the streamed explanation loop. The first download is approximately 9.3 GB.",
          "Step 12. Run the Ollama analyzer with the same customer message. If the request fails, confirm that the Ollama application is running, the model pull completed, and OLLAMA_HOST points to the local service. Unlike the OpenAI examples, this run does not use an API key or a hosted provider request identifier.",
          "Step 13. Compare the three implementations rather than choosing a preferred framework immediately. Verify that each produces the same SupportRequest contract. Identify which OpenAI details are most visible through the direct SDK, which repeated model operations LangChain standardizes, and which operational tradeoffs change when qwen3:14b runs locally.",
          "Stop after the comparison and write down what changed between the direct SDK, LangChain, and Ollama paths. Do not modify agent.py during this lesson. The next lesson uses that file to add the tool definition, authorization boundary, execution loop, and validated customer response.",
          "Run the Section 5 tests from the customer-service-agent folder after completing the analyzer exercises. These tests check the shared SupportRequest contract, including valid, missing, and malformed order identifiers. They also check the Ollama analyzer's JSON instructions and its handling of connection, model, and validation failures.",
          "The Section 5 tests use controlled objects instead of live model calls. They do not require OpenAI credits or a running Ollama model. Passing tests confirm the application contracts and failure handling, while running the three analyzer programs remains necessary to observe real model output, streaming, token usage, and latency."
        ],
        undefined,
        [
          "LLM APIs",
          "provider SDKs",
          "OpenAI Responses API",
          "request lifecycle",
          "response lifecycle",
          "messages",
          "source identity",
          "structured output",
          "streaming",
          "cancellation",
          "timeouts",
          "retries",
          "request identifiers",
          "latency measurement",
          "LangChain",
          "ChatOpenAI",
          "SystemMessage",
          "HumanMessage",
          "AIMessage",
          "ToolMessage",
          "invoke",
          "stream",
          "with_structured_output",
          "bind_tools",
          "response metadata",
          "usage metadata",
          "Ollama",
          "local models",
          "qwen3:14b",
          "local inference",
          "agents",
          "deterministic code",
          "agent decision boundaries",
          "agent capabilities",
          "agent execution loops",
          "agent state",
          "agent autonomy"
        ],
        "Concept",
        [
          {
            id: "api-boundary",
            title: "LLM API Boundary",
            start: 0,
            end: 3,
            example: {
              title: "One Application Request",
              content: [
                "A customer message reaches the application server. The server validates the request and sends an approved model input to the provider. The provider runs inference and returns generated output. The server validates that output before returning a product response. Model hosting stays inside the provider, while permissions and acceptance remain inside the application."
              ]
            }
          },
          {
            id: "what-is-an-ai-agent",
            title: "What Is an AI Agent",
            start: 35,
            end: 37,
            example: {
              title: "A Goal for Order Support",
              content: [
                "A customer wants the current status of an order. The agent has a defined goal and a limited set of choices. It can ask for the order identifier, propose an approved lookup, explain the verified result, or stop when it cannot continue safely."
              ]
            }
          },
          {
            id: "agent-capabilities",
            title: "Agent Capabilities",
            start: 37,
            end: 39,
            example: {
              title: "Using an Observation",
              content: [
                "An agent proposes an order lookup and observes that the shipment is delayed. That observation becomes part of the current state, allowing the next model call to explain the delay rather than repeating the original lookup."
              ]
            }
          },
          {
            id: "how-an-agent-works",
            title: "How an Agent Works",
            start: 39,
            end: 41,
            example: {
              title: "One Execution Cycle",
              content: [
                "The model proposes a lookup for order 10492. Application code validates the order identifier, confirms customer access, executes the lookup, and returns the limited result as an observation. The model then uses that observation to write the response."
              ]
            }
          },
          {
            id: "agents-and-deterministic-workflows",
            title: "Agents and Deterministic Workflows",
            start: 41,
            end: 43,
            example: {
              title: "Flexible Decisions with Fixed Controls",
              content: [
                "The model decides whether the customer must provide more information or whether an order lookup should be proposed. Deterministic application code controls authorization, executes the lookup, and prevents an unapproved action."
              ]
            }
          },
          {
            id: "when-to-use-an-agent",
            title: "When to Use an Agent",
            start: 43,
            end: 45,
            example: {
              title: "Agent or Ordinary Workflow",
              content: [
                "Routing an unfamiliar support request among a clarification, knowledge search, order lookup, and escalation may benefit from an agent. Calculating a shipping charge from verified weight and destination should remain deterministic application code."
              ]
            }
          },
          {
            id: "agent-in-this-lab",
            title: "The Agent in This Lab",
            start: 45,
            end: 47,
            example: {
              title: "A Bounded First Agent",
              content: [
                "The first agent has one goal, one read only tool, no long term memory, at most two model calls, and at most one tool call. These limits keep every decision and application control visible to the learner."
              ]
            }
          },
          {
            id: "provider-sdks",
            title: "Provider SDKs",
            start: 3,
            end: 6,
            example: {
              title: "The Support Request Analyzer",
              content: [
                "The OpenAI Python SDK sends a customer message to the Responses API and requests four fields. The result identifies the issue type, extracts an order identifier when present, reports whether order data is required, and lists a missing detail. The call interprets the request without claiming to know the order status."
              ]
            }
          },
          {
            id: "requests-and-responses",
            title: "Requests and Responses",
            start: 6,
            end: 10,
            example: {
              title: "Following the Call",
              content: [
                "The application trace records the approved instruction, customer input, model identifier, output budget, provider request identifier, token usage, completion status, and validation result. A teammate can follow what crossed the API boundary without inspecting provider infrastructure."
              ]
            }
          },
          {
            id: "structured-output",
            title: "Structured Output",
            start: 10,
            end: 12,
            example: {
              title: "Valid Shape and Verified Facts",
              content: [
                "When the customer supplies order number 10492, the model returns order_id as the five digit string 10492. When no order number is present, the result still contains order_id with a null value. The schema confirms the required shape in both cases. A later order lookup must still prove that a supplied order exists and belongs to the authenticated customer."
              ]
            }
          },
          {
            id: "streaming-and-cancellation",
            title: "Streaming and Cancellation",
            start: 12,
            end: 14,
            example: {
              title: "Streaming an Explanation",
              content: [
                "A customer explanation begins arriving after 420 milliseconds and finishes after 1.6 seconds. The interface displays suitable text as it arrives, but saves the answer only after the final event. If the customer starts another request, the application stops displaying the earlier stream and attempts to cancel it."
              ]
            }
          },
          {
            id: "timeouts-and-retries",
            title: "Timeouts and Retries",
            start: 14,
            end: 17,
            example: {
              title: "One Controlled Retry",
              content: [
                "A read only analysis call reaches a temporary rate limit. The application waits and retries once, then returns a controlled error if the second call fails. The trace records both attempts. No order action is repeated because this step only interprets text."
              ]
            }
          },
          {
            id: "measurement",
            title: "Measurement and Observability",
            start: 17,
            end: 18,
            example: {
              title: "What the Application Can Measure",
              content: [
                "One trace records the provider, model, prompt version, output budget, input and output tokens, first token time, total model latency, retries, completion status, and schema validation. It does not claim to know the provider's internal accelerator allocation or KV cache layout."
              ]
            }
          },
          {
            id: "langchain-model-integration",
            title: "LangChain Model Integration",
            start: 18,
            end: 20,
            example: {
              title: "A Configured Chat Model",
              content: [
                "ChatOpenAI stores the selected model and operating configuration, accepts an ordered message sequence, and sends the corresponding request through the OpenAI integration. LangChain provides the common model interface while the provider still performs inference."
              ]
            }
          },
          {
            id: "langchain-message-types",
            title: "LangChain Message Types",
            start: 20,
            end: 25,
            example: {
              title: "A Customer Service Message Sequence",
              content: [
                "A SystemMessage defines the order support task. A HumanMessage contains the customer's question. An AIMessage may propose an approved order lookup. After application code validates and executes that request, a ToolMessage returns the limited result to the model. A final AIMessage then explains the result to the customer."
              ]
            }
          },
          {
            id: "langchain-model-operations",
            title: "LangChain Model Operations",
            start: 25,
            end: 28,
            example: {
              title: "The Same Task Through LangChain",
              content: [
                "ChatOpenAI receives system and human messages. with_structured_output applies the analyzer schema, invoke returns the complete typed result, and stream yields an explanation incrementally. bind_tools is introduced as the way to make the order lookup definition available in the next lesson."
              ]
            }
          },
          {
            id: "local-models-with-ollama",
            title: "Local Models with Ollama",
            start: 28,
            end: 32,
            example: {
              title: "A Local Support Request Analyzer",
              content: [
                "Ollama runs qwen3:14b on the local computer. The analyzer supplies the same customer request and SupportRequest schema used by the hosted versions. The local model returns structured JSON, Pydantic validates it, and the application records local token counts and latency."
              ]
            }
          },
          {
            id: "sdk-langchain-and-ollama-comparison",
            title: "Provider SDK, LangChain, and Ollama",
            start: 32,
            end: 35,
            example: {
              title: "Choosing a Model Integration",
              content: [
                "A feature that uses one hosted provider and one call may remain clearer with the direct SDK. A product that shares message construction, schemas, and tools across several model calls may benefit from LangChain. A local Ollama model can be useful when local execution is a deliberate requirement. In every case, application code keeps operating behavior visible."
              ]
            }
          },
          {
            id: "build-support-request-analyzer",
            title: "Build a Support Request Analyzer",
            start: 47,
            end: 62,
            example: {
              title: "Completing the Comparison",
              content: [
                "After running all three paths with the same customer message, the learner should be able to locate the structured contract, identify each model call, explain the streaming path, read the trace, and describe how the direct SDK, LangChain, and local Ollama approaches differ without describing any implementation as an agent."
              ]
            }
          },
          {
            id: "testing-the-analyzer",
            title: "Testing the Analyzer",
            start: 62
          }
        ]
      ),
      lesson(
        "building-a-basic-agent-with-langchain",
        "Building an Agent with LangChain",
        "2 hours",
        "Build a customer service agent with LangChain and run it with either OpenAI or Ollama. The same agent loop controls tool calls, authorization, validation, execution limits, and tracing for both model providers.",
        [
          "The previous lesson defined an agent and explained when model selected actions are useful. This lesson does not repeat that theory. It implements the small Customer Service Agent introduced there and keeps each model decision visible in ordinary Python code.",
          "The implementation uses LangChain as the common model interface. The agent code works with ChatOpenAI for a hosted OpenAI model and ChatOllama for qwen3:14b running locally. It does not use the direct provider SDK because provider comparison was completed in the previous lesson.",
          "The application selects the provider through MODEL_PROVIDER. Use openai for the hosted route or ollama for the local route. The provider is not inferred from a model name because names can change and several providers may expose similar names. One small factory contains the provider specific configuration while the agent loop receives the same LangChain chat model interface. The qwen3:14b configuration disables its optional reasoning output so the small output budget is used for the required tool call and customer reply.",
          "The agent handles only order status questions. It can ask for a missing order identifier, propose one read only lookup, and explain one verified result. It cannot cancel an order, issue a refund, change an address, or search arbitrary customers.",
          "The run begins with a SystemMessage that defines the task and a HumanMessage containing the customer request. LangChain converts the LookupOrder Pydantic model into a tool schema and makes it available through bind_tools. The first model call may ask a question or propose the lookup tool.",
          "A model proposal is data, not execution. The application checks the tool name, validates the five digit order identifier, enforces the one tool call limit, and supplies the authenticated customer identifier from trusted request state. The model never chooses which customer is signed in.",
          "The local OrderStore represents an authenticated order service. It returns only status, expected delivery, and the latest update for an order belonging to the authenticated customer. Unknown and unauthorized orders receive the same limited result so the application does not reveal whether another customer's order exists.",
          "When the request does not contain an order identifier, the first model response asks for it. The application returns that clarification without calling a tool or making a second model request. This is the shortest valid path through the agent.",
          "When the model proposes LookupOrder, application code validates and authorizes the request before calling the store. A successful result is added as a ToolMessage linked to the model's tool call. This message gives the second model call verified evidence and preserves the role of the tool result.",
          "The second model call writes a CustomerReply containing the customer message, its information source, and whether order data was verified. The OpenAI route uses LangChain function calling. The Ollama route gives qwen3:14b an explicit JSON instruction because this model can return ordinary text instead of the requested CustomerReply tool call. Pydantic validates both results before the application accepts them.",
          "The run permits no more than two model calls and one tool call. These limits are constants in the code and are checked by the loop. Direct control flow is intentional because learners should be able to follow every branch before LangGraph introduces reusable graph execution later in the course.",
          "The same trace is used for both providers. It records the selected provider, model, prompt version, token usage when available, model latency, tool latency, validation, authorization, step counts, completion reason, and safe error categories. A hosted provider may return a request identifier while a local Ollama run usually does not.",
          "Failures produce controlled outcomes. Invalid tool arguments stop before execution. Unknown or unauthorized orders expose no order facts. Repeated tool proposals exceed the limit. A model or validation failure returns a safe response and records the reason rather than starting an unrestricted recovery loop.",
          "Tests use model doubles, which are predictable replacements for a live model. They cover the valid path, missing information, malformed arguments, repeated tool calls, unauthorized access, timeouts, and invalid final responses without requiring an API key or running Ollama.",
          "Run the Section 6 tests from the customer-service-agent folder before or after using a live provider. The test command runs tests/test_agent.py only. It does not call OpenAI or Ollama, so it is fast, repeatable, and free to run. A passing result confirms the agent's tool boundary, authorization rules, execution limits, fallback behavior, and trace outcomes.",
          "The runnable agent is in labs/01-llm-fundamentals/customer-service-agent. Its main implementation file is src/customer_service_lab/agent.py, and its configuration is stored in the local .env file inside the lab folder.",
          "Step 01. Open a terminal at the Agentic AI Lab repository root and enter the customer-service-agent folder. Run every remaining command in this section from that folder.",
          "Step 02. Install the locked Python dependencies with uv. Python 3.12 is the recommended version for this lab. The project supports Python 3.11 or newer, but all instructions and examples are tested with Python 3.12. Using the recommended version helps avoid dependency and environment differences. uv installs LangChain, the OpenAI and Ollama integrations, Pydantic, and the test tools inside the lab environment.",
          "Step 03. Read src/customer_service_lab/agent.py before running it. Start with create_agent_model, then read LookupOrder, OrderStore, run_agent, and main in that order. This shows configuration first, followed by the tool contract, trusted data access, the execution loop, and the program entry point.",
          "Step 04. Create .env from .env.example if the file does not already exist. To use OpenAI, set MODEL_PROVIDER to openai, provide OPENAI_API_KEY, and keep the selected OPENAI_MODEL. Never commit the .env file.",
          "Step 05. Run the agent through its Python module from the lab folder. Using the module command ensures Python loads the customer_service_lab package from the environment created by uv.",
          "Step 06. To use the local route, confirm that Ollama is running and qwen3:14b is installed. Change MODEL_PROVIDER to ollama and check OLLAMA_HOST and OLLAMA_MODEL. Run the same module command again. No agent code changes are required.",
          "Step 07. Compare the two runs. Read the customer response first, then inspect provider, model, model call count, tool call count, authorization result, validation result, latency, token usage when available, and stop reason in the run metadata."
        ],
        undefined,
        [
          "LangChain agents",
          "model providers",
          "ChatOpenAI",
          "ChatOllama",
          "tool binding",
          "tool proposals",
          "read only tools",
          "argument validation",
          "authorization",
          "bounded execution",
          "explicit agent loops",
          "ToolMessage",
          "application state",
          "step limits",
          "error handling",
          "agent tracing",
          "behavior testing"
        ],
        "Concept",
        [
          {
            id: "lesson-scope",
            title: "Lesson Scope",
            start: 0,
            end: 2,
            example: {
              title: "One Agent Implementation",
              content: [
                "The agent loop is implemented once with LangChain. OpenAI and Ollama provide different model runtimes, but neither provider changes which tools exist, who authorizes a lookup, or when the run must stop."
              ]
            }
          },
          {
            id: "model-configuration",
            title: "Model Configuration",
            start: 2,
            end: 3,
            example: {
              title: "Explicit Provider Selection",
              content: [
                "MODEL_PROVIDER selects openai or ollama. The factory creates ChatOpenAI or ChatOllama, then returns the same model interface to the agent loop."
              ]
            }
          },
          {
            id: "agent-boundary",
            title: "Agent Boundary",
            start: 3,
            end: 7,
            example: {
              title: "One Narrow Responsibility",
              content: [
                "The Customer Service Agent can ask for an order identifier, look up one authorized order status, or explain one verified result. A cancellation request remains outside its scope."
              ]
            }
          },
          {
            id: "first-model-call",
            title: "First Model Call",
            start: 7,
            end: 8,
            example: {
              title: "A Clarification Path",
              content: [
                "For 'Where is my order?' the first call asks for the missing identifier. No lookup or second model call is needed."
              ]
            }
          },
          {
            id: "tool-validation-and-authorization",
            title: "Tool Validation and Authorization",
            start: 8,
            end: 9,
            example: {
              title: "An Order Belonging to Another Customer",
              content: [
                "The model proposes order 10492, but the authenticated customer does not own it. Application code returns no order facts and does not confirm whether the order exists."
              ]
            }
          },
          {
            id: "second-model-call",
            title: "Second Model Call",
            start: 9,
            end: 10,
            example: {
              title: "A Validated Customer Reply",
              content: [
                "The model receives a limited order result through ToolMessage. It returns a CustomerReply, and Pydantic checks the response before it reaches the customer."
              ]
            }
          },
          {
            id: "execution-limits-and-tracing",
            title: "Execution Limits and Tracing",
            start: 10,
            end: 13,
            example: {
              title: "A Bounded Run",
              content: [
                "A completed order lookup uses two model calls and one tool call. The trace records which provider ran, what the application allowed, how long each stage took, and why execution stopped."
              ]
            }
          },
          {
            id: "testing",
            title: "Testing",
            start: 13,
            end: 15
          },
          {
            id: "run-the-agent",
            title: "Run the Agent",
            start: 15
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
