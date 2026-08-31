export type LessonFormat = "Concept" | "Capstone";

export type LessonSection = {
  id: string;
  title: string;
  content: string[];
};

export type LessonSectionOutline = {
  id: string;
  title: string;
  start: number;
  end?: number;
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
): Lesson => ({ slug, title, time, format, summary, content, sectionOutline, sections, example, concepts });

export function getLessonSections(item: Lesson): LessonSection[] {
  if (item.sections) {
    return item.sections;
  }

  if (item.sectionOutline) {
    return item.sectionOutline.map(({ id, title, start, end }) => ({
      id,
      title,
      content: item.content.slice(start, end)
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
        "Understand how an LLM generates language, what it can and cannot know, and where it belongs in a software system.",
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
        ["tokens", "next token prediction", "autoregressive generation", "runtime context", "grounding", "application boundaries"],
        "Concept",
        undefined,
        [
          {
            id: "the-working-model",
            title: "LLM Systems",
            content: [
              "Start with a concrete picture. An LLM is a trained neural network that receives text, produces a probability distribution for what could come next, and then repeatedly turns that distribution into more text. ChatGPT, Claude, Gemini, and a local model runner are products built around this core capability. A chat interface adds messages, account controls, file handling, tools, safety layers, and a user experience. The language model is an important component inside that product, but it is not the whole product.",
              "A helpful simplification is to imagine a model artifact as learned parameters plus software that knows how to run them. The parameters are a large collection of numbers obtained through training. The runtime loads those numbers, applies the model architecture, and returns a prediction. In a real deployment there are additional pieces such as a tokenizer, a model configuration, model versions, serving infrastructure, and access controls. The simplification is still useful because it separates the difficult part, learning the parameters, from the repeatable part, using them for inference.",
              "This distinction explains why a model can be expensive to create but comparatively convenient to call. Training may require a large curated dataset, specialized hardware, distributed systems, and many optimization steps. Inference uses the already learned parameters to handle a new request. An application engineer usually works on the inference side. You select a model, decide what context it receives, inspect the result, and connect it safely to the rest of the system. You do not need to train a frontier model to understand its operating model."
            ]
          },
          {
            id: "text-is-tokens",
            title: "Tokenization",
            content: [
              "People read words and sentences. A model reads token IDs. A token is a unit produced by a tokenizer, and it is not always a complete word. It can be a whole common word, part of a word, punctuation, whitespace, a number, or a fragment of code. The phrase ‘refund approved’ might become two tokens in one tokenizer and several in another. Before the model sees a prompt, the tokenizer converts text into a sequence of integer IDs. After generation, it converts the generated IDs back into text.",
              "Why not use whole words? A vocabulary made of complete words handles typos, names, product codes, new vocabulary, and languages that do not use spaces in the same way as English poorly. Why not use individual characters? Processing individual characters works in principle but creates very long sequences. Modern tokenizers typically use subword units, which balance a manageable vocabulary with a manageable sequence length. Byte Pair Encoding is one commonly used family of methods. It starts from small units and repeatedly merges frequently occurring pairs into larger units.",
              "Tokenization has practical consequences. It influences how much context fits in a request, how a provider meters usage, how quickly a model can process a prompt, and how well a model handles source code, numbers, or less common languages. It also means that a ‘word count’ is not a reliable engineering budget. When you build an application, use the tokenizer or usage fields associated with the model you actually call. The fourth lesson returns to tokens when we discuss cost, latency, and context limits."
            ]
          },
          {
            id: "a-probability-model",
            title: "Language Modeling",
            content: [
              "At a more precise level, a language model assigns probabilities to sequences of tokens. A well formed sentence such as ‘The customer received a damaged item’ is more likely under a good model of English and support conversations than a random sequence of the same tokens. The model is not checking a grammar rulebook or a database of every sentence. It has learned numerical patterns that make some continuations more likely than others in a given context.",
              "Autoregressive language models express this with the chain rule of probability. Instead of attempting to predict an entire sentence in one step, the model represents a sequence as a series of next token predictions. P(x_1, ..., x_n) = P(x_1) × P(x_2 | x_1) × ... × P(x_n | x_1, ..., x_{n-1}). There is no approximation in this decomposition. The engineering choice is to model each conditional distribution with a neural network and then generate one token after another.",
              "For a prompt ending with ‘The customer wants a’, the model may assign higher probability to ‘refund’, ‘replacement’, or ‘manager’ than to unrelated tokens. Those values form a probability distribution. The probabilities add to one across the vocabulary, but the distribution is not a statement of truth. It represents the model’s learned expectation of plausible continuation given its current input. A fluent answer is therefore evidence that a continuation fit the model’s patterns, not evidence that it was verified against your company’s current data."
            ]
          },
          {
            id: "generation-is-a-loop",
            title: "Autoregressive Generation",
            content: [
              "Generation is a loop. The application provides a prompt. The model produces scores for possible next tokens. A decoding method selects one token, adds it to the sequence, and asks the model to predict again. The loop ends when the model emits a stop token, reaches a configured output limit, or the application decides it has enough output. What users see as one answer is the visible result of many small prediction and selection steps.",
              "The most likely token is not always selected. If generation always chose the single highest probability continuation, outputs could become repetitive or overly rigid. Sampling controls decide how much variation is allowed. Lower temperature settings place more weight on highly likely tokens and are often appropriate for extraction or classification. Higher variation can be useful for ideation or draft writing, but it also increases behavioral variance. These controls shape the model’s wording. They do not turn uncertain source material into reliable fact.",
              "Autoregressive generation also explains two product behaviors. First, answers can stream. The provider can return text as each new token is produced instead of waiting for the whole answer. Second, generation is inherently sequential. The model cannot generate the tenth new token until the ninth exists. A longer response therefore tends to take longer than a short structured result. The inference lesson examines the prefill and decoding work behind this in more detail."
            ]
          },
          {
            id: "parameters-and-training",
            title: "Training Objective",
            content: [
              "A neural network is a mathematical function with adjustable parameters. During training, it receives an input sequence, predicts a next token, compares that prediction with the token that actually followed in the training data, and adjusts the parameters to make similar mistakes less likely in future. A loss function measures the difference between the prediction and the expected token. For language modelling, cross entropy is the standard loss. It penalises the model when it assigns too little probability to the token that actually occurred.",
              "The parameters are not rows in a database. No single number is ‘the refund policy,’ ‘the Python syntax rule,’ or ‘the answer to a history question.’ Information is distributed across many values and layers of the network. This is why models can generalise from related examples, but it is also why they can fail in surprising ways. The model may answer a fact in one wording and fail to retrieve the same relationship when asked from the opposite direction. We can inspect behaviour and measure it, but we do not have a complete human readable map of how every learned pattern is represented internally.",
              "Thinking of a model as a lossy compression of a large body of text is a useful intuition with an important limitation. A model compresses statistical structure, relationships, styles, and fragments of knowledge into its parameters, but it is not a lossless archive and it does not perform a live lookup of its training data. It can reproduce a memorized fragment, synthesize a correct explanation from learned patterns, or generate a plausible but wrong detail. The same mechanism produces both the capability and the uncertainty."
            ]
          },
          {
            id: "why-capability-emerges",
            title: "Emergent Capabilities",
            content: [
              "Next token prediction appears modest until you look at what good prediction requires. To continue a code sample, a model must learn patterns of syntax, APIs, names, and program structure. To continue a scientific article, it benefits from learning terminology, relationships, and common explanations. To continue a support conversation, it must distinguish a request, a complaint, a product reference, and an expected response format. Training on diverse language and code forces the model to build reusable internal representations for many such patterns.",
              "This helps explain why one foundation model can summarise a document, classify a support message, draft a response, extract fields, translate text, or write a function. The tasks differ at the product level, but they can all be framed as continuing a sequence in an appropriate form. The prompt gives the model a temporary role and context. The model then uses patterns learned during training to make a continuation that resembles the requested task.",
              "Capability is not the same as competence in every setting. A model may write a convincing explanation of a policy while using stale information. It may produce valid JSON with a wrong item identifier. It may suggest correct code that is unsuitable for the version of a library in your application. The question for an engineer is never only ‘Can this model produce language like this?’ It is also ‘What evidence does it need, what can go wrong, and what must verify the result?’"
            ]
          },
          {
            id: "base-models-and-assistants",
            title: "Base and Assistant Models",
            content: [
              "Pretraining creates a base model. It is a strong statistical continuation engine trained on broad data. A base model does not automatically behave like a cooperative assistant. Given a request, it may continue the text in the style of a web page, a transcript, or a document rather than answer directly. This is expected. Its objective was to continue sequences that resemble its training data, not to place a user’s instruction above all other text in a conversation.",
              "Post training changes this behaviour. In supervised fine tuning, models are trained on examples of instructions and desirable responses. Preference training then uses comparisons or feedback to make some responses more likely than others. These stages help a model follow a response format, ask a useful clarification question, refuse some requests, use structured output, or select an approved tool. The exact methods differ between model providers, but the product distinction is clear. An assistant model is a base capability shaped to participate in an interaction.",
              "This lesson introduces the distinction because it matters when you choose a model. The next lesson explains pretraining, instruction tuning, preference learning, and fine tuning in depth. For now, retain one boundary. Post training can improve how a model behaves, but it cannot make an untrusted prompt authoritative or replace your application’s permission checks, data validation, and policy logic."
            ]
          },
          {
            id: "context-is-runtime-data",
            title: "Runtime Context",
            content: [
              "Training gives a model broad learned capability. The prompt gives it the information and task for one particular request. In a production application, that prompt can contain system instructions, a user message, recent conversation, retrieved documents, tool results, and a response schema. Together, these inputs form the runtime context. The model has no memory of a customer, order, or earlier request unless your application deliberately includes or retrieves the relevant information.",
              "This is why a model can appear to learn during a chat while its parameters remain unchanged. It conditions the next response on the text in the current context window. If a conversation is long, the application may need to keep recent turns, create a summary, or retrieve the specific prior fact needed for the next task. In context learning means a model can often follow a pattern demonstrated in the prompt without parameter updates. It is powerful for a small number of examples, but it is still temporary context, not permanent training.",
              "Runtime context has different trust levels. A customer message is relevant but can contain false claims or malicious instructions. A database record may be authoritative for an order’s status. A policy document may be current, expired, for internal use only, or intended for a different audience. A good application labels and selects these sources deliberately. Later lessons call this context engineering and retrieval augmented generation. At this stage, the important idea is that sending more text is not the same as sending better context."
            ]
          },
          {
            id: "hallucinations-and-evidence",
            title: "Hallucinations and Grounding",
            content: [
              "A hallucination is a model output that is unsupported, invented, or incorrect. It is not necessarily a strange failure. It follows naturally from the objective. The model is rewarded during training for assigning probability to likely continuations, not for querying a live authoritative system every time it speaks. When the prompt lacks a required fact, the model may generate a detail that fits the surrounding pattern better than it generates an admission that information is missing.",
              "Suppose a customer asks whether order 10492 is eligible for a refund. The order number may look like thousands of other order numbers the model has encountered, and the policy language may sound familiar. None of that grants access to the real order, current policy version, delivery date, or customer identity. If the model says ‘yes, it is eligible’ without verified context, it has produced a plausible continuation, not a business decision. The more polished the wording, the easier it is to mistake that distinction.",
              "Grounding changes the system design, not the model’s nature. The application retrieves current policy evidence, queries approved sources for order facts, and gives the model only the information needed to interpret or explain the result. It then validates important outputs before displaying, storing, or acting on them. The goal is not to eliminate every uncertainty in language. It is to make factual claims traceable to a source and to give the system a safe path when sufficient evidence is unavailable."
            ]
          },
          {
            id: "models-tools-and-action",
            title: "Tool Enabled Systems",
            content: [
              "An LLM is excellent at interpreting ambiguous language and producing a useful next response. It is not inherently a calculator, a database client, a browser, or a payments system. Modern applications extend a model with tools. The model may propose a search query, request an order lookup that only reads data, ask a calculator to evaluate an expression, or generate parameters for a function call. The application decides which tools exist, what inputs they accept, and whether an action is permitted.",
              "This division follows how people solve problems. A support representative does not calculate a refund policy in their head from memory. They consult the current policy and use the order system. The model should be treated similarly. It can determine that an order lookup is relevant, summarise the returned evidence, or draft the explanation. It should not invent tool results, decide its own privileges, or execute an irreversible action because the generated text sounds confident.",
              "Tool use makes an AI application more capable, but it creates a trust boundary. Tool descriptions and results become part of the model context. Arguments must be validated. Authorization must be enforced outside the model. Expensive, irreversible, or high risk actions may require human approval. We will cover tool calling and the Model Context Protocol later in the roadmap. This basic lesson establishes why the application, not the LLM, remains in control of execution."
            ]
          },
          {
            id: "evaluating-empirical-systems",
            title: "Evaluation",
            content: [
              "Traditional software lets you often prove that a function returns a particular output for a particular input. LLM behaviour is different. The same task can have many acceptable wordings, model providers can release new versions, and sampling can introduce variation. Rather than relying on a single impressive demo, teams define representative cases and inspect the behaviour over the full set. They measure task success, factual support, schema validity, latency, cost, and failure handling according to the feature they are building.",
              "A benchmark score can be informative, but it is not a guarantee for your product. The benchmark may use a different prompt format, a different tokenizer, data that overlaps with training, or a task unlike your users’ work. For a customer service feature, a useful evaluation set includes ordinary requests, incomplete messages, policy conflicts, ambiguous wording, unavailable data, and attempts to make the system ignore its rules. The cases define what ‘good’ means in context.",
              "Record the conditions of an important run. Include the model identifier, system instructions, supplied context, tool results, output schema, decoding settings, token usage, and latency. This makes a bad outcome diagnosable. Without this record, a team can only say that the model ‘acted strangely.’ With it, the team can identify whether the source was missing, the prompt was ambiguous, the tool returned bad data, the validation failed, or the model itself made a poor interpretation."
            ]
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
        "Build a practical understanding of how transformers use attention to turn a sequence of tokens into context aware predictions.",
        [
          "A transformer is the neural network architecture behind most modern language models. Before transformers, many sequence models processed text one position at a time. That makes it difficult to connect distant parts of a long sequence and limits how much of the training computation can run in parallel. The transformer introduced a different approach. Each token can directly compare itself with relevant tokens in the same sequence through an operation called self attention. This made language model training at large scale substantially more practical and became the foundation of current GPT style models.",
          "A transformer begins with tokens, not words. Each token ID is mapped to a learned vector called an embedding. An embedding is a compact set of numbers that represents features the model has learned about that token from training. The initial embedding for the token ‘refund’ may eventually support associations with language about returns, payments, customer support, and code fields, but it does not yet reflect the specific meaning of the word in the current request. Context is added by the layers that follow.",
          "Unlike a recurrent model, a transformer does not inherently know whether a token appeared first, last, or in the middle of a request. Position must therefore be represented explicitly. Early transformers added positional encodings to token embeddings. Modern architectures use several approaches, including learned positions and rotation based methods such as RoPE. The implementation varies, but the engineering implication is constant. Order matters. ‘Refund after delivery’ and ‘delivery after refund’ contain the same words but describe different events.",
          "Self attention is the mechanism that lets a token update its representation using other tokens in the sequence. For each token, the model creates three learned projections called a query, a key, and a value. The query represents what that position is looking for, the key represents what each candidate position offers, and the value is the information that can be gathered from that position. These names are useful intuition, not fixed semantic labels. They are vectors learned differently in every layer and head of the model.",
          "The model compares a token’s query with the keys of other tokens. Higher compatibility produces a larger attention score. After normalization, those scores become weights used to combine the corresponding value vectors. In compact form, the operation is Attention(Q, K, V) = softmax(QKᵀ / √dₖ)V. You do not need to derive this equation for application work. What matters is that every token can form a context aware representation by selectively incorporating information from other tokens, rather than carrying forward only a compressed summary of everything that came before.",
          "Imagine the phrase, ‘The customer says the replacement arrived damaged, but the original order was delivered last month.’ When the model represents the word ‘damaged,’ attention can connect it with ‘replacement’ rather than treating the issue as a complaint about the original order. In a different sentence, the same word could be connected to a policy condition, an item identifier, or a previous conversation turn. The representation of a token is therefore conditional on its surroundings. This is one reason language models can handle ambiguity that would be awkward to enumerate as ordinary string matching rules.",
          "A single attention calculation cannot be expected to capture every relevant relationship. Transformers use multiple attention heads in parallel. One head may help model local grammatical relationships, another may connect a reference to an earlier entity, and another may help distinguish an instruction from quoted content. The model learns these roles from data. Engineers should not expect a particular head to have a stable, human readable job. Multiple heads simply give the architecture several different ways to relate the same sequence of tokens.",
          "A transformer layer does more than attention. After attention mixes information across positions, a position wise feed forward network transforms each token representation further. Residual connections preserve useful prior information, and normalization layers stabilize training. Many such blocks are stacked. Early layers may capture simpler lexical and positional relationships. Later layers can combine them into richer patterns relevant to the task. This depth is part of why a model can turn a customer message, a policy excerpt, and a response contract into a coherent next token distribution.",
          "The original transformer was designed as an encoder decoder architecture for translation. An encoder read the input sequence and a decoder generated the output while attending to the encoder’s representation. Many modern generative LLMs use a decoder only architecture instead. The prompt and generated answer live in one token sequence, and each position uses masked self attention to look only at permitted earlier positions. This is the architecture most relevant when you call a chat or text generation API.",
          "The mask is essential to causal language modelling. While training on a sequence, the model is asked to predict every next token. It must not be allowed to inspect the true future token, or it could solve the task by copying. A causal mask blocks those future connections. Training can still process the positions of a known sequence efficiently in parallel because the mask defines what each position may see. During inference, however, the model must generate new tokens one at a time because the next token does not exist until the previous step has selected it. A later lesson explores the latency consequences of that difference.",
          "Attention weights are not a complete explanation of a model decision. They show one operation inside one layer of a large network, not a verified chain of reasoning or a proof that a source was used correctly. A high attention score does not make a document authoritative, and a low score does not prove a token was unimportant elsewhere in the network. For production systems, evidence should be made visible through retrieval results, tool logs, citations, and validation records, rather than inferred from internal attention maps.",
          "For application engineers, the most useful consequence is that the model’s context is a working set with competing signals. System instructions, user text, retrieved documents, tool output, examples, and previous conversation all occupy the same sequence. Adding more text does not guarantee better behavior. Irrelevant documents can introduce competing language, an excerpt without its heading can lose a crucial condition, and untrusted text can be mistaken for an instruction if its role is not made clear. Context engineering is the discipline of making those inputs deliberate.",
          "Consider a Customer Service Agent answering a damaged item request. The application should send a short task instruction, the latest customer message, a narrow order projection, and the relevant current policy passage with its heading and source label. It should not paste the entire customer history, every policy document, or internal staff notes into the request. The transformer may be capable of relating information across a long sequence, but the application still has to decide what information is correct, permitted, and necessary for this particular task.",
          "You do not need to implement a transformer from scratch to build useful LLM applications. You do need to understand why token order, context selection, source labeling, and output boundaries affect the model’s behavior. A transformer is powerful because it can form rich relationships across a sequence. A well engineered application helps it form the right relationships by supplying concise, trusted context and by keeping decisions that require correctness outside the model."
        ],
        "For a damaged item request, the Customer Service Agent will send the model the customer’s latest message, a limited set of verified order facts, and the current public policy section. The policy heading stays attached to the relevant paragraph so its conditions are not separated from the rule. The application will keep internal notes and stale policies outside the model context, then validate any proposed action using deterministic code.",
        ["transformer", "token embeddings", "positional information", "self attention", "queries keys values", "multiple attention heads", "causal masking", "decoder only models"],
        "Concept",
        [
          { id: "tokens-and-representations", title: "Input Representations", start: 0, end: 3 },
          { id: "self-attention", title: "Self Attention", start: 3, end: 6 },
          { id: "transformer-blocks", title: "Transformer Blocks", start: 6, end: 8 },
          { id: "decoder-only-models", title: "Decoder Only Architecture", start: 8, end: 10 },
          { id: "attention-and-evidence", title: "Attention and Interpretability", start: 10, end: 12 },
          { id: "context-as-input", title: "Context Design", start: 12 }
        ]
      ),
      lesson(
        "how-llms-are-trained-and-improved",
        "How LLMs Are Trained and Improved",
        "3 hours",
        "Understand how pretraining and post training shape model behavior, and what those stages mean for an application engineer.",
        [
          "The model you call through an API is the result of several training stages, not one event. The broad pattern is pretraining followed by post training. Pretraining gives a model general language and code capability. Post training teaches it to behave more usefully in conversation, follow instructions, return particular formats, use tools, and avoid some undesirable responses. An application engineer does not need to reproduce these training runs, but needs a working model of them to choose a model, diagnose its behavior, and decide what belongs in the application rather than in the model.",
          "Pretraining is the long, expensive stage in which a model learns from a very large collection of text, code, and other permitted data. The training objective is closely related to the next token prediction introduced in the first lesson. The model sees a sequence, predicts a token, compares its prediction with the actual next token, and adjusts its parameters to reduce that error over many examples. This repeated process is typically optimized using gradient based learning. The result is a base model that has learned regularities in grammar, programming languages, factual associations, writing styles, and common problem patterns.",
          "A base model is capable, but it is not necessarily a helpful assistant. If prompted with ‘Write a refund response,’ a plain continuation model may produce a continuation that resembles training text rather than a direct, well scoped answer. It may complete a conversation transcript, imitate a document, or continue an instruction in an unexpected form. That behavior is not a defect in the objective. The base model learned to predict likely text, not to place a user’s request above every other pattern in the prompt.",
          "Training data strongly affects what the model learns. Quality, diversity, recency, language coverage, code coverage, duplicates, and harmful or incorrect material all influence later behavior. Training pipelines at large scale therefore include data collection, filtering, deduplication, formatting, and quality work. Engineers should understand the implication rather than assume the dataset is a perfect library. A model can recognize a pattern without knowing whether it is current, complete, applicable to a particular customer, or appropriate to repeat in a product.",
          "Pretraining also explains why a model can generalize to a request it has not seen verbatim. It does not need a training example for every possible customer message. Through many related examples, it learns representations that connect phrases such as ‘the package was broken,’ ‘my delivery arrived damaged,’ and ‘the item is unusable.’ Generalization is valuable, but it has limits. Rare domains, new company policy, unusual identifiers, and exact transactional facts require evidence at runtime rather than an assumption that the model learned them during training.",
          "The first common post training step is supervised fine tuning, often called instruction tuning. A model is given examples of an instruction paired with a desirable answer and is trained to produce responses in that style. These examples teach conventions that users expect. They answer the question, follow a requested format, respect system instructions, ask for clarification when appropriate, and avoid exposing an internal chain of text. Instruction tuning is why assistant models usually feel much more direct and cooperative than raw base models, even though they share the same underlying architecture.",
          "Instruction examples alone do not capture every quality judgment. Two responses can both be factually plausible, yet one may be clearer, safer, more complete, or better aligned with a user’s request. Preference training uses comparisons such as ‘response A is better than response B’ to shape the model toward the preferred behavior. Reinforcement learning from human feedback, usually shortened to RLHF, is one family of methods for doing this. Direct Preference Optimization, or DPO, is another widely used approach that learns from preference pairs without requiring the same reinforcement learning loop. You should know the purpose of these terms, not memorize their training equations for an application role.",
          "Human feedback is not the only source of a preference signal. Teams can use expert feedback, policy guided feedback, model assisted feedback, and automated checks alongside human evaluation. Different frontier labs use different data sources and optimization methods, and their exact training recipes are usually not public. The practical conclusion is that labels such as ‘instruction tuned,’ ‘reasoning,’ or ‘tool capable’ indicate intended behavior, not a universal guarantee. The model still needs to be tested against the actual prompts, context, documents, and error cases in your product.",
          "Some models receive additional post training for structured outputs and tool use. They learn to recognize when a function is appropriate, select from an allowed set of tools, and generate arguments in a constrained format. This makes them more useful for applications, but it does not make their proposed calls inherently safe. A model can select an unsuitable tool, omit a required field, or be influenced by untrusted text. The application must validate arguments, enforce authorization, and control execution. Training can improve the interface. It cannot replace the security boundary.",
          "Reasoning models are trained and served to spend more computation on difficult tasks before producing a final answer. They can be useful for multistep analysis, code investigation, planning, or resolving ambiguity. Their strength should not be confused with omniscience. A reasoning model can still begin with incomplete evidence, misinterpret a policy, or propose an invalid action. It may be the right choice for a complex interpretation task after the application has supplied verified context, but it is not a substitute for retrieval, validation, or evaluation.",
          "Fine tuning is a separate decision from choosing a model that has received post training. A product team fine tunes when it has a stable, recurring task, a meaningful volume of high quality examples, a way to evaluate improvement, and a clear reason why prompting, structured output, retrieval, or deterministic code is insufficient. It is usually not the first response to a weak prototype. If the model lacks current policy information, use retrieval. If it needs exact order data, use a tool. If the output must follow a schema, enforce a schema. If the task itself is poorly defined, write a better task contract before collecting a fine tuning dataset.",
          "For the Customer Service Agent, the initial version should not fine tune a model. It can use a capable instruction following model to interpret a customer message, retrieve current policy evidence, call an order tool that only reads data, and return a validated structured proposal. This design is quicker to inspect and improve. If, after evaluating many representative cases, the team finds a stable classification task that is still too inconsistent or expensive, it can consider fine tuning a smaller model for that narrow step. The decision should follow evidence, not the assumption that every serious AI product needs custom training.",
          "Model quality is ultimately an application property. The same model may perform well when asked to summarize one short document and poorly when asked to route an ambiguous request using stale context. When comparing models, record the model identifier, prompt version, available tools, context supplied, output schema, latency, cost, and results on representative cases. This turns a vague statement such as ‘the newer model feels better’ into an engineering comparison that can be reproduced and reviewed.",
          "The key idea is simple. Training determines a model’s general behavior, but it does not determine the correctness of your application. Pretraining gives broad capability. Post training makes that capability more useful. Your system still defines the task, supplies the relevant facts, chooses what actions are permitted, and measures whether the result is acceptable. With that boundary in place, model improvements become something you can evaluate and adopt deliberately rather than something you have to trust blindly."
        ],
        "The Customer Service Agent will begin with an instruction following model and a small evaluation set of refund messages. It may use a lower cost model for straightforward issue classification and a stronger model for a complex policy explanation, but only after testing both with the same trusted context and output contract. No model will approve a refund or access customer data without application controlled checks.",
        ["pretraining", "training data", "instruction tuning", "preference training", "RLHF", "DPO", "fine tuning", "model evaluation"],
        "Concept",
        [
          { id: "training-stages", title: "Training Pipeline", start: 0, end: 3 },
          { id: "pretraining-data", title: "Pretraining Data", start: 3, end: 5 },
          { id: "instruction-tuning", title: "Instruction Tuning", start: 5, end: 6 },
          { id: "preference-training", title: "Preference Optimization", start: 6, end: 8 },
          { id: "reasoning-and-fine-tuning", title: "Reasoning Models and Fine Tuning", start: 8, end: 10 },
          { id: "model-choices", title: "Model Evaluation", start: 10 }
        ]
      ),
      lesson(
        "inference-tokens-context-and-latency",
        "Inference, Tokens, Context Windows, and Latency",
        "3 hours",
        "Learn how an LLM request is processed and how tokens, context, decoding, and caching affect speed, cost, and product behavior.",
        [
          "Inference is the runtime process of using a trained model to answer one request. The application sends input tokens, the model processes them, and then the model generates output tokens one at a time until it reaches a stop condition or the configured output limit. Inference is distinct from training. The model’s parameters do not change because a customer asked a question. A conversation can influence the next answer only because its relevant history is included in the current request or is retrieved by the application.",
          "A useful mental model divides LLM inference into two stages. During prefill, the model reads the input prompt and computes the internal state needed to use its tokens as context. During decoding, the model produces one new token, uses that token as additional context, and repeats. Prefill work grows with the amount of input. Decode work grows with the number of generated tokens. A response with a very long policy prompt can have a slow first token. A long explanation can continue for many seconds after the first token has appeared.",
          "Tokens are the units that both stages operate on. The number of characters in a message is only a rough proxy because tokenization varies by language, punctuation, numbers, code, and model family. The string ‘ORDER 10492’ may use several tokens, while a common word may use one. Engineers should use the tokenizer and usage data for the model they actually call when estimating a feature’s size, rather than using a fixed number of characters for each token in a budget or cost calculation.",
          "Every model has a context window. It is the maximum combined number of input and output tokens it can handle for a request. It is not a separate allowance for documents alone. System instructions, user messages, examples, conversation history, retrieved passages, tool definitions, tool results, and the response all compete for the same budget. If the input is close to the limit, the application may have no room for a useful answer. If it exceeds the limit, the provider may reject the request or the application may have to trim, summarize, or retrieve less context.",
          "The output limit is an engineering control, not merely a way to save money. It bounds how long a model is allowed to generate and helps keep response times predictable. Set it according to the task. A label, routing decision, or structured proposal may need a small output budget. A customer facing explanation may need more room. An answer that regularly reaches its limit is not automatically wrong, but it should be inspected. It may indicate an unclear task, excessive reasoning, an unsuitable response format, or a need to break the work into smaller steps.",
          "Streaming changes the experience of waiting. Instead of holding the complete answer until generation ends, the provider sends partial output as tokens become available. A user can begin reading a response earlier, which improves perceived responsiveness, but streaming does not eliminate the underlying generation time. The application still needs to handle interruption, disconnected clients, partial output that should not yet be persisted, and tool calls that may occur before a final answer is available. A streamed response should remain subject to the same validation and safety boundaries as a response that is not streamed.",
          "Decoding settings determine how the serving system selects from the model’s next token distribution. Temperature changes how sharply the distribution favors the most likely tokens. Lower temperature usually makes output more consistent, while higher temperature introduces more variation. Other controls, such as top p sampling, restrict selection to a probability mass of likely candidates. There is no universally correct setting. A deterministic extraction or classification task usually benefits from lower variation. Brainstorming or creative writing may need more. Evaluate the setting on representative cases rather than treating a single value as a best practice for every model.",
          "Lower variation is not identical to perfect reproducibility. Providers can update model versions, use distributed infrastructure, and change serving behavior. If a provider supports a seed or a version specific model identifier, use it when comparison matters, but still record the request and response. For an important test case, capture the model identifier, prompt version, input context, decoding settings, output schema, and timestamp. That record gives a team a chance to investigate a change in behavior instead of relying on memory of what the model ‘usually’ did.",
          "The transformer lesson introduced keys and values inside attention. During decoding, recomputing those representations for every earlier token at every new step would be wasteful. A KV cache stores the previously computed key and value states so the model can reuse them while generating the continuation. This substantially reduces repeated work, but it consumes memory and does not remove the sequential nature of autoregressive decoding. Application engineers usually receive this optimization from a provider, yet understanding it explains why long conversations and many concurrent generations can have performance and capacity implications.",
          "Provider prompt caching is related but not identical. Some providers can reuse a stable prompt prefix, such as a long system instruction or a shared reference document, across requests. This can lower latency or the cost of input tokens when the exact prefix is reused under the provider’s rules. It is an optimization to consider after measuring a repeated workload, not a reason to put unnecessary material into every prompt. Design the correct minimal context first. Then assess whether stable prefixes justify caching.",
          "Latency across the full request is wider than model latency. A user’s request may spend time in authentication, database reads, retrieval, reranking, safety checks, provider queueing, prefill, decoding, tool execution, and network delivery. Measure at least time to first token, time to final response, input tokens, output tokens, and the duration of each external dependency. A slow customer experience cannot be fixed by switching models if the actual bottleneck is a slow order lookup or a retrieval pipeline that returns too many documents.",
          "Cost is also a property of the whole request. Providers typically meter input and output tokens differently, and the exact prices and caching rules change over time. A long output can cost more and take longer even when the input is small. A large retrieved context can dominate input usage even if only one sentence appears in the final answer. The right practice is to log usage from the provider response, attribute it to the feature and request type, and set budgets or alerts around real traffic. Do not optimize from assumptions when the API already reports the usage.",
          "A context budget turns these ideas into a design decision. Suppose a feature has room for 16,000 tokens. It might reserve 1,000 for system instructions and output schema, 2,000 for recent conversation, 1,500 for verified order facts and tool results, 6,000 for retrieved policy evidence, and 2,000 for a customer facing response. This leaves headroom for variation. Those numbers are illustrative, not a universal template. The important habit is to allocate space intentionally and define what is shortened or dropped first when the request would exceed the budget.",
          "For a damaged item request, the Customer Service Agent should not send the entire chat transcript or all return policy documents. It can send the current request, a compact summary of any necessary prior turn, a limited projection of the verified order, and the few current policy passages selected for the case. The model can stream a short explanation after the application has completed its checks. The trace should show how many tokens each component used and whether latency came from retrieval, the order tool, or model generation.",
          "This is the operational view of an LLM feature. A model call is not a black box that either feels fast or feels slow. It has inputs, a defined output budget, a decoding policy, measurable stages, and resource use that can be improved. In the next lesson, you will make this visible in code by sending an API request directly, streaming the response, and recording the information needed to debug and evaluate a run."
        ],
        "For a refund question, the Customer Service Agent will reserve context space for the task instruction, the latest customer message, a small verified order projection, and selected policy passages. It will reserve output space for a concise explanation, stream the final text to the user, and record input tokens, output tokens, time to first token, total latency, and the time spent in retrieval and order lookup.",
        ["inference", "prefill", "decoding", "tokens", "context window", "output limits", "streaming", "sampling", "KV cache", "prompt caching", "latency", "cost"],
        "Concept",
        [
          { id: "an-inference-request", title: "Inference Lifecycle", start: 0, end: 2 },
          { id: "tokens-and-budget", title: "Token and Context Budgets", start: 2, end: 5 },
          { id: "streaming-and-sampling", title: "Streaming and Sampling", start: 5, end: 7 },
          { id: "reproducibility-and-caching", title: "Reproducibility and Caching", start: 7, end: 9 },
          { id: "latency-and-cost", title: "Latency and Cost", start: 9, end: 11 },
          { id: "designing-a-budget", title: "Capacity Planning", start: 11 }
        ]
      ),
      lesson(
        "using-llm-apis-and-langchain",
        "Using LLM APIs and LangChain",
        "3 hours",
        "Use a provider SDK or LangChain while keeping model behavior, versions, and application boundaries visible.",
        [
          "An LLM API is a network boundary between your application and a model provider. Your server creates a request containing a model identifier, instructions, the task input, configuration, and sometimes a response schema or tool definitions. The provider returns generated content plus operational data such as a request identifier and token usage. Treat this response as one dependency result inside a normal application request, not as a magical method call that completes the product feature by itself.",
          "A minimal integration has a clear lifecycle. Authenticate the user, validate the incoming application request, assemble the permitted context, call the model, validate the result, and return an application response. This is deliberately familiar software engineering. The new part is that the model result is probabilistic and may be incomplete, so the boundary needs a little more design than a call to a deterministic internal service.",
          "Provider SDKs are usually the best place to start. A direct SDK call exposes the actual model identifier, messages, output settings, streaming events, errors, and usage fields. That visibility is valuable when a feature is still small. It lets an engineer see precisely what is crossing the boundary and makes it easier to compare a prompt or model change later. A framework can be introduced once it removes real repetition, rather than as the first abstraction in the project.",
          "Chat APIs commonly represent a request as an ordered list of messages. A system instruction establishes the application’s role and boundaries. A user message contains the person’s request. Tool results, retrieved documents, and prior conversation may be represented as additional messages or content blocks. The exact names vary by provider, but the important idea is stable. Roles and source labels tell the model how to interpret the text. Do not flatten every source into one anonymous string when trust and provenance matter.",
          "The client should construct messages from typed application data, not concatenate an uncontrolled request directly into a long instruction. A customer message is necessary input, but it is untrusted content. An authenticated order projection is a verified source for order facts. A current policy excerpt is evidence for policy wording. Keep those roles visible in the request builder so you can reason about which data a model is allowed to see and why it received it.",
          "The API contract should fit the task. A routing step might return a small structured proposal such as an issue category, missing details, and a recommended next step. A customer facing explanation might return text only after application code has already determined the outcome. Avoid asking one call to both interpret a request and execute a business decision. Separating those jobs gives each call a clearer input, a smaller output budget, and a better test surface.",
          "Set explicit limits on output and time. An output token limit prevents an extraction call from producing an unnecessary essay and establishes a bound on generation work. A timeout prevents an upstream delay from holding an application request indefinitely. A cancellation path matters when the user leaves a page or changes a request. These are ordinary service concerns, but an LLM feature makes them visible because generation can take longer than a typical database read and often streams partial results.",
          "Retries require care. A transient network failure may justify retrying a model request, but a retry can increase cost and create duplicate work. The safe policy depends on what happened before the failure and what side effects the request can cause. Retrying a classification request that only reads data is different from retrying a workflow that already sent an email or created a ticket. Give consequential actions their own idempotency and approval controls instead of assuming an API retry is harmless.",
          "Streaming is a delivery choice, not a correctness feature. When a provider streams, your server receives incremental events and can forward suitable text to the browser before the final response is complete. This can improve perceived responsiveness for a long explanation. It also means the interface must handle interruption, reconnects, final metadata, and content that should not be treated as complete until the run finishes. For a structured decision, it is often simpler to wait for a complete validated result.",
          "The model choice belongs to the task. A smaller model may be sufficient for classifying a short message, extracting a few fields, or selecting from a fixed set of routes. A stronger reasoning model can be useful when the task truly requires complex synthesis or planning. Start from representative cases and a measurable target. Compare accuracy, schema validity, latency, and cost under the same context rather than choosing by a provider’s broad marketing label.",
          "Pin the model identifier when the provider allows it, and record the version you actually called. A model name can be an alias that changes over time. The same applies to prompts, schemas, tools, and framework versions. For an important request, a trace should be able to answer what model received approved context, which settings were used, and what the application accepted or rejected. This is the minimum evidence needed to investigate a behavior change.",
          "LangChain is an application framework with integrations for model providers, message types, structured output, tools, document loaders, retrieval components, and workflow composition. Its value is not that it makes an application more intelligent. Its value is that it can give common components a consistent interface and reduce repeated adapter code as a system grows.",
          "Use LangChain when its abstractions fit a genuine integration problem. For example, it can help when you are testing two providers behind one model interface, building a retrieval pipeline from reusable components, or binding a structured output schema to several model calls. Do not use it merely because an LLM tutorial uses it. A direct SDK is often easier to debug for one small endpoint, and any framework should leave the prompt, data flow, tool permissions, and errors understandable to a teammate who did not create the feature.",
          "Framework code should not hide engineering decisions. Keep prompt templates versioned in your application, log the underlying provider model and usage, and make the request builder testable without a live model call. If a framework returns a rich object, reduce it to the fields your application actually needs. If it automatically retries, follows a tool call, or chooses a model, understand and configure that behavior explicitly. Convenience is useful only when the application remains inspectable.",
          "A good first integration is intentionally narrow. Build a server side endpoint that accepts a validated support message, gives the model a bounded interpretation task, requests a small structured proposal, validates that proposal, and records the model version and usage. Do not add RAG, tools, memory, or multiple agents to this first call. Those later components are easier to learn when the base request lifecycle is already clear.",
          "For the Customer Service Agent, the first model call will identify the request type, the customer’s stated goal, and any missing details. The server will keep the provider key outside the browser, limit the model to a small response schema, record latency and token usage, and reject incomplete output before it reaches business logic. LangChain may later manage the model integration, but the application will still own the request boundary and every decision after it."
        ],
        "The Customer Service Agent will use LangChain's model integration to interpret customer messages and explain an approved policy result. Each run will still record the actual provider model, response time, and token use so the framework does not hide operating behavior.",
        ["model APIs", "provider SDKs", "messages", "streaming", "timeouts", "retries", "LangChain", "model routing", "versioning"],
        "Concept",
        [
          { id: "the-request-boundary", title: "API Request Lifecycle", start: 0, end: 3 },
          { id: "messages-and-contracts", title: "Messages and Output Contracts", start: 3, end: 6 },
          { id: "operating-the-call", title: "Streaming, Timeouts, and Retries", start: 6, end: 9 },
          { id: "choosing-a-model", title: "Model Selection and Versioning", start: 9, end: 11 },
          { id: "where-langchain-helps", title: "LangChain", start: 11, end: 13 },
          { id: "keeping-the-flow-visible", title: "Application Visibility", start: 13, end: 14 },
          { id: "first-integration", title: "Implementation Pattern", start: 14 }
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
