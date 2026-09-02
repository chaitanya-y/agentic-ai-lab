import type { ReactNode } from "react";

type LessonVisualProps = {
  lessonSlug: string;
  sectionId: string;
};

type VisualFrameProps = {
  caption: string;
  children: ReactNode;
  description: string;
  id: string;
  title: string;
};

function VisualFrame({ caption, children, description, id, title }: VisualFrameProps) {
  return (
    <figure className="lesson-visual">
      <div className="lesson-visual-canvas">
        <svg aria-labelledby={`${id}-title ${id}-description`} role="img" viewBox="0 0 960 520">
          <title id={`${id}-title`}>{title}</title>
          <desc id={`${id}-description`}>{description}</desc>
          <defs>
            <linearGradient id={`${id}-paper`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#fffaf0" />
              <stop offset="1" stopColor="#f0e4cf" />
            </linearGradient>
            <marker id={`${id}-arrow`} markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
              <path d="M0,0 L8,4 L0,8 Z" fill="#173b2f" />
            </marker>
          </defs>
          <rect fill={`url(#${id}-paper)`} height="500" rx="30" width="940" x="10" y="10" />
          {children}
        </svg>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function TokenizationVisual() {
  return (
    <VisualFrame
      caption="A tokenizer converts text into token IDs before the model processes the request. The exact split depends on the tokenizer used by the model."
      description="The sentence Refund order AX10492 is split into four example tokens and converted into four token IDs."
      id="tokenization-visual"
      title="Tokenization flow"
    >
      <text className="lesson-visual-kicker" x="72" y="72">TOKENIZATION FLOW</text>
      <rect className="lesson-visual-panel" height="110" rx="18" width="250" x="62" y="124" />
      <text className="lesson-visual-label" x="88" y="158">Input text</text>
      <text className="lesson-visual-copy" x="88" y="202">Refund order AX10492</text>

      <line className="lesson-visual-arrow" markerEnd="url(#tokenization-visual-arrow)" x1="330" x2="406" y1="179" y2="179" />

      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="190" rx="18" width="270" x="424" y="84" />
      <text className="lesson-visual-label" x="450" y="118">Example tokens</text>
      <rect className="lesson-visual-chip lesson-visual-chip-coral" height="48" rx="12" width="92" x="450" y="144" />
      <text className="lesson-visual-chip-text" textAnchor="middle" x="496" y="174">Refund</text>
      <rect className="lesson-visual-chip lesson-visual-chip-yellow" height="48" rx="12" width="86" x="554" y="144" />
      <text className="lesson-visual-chip-text" textAnchor="middle" x="597" y="174">order</text>
      <rect className="lesson-visual-chip lesson-visual-chip-green" height="48" rx="12" width="52" x="450" y="206" />
      <text className="lesson-visual-chip-text" textAnchor="middle" x="476" y="236">AX</text>
      <rect className="lesson-visual-chip lesson-visual-chip-blue" height="48" rx="12" width="104" x="514" y="206" />
      <text className="lesson-visual-chip-text" textAnchor="middle" x="566" y="236">10492</text>

      <line className="lesson-visual-arrow" markerEnd="url(#tokenization-visual-arrow)" x1="712" x2="774" y1="179" y2="179" />

      <rect className="lesson-visual-panel" height="190" rx="18" width="130" x="790" y="84" />
      <text className="lesson-visual-label" textAnchor="middle" x="855" y="118">Token IDs</text>
      <text className="lesson-visual-code" textAnchor="middle" x="855" y="158">8142</text>
      <text className="lesson-visual-code" textAnchor="middle" x="855" y="190">2019</text>
      <text className="lesson-visual-code" textAnchor="middle" x="855" y="222">5291</text>
      <text className="lesson-visual-code" textAnchor="middle" x="855" y="254">7704</text>

      <path className="lesson-visual-sketch-line" d="M88 355 C250 326, 366 384, 536 350 S790 326, 876 362" />
      <text className="lesson-visual-note" x="84" y="414">The model processes IDs, not the characters displayed to the user.</text>
      <text className="lesson-visual-note lesson-visual-note-muted" x="84" y="449">Token counts shape context capacity, request cost, and part of the response time.</text>
    </VisualFrame>
  );
}

function TransformerVisual() {
  return (
    <VisualFrame
      caption="A decoder only transformer repeatedly combines masked self attention with a feed forward network. The final representation becomes a probability distribution for the next token."
      description="Tokens move through embeddings and positional information, repeated transformer blocks, normalization, an output projection, and softmax to produce next token probabilities."
      id="transformer-visual"
      title="Decoder only transformer architecture"
    >
      <text className="lesson-visual-kicker" x="58" y="58">DECODER ONLY TRANSFORMER</text>

      <rect className="lesson-visual-panel" height="70" rx="16" width="142" x="48" y="104" />
      <text className="lesson-visual-label" textAnchor="middle" x="119" y="132">Input tokens</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="119" y="158">The order is</text>
      <line className="lesson-visual-arrow" markerEnd="url(#transformer-visual-arrow)" x1="119" x2="119" y1="181" y2="224" />

      <rect className="lesson-visual-panel lesson-visual-panel-yellow" height="74" rx="16" width="170" x="34" y="238" />
      <text className="lesson-visual-label" textAnchor="middle" x="119" y="266">Token embeddings</text>
      <text className="lesson-visual-small" textAnchor="middle" x="119" y="292">plus position</text>

      <line className="lesson-visual-arrow" markerEnd="url(#transformer-visual-arrow)" x1="218" x2="278" y1="275" y2="275" />

      <rect className="lesson-visual-block" height="352" rx="24" width="350" x="296" y="84" />
      <text className="lesson-visual-label" textAnchor="middle" x="471" y="118">Transformer block repeated many times</text>
      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="78" rx="16" width="262" x="340" y="146" />
      <text className="lesson-visual-copy" textAnchor="middle" x="471" y="178">Masked self attention</text>
      <text className="lesson-visual-small" textAnchor="middle" x="471" y="202">Tokens exchange permitted information</text>
      <path className="lesson-visual-loop" d="M328 185 C292 185, 292 266, 328 266" />
      <text className="lesson-visual-small" textAnchor="middle" x="282" y="229">Residual</text>

      <line className="lesson-visual-arrow" markerEnd="url(#transformer-visual-arrow)" x1="471" x2="471" y1="232" y2="260" />
      <rect className="lesson-visual-panel lesson-visual-panel-green" height="78" rx="16" width="262" x="340" y="276" />
      <text className="lesson-visual-copy" textAnchor="middle" x="471" y="308">Feed forward network</text>
      <text className="lesson-visual-small" textAnchor="middle" x="471" y="332">Transforms each token representation</text>
      <path className="lesson-visual-loop" d="M614 315 C650 315, 650 384, 614 384" />
      <text className="lesson-visual-small" textAnchor="middle" x="680" y="354">Residual</text>
      <text className="lesson-visual-small" textAnchor="middle" x="471" y="399">Normalization stabilizes each stage</text>

      <line className="lesson-visual-arrow" markerEnd="url(#transformer-visual-arrow)" x1="664" x2="716" y1="275" y2="275" />

      <rect className="lesson-visual-panel lesson-visual-panel-coral" height="76" rx="16" width="190" x="734" y="146" />
      <text className="lesson-visual-label" textAnchor="middle" x="829" y="176">Output projection</text>
      <text className="lesson-visual-small" textAnchor="middle" x="829" y="201">Scores every token</text>
      <line className="lesson-visual-arrow" markerEnd="url(#transformer-visual-arrow)" x1="829" x2="829" y1="230" y2="262" />
      <rect className="lesson-visual-panel" height="76" rx="16" width="190" x="734" y="278" />
      <text className="lesson-visual-label" textAnchor="middle" x="829" y="308">Softmax</text>
      <text className="lesson-visual-small" textAnchor="middle" x="829" y="333">Converts scores to probabilities</text>
      <line className="lesson-visual-arrow" markerEnd="url(#transformer-visual-arrow)" x1="829" x2="829" y1="362" y2="394" />
      <text className="lesson-visual-copy" textAnchor="middle" x="829" y="430">“delayed” 42%</text>
      <text className="lesson-visual-small" textAnchor="middle" x="829" y="454">next token candidate</text>
    </VisualFrame>
  );
}

function TrainingVisual() {
  return (
    <VisualFrame
      caption="A common model development path begins with pretraining and may include several post training stages. Evaluation acts as a gate between stages and continues after deployment."
      description="A common progression from pretraining to instruction tuning, preference optimization, evaluation gates, and deployment. Stages may repeat when evaluation reveals a weakness."
      id="training-visual"
      title="Large language model development pipeline"
    >
      <text className="lesson-visual-kicker" x="62" y="70">A COMMON MODEL DEVELOPMENT PIPELINE</text>
      <line className="lesson-visual-route" x1="112" x2="848" y1="262" y2="262" />

      <circle className="lesson-visual-stage lesson-visual-stage-blue" cx="120" cy="262" r="48" />
      <text className="lesson-visual-stage-number" textAnchor="middle" x="120" y="269">01</text>
      <text className="lesson-visual-label" textAnchor="middle" x="120" y="350">Pretraining</text>
      <text className="lesson-visual-small" textAnchor="middle" x="120" y="377">Next token learning</text>

      <circle className="lesson-visual-stage lesson-visual-stage-yellow" cx="300" cy="262" r="48" />
      <text className="lesson-visual-stage-number" textAnchor="middle" x="300" y="269">02</text>
      <text className="lesson-visual-label" textAnchor="middle" x="300" y="350">Instruction tuning</text>
      <text className="lesson-visual-small" textAnchor="middle" x="300" y="377">Desired responses</text>

      <circle className="lesson-visual-stage lesson-visual-stage-coral" cx="480" cy="262" r="48" />
      <text className="lesson-visual-stage-number" textAnchor="middle" x="480" y="269">03</text>
      <text className="lesson-visual-label" textAnchor="middle" x="480" y="350">Preference optimization</text>
      <text className="lesson-visual-small" textAnchor="middle" x="480" y="377">RLHF or DPO</text>

      <circle className="lesson-visual-stage lesson-visual-stage-green" cx="660" cy="262" r="48" />
      <text className="lesson-visual-stage-number" textAnchor="middle" x="660" y="269">04</text>
      <text className="lesson-visual-label" textAnchor="middle" x="660" y="350">Evaluation gates</text>
      <text className="lesson-visual-small" textAnchor="middle" x="660" y="377">Capability and safety</text>

      <circle className="lesson-visual-stage lesson-visual-stage-dark" cx="840" cy="262" r="48" />
      <text className="lesson-visual-stage-number lesson-visual-stage-number-light" textAnchor="middle" x="840" y="269">05</text>
      <text className="lesson-visual-label" textAnchor="middle" x="840" y="350">Deployment</text>
      <text className="lesson-visual-small" textAnchor="middle" x="840" y="377">Versioned model</text>

      <text className="lesson-visual-note" textAnchor="middle" x="480" y="454">Stages can repeat when evaluation reveals a weakness. Evaluation also continues after deployment.</text>
    </VisualFrame>
  );
}

function InferenceVisual() {
  return (
    <VisualFrame
      caption="Inference has two distinct stages. Prefill processes the complete input in parallel, while decoding generates new tokens sequentially and reuses the KV cache."
      description="A prompt enters prefill, creates cached attention states, and moves into a decoding loop that streams one token at a time."
      id="inference-visual"
      title="Prefill and decoding during inference"
    >
      <text className="lesson-visual-kicker" x="62" y="66">ONE MODEL REQUEST</text>
      <rect className="lesson-visual-panel" height="132" rx="20" width="210" x="58" y="138" />
      <text className="lesson-visual-label" x="84" y="174">Prompt</text>
      <text className="lesson-visual-small" x="84" y="207">Instructions</text>
      <text className="lesson-visual-small" x="84" y="231">Customer message</text>
      <text className="lesson-visual-small" x="84" y="255">Policy evidence</text>

      <line className="lesson-visual-arrow" markerEnd="url(#inference-visual-arrow)" x1="286" x2="348" y1="204" y2="204" />

      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="176" rx="22" width="228" x="366" y="116" />
      <text className="lesson-visual-label" textAnchor="middle" x="480" y="158">Prefill</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="480" y="198">Process all input tokens</text>
      <text className="lesson-visual-small" textAnchor="middle" x="480" y="228">Build attention states</text>
      <rect className="lesson-visual-chip lesson-visual-chip-blue" height="34" rx="10" width="116" x="422" y="246" />
      <text className="lesson-visual-small" textAnchor="middle" x="480" y="268">KV cache</text>

      <line className="lesson-visual-arrow" markerEnd="url(#inference-visual-arrow)" x1="612" x2="672" y1="204" y2="204" />

      <rect className="lesson-visual-block" height="250" rx="24" width="224" x="690" y="88" />
      <text className="lesson-visual-label" textAnchor="middle" x="802" y="130">Decoding loop</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="802" y="174">Predict next token</text>
      <line className="lesson-visual-arrow" markerEnd="url(#inference-visual-arrow)" x1="802" x2="802" y1="188" y2="222" />
      <text className="lesson-visual-copy" textAnchor="middle" x="802" y="250">Append token</text>
      <path className="lesson-visual-loop" d="M850 250 C902 250, 902 174, 850 174" />
      <text className="lesson-visual-small" textAnchor="middle" x="802" y="302">Repeat until stop</text>

      <path className="lesson-visual-sketch-line" d="M92 390 C270 370, 398 418, 560 390 S766 374, 884 398" />
      <text className="lesson-visual-note" x="84" y="448">Time to first token includes queueing and prefill. Longer outputs add sequential decoding time.</text>
    </VisualFrame>
  );
}

function ApiVisual() {
  return (
    <VisualFrame
      caption="An LLM API is one boundary inside an application. The server prepares approved context, the provider generates a result, and application code validates the response before using it."
      description="A user request passes through an application server to an LLM provider. The response returns to validation and then to the product."
      id="api-visual"
      title="LLM API application flow"
    >
      <text className="lesson-visual-kicker" x="62" y="66">APPLICATION REQUEST FLOW</text>

      <rect className="lesson-visual-panel" height="86" rx="18" width="158" x="48" y="176" />
      <text className="lesson-visual-label" textAnchor="middle" x="127" y="208">Product</text>
      <text className="lesson-visual-small" textAnchor="middle" x="127" y="236">User request</text>
      <line className="lesson-visual-arrow" markerEnd="url(#api-visual-arrow)" x1="222" x2="286" y1="219" y2="219" />

      <rect className="lesson-visual-block" height="250" rx="24" width="280" x="304" y="96" />
      <text className="lesson-visual-label" textAnchor="middle" x="444" y="136">Application server</text>
      <rect className="lesson-visual-panel lesson-visual-panel-yellow" height="48" rx="12" width="218" x="335" y="160" />
      <text className="lesson-visual-small" textAnchor="middle" x="444" y="190">Authenticate and authorize</text>
      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="48" rx="12" width="218" x="335" y="220" />
      <text className="lesson-visual-small" textAnchor="middle" x="444" y="250">Assemble approved context</text>
      <rect className="lesson-visual-panel lesson-visual-panel-green" height="48" rx="12" width="218" x="335" y="280" />
      <text className="lesson-visual-small" textAnchor="middle" x="444" y="310">Validate model output</text>

      <line className="lesson-visual-arrow" markerEnd="url(#api-visual-arrow)" x1="602" x2="666" y1="176" y2="176" />
      <text className="lesson-visual-small" textAnchor="middle" x="634" y="158">Request</text>
      <line className="lesson-visual-arrow lesson-visual-arrow-return" markerEnd="url(#api-visual-arrow)" x1="666" x2="602" y1="272" y2="272" />
      <text className="lesson-visual-small" textAnchor="middle" x="634" y="304">Response</text>

      <rect className="lesson-visual-panel lesson-visual-panel-coral" height="176" rx="22" width="216" x="684" y="132" />
      <text className="lesson-visual-label" textAnchor="middle" x="792" y="170">Model provider</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="792" y="214">LLM inference</text>
      <text className="lesson-visual-small" textAnchor="middle" x="792" y="244">Generated content</text>
      <text className="lesson-visual-small" textAnchor="middle" x="792" y="270">Usage and status</text>

      <text className="lesson-visual-note" textAnchor="middle" x="480" y="424">Permissions, business rules, validation, and side effects remain in application code.</text>
      <text className="lesson-visual-note lesson-visual-note-muted" textAnchor="middle" x="480" y="458">The model proposes language or structured data. It does not own the workflow.</text>
    </VisualFrame>
  );
}

function BasicAgentVisual() {
  return (
    <VisualFrame
      caption="The model proposes the next step, while application code validates access, executes the single permitted lookup, and enforces the stopping limits."
      description="A bounded order status agent uses one initial model decision, at most one authorized lookup, and an optional second model call for the final response."
      id="basic-agent-visual"
      title="Bounded customer service agent"
    >
      <text className="lesson-visual-kicker" x="58" y="58">CUSTOMER SERVICE AGENT V1</text>

      <rect className="lesson-visual-panel" height="78" rx="16" width="170" x="42" y="126" />
      <text className="lesson-visual-label" textAnchor="middle" x="127" y="157">Customer request</text>
      <text className="lesson-visual-small" textAnchor="middle" x="127" y="183">Order status only</text>

      <line className="lesson-visual-arrow" markerEnd="url(#basic-agent-visual-arrow)" x1="226" x2="286" y1="165" y2="165" />

      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="116" rx="18" width="190" x="304" y="106" />
      <text className="lesson-visual-label" textAnchor="middle" x="399" y="143">Model call 01</text>
      <text className="lesson-visual-small" textAnchor="middle" x="399" y="172">Ask for the ID</text>
      <text className="lesson-visual-small" textAnchor="middle" x="399" y="196">or propose lookup</text>

      <line className="lesson-visual-arrow" markerEnd="url(#basic-agent-visual-arrow)" x1="510" x2="570" y1="165" y2="165" />

      <rect className="lesson-visual-block" height="188" rx="22" width="284" x="588" y="70" />
      <text className="lesson-visual-label" textAnchor="middle" x="730" y="108">Application control</text>
      <rect className="lesson-visual-panel lesson-visual-panel-yellow" height="46" rx="11" width="220" x="620" y="128" />
      <text className="lesson-visual-small" textAnchor="middle" x="730" y="157">Validate tool arguments</text>
      <rect className="lesson-visual-panel lesson-visual-panel-coral" height="46" rx="11" width="220" x="620" y="190" />
      <text className="lesson-visual-small" textAnchor="middle" x="730" y="219">Authorize customer access</text>

      <line className="lesson-visual-arrow" markerEnd="url(#basic-agent-visual-arrow)" x1="730" x2="730" y1="272" y2="310" />

      <rect className="lesson-visual-panel lesson-visual-panel-green" height="72" rx="16" width="220" x="620" y="326" />
      <text className="lesson-visual-label" textAnchor="middle" x="730" y="355">Read only order lookup</text>
      <text className="lesson-visual-small" textAnchor="middle" x="730" y="380">One call maximum</text>

      <line className="lesson-visual-arrow lesson-visual-arrow-return" markerEnd="url(#basic-agent-visual-arrow)" x1="602" x2="520" y1="362" y2="362" />

      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="84" rx="16" width="190" x="312" y="320" />
      <text className="lesson-visual-label" textAnchor="middle" x="407" y="351">Model call 02</text>
      <text className="lesson-visual-small" textAnchor="middle" x="407" y="378">Explain verified result</text>

      <line className="lesson-visual-arrow lesson-visual-arrow-return" markerEnd="url(#basic-agent-visual-arrow)" x1="294" x2="226" y1="362" y2="362" />

      <rect className="lesson-visual-panel" height="84" rx="16" width="170" x="42" y="320" />
      <text className="lesson-visual-label" textAnchor="middle" x="127" y="351">Validated reply</text>
      <text className="lesson-visual-small" textAnchor="middle" x="127" y="378">Then stop</text>

      <text className="lesson-visual-note" textAnchor="middle" x="480" y="464">Two model calls and one tool call are the maximum for one run.</text>
    </VisualFrame>
  );
}

export function LessonVisual({ lessonSlug, sectionId }: LessonVisualProps) {
  const visualKey = `${lessonSlug}:${sectionId}`;

  switch (visualKey) {
    case "what-is-a-large-language-model:text-is-tokens":
      return <TokenizationVisual />;
    case "transformer-architecture-and-attention:decoder-only-models":
      return <TransformerVisual />;
    case "how-llms-are-trained-and-improved:training-large-language-models":
      return <TrainingVisual />;
    case "inference-tokens-context-and-latency:llm-inference":
      return <InferenceVisual />;
    case "using-llm-apis-and-langchain:api-boundary":
      return <ApiVisual />;
    case "building-a-basic-agent-with-langchain:agent-boundary":
      return <BasicAgentVisual />;
    default:
      return null;
  }
}
