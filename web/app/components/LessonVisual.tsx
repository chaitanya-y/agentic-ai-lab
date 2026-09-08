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

function PromptBoundaryVisual() {
  return (
    <VisualFrame
      caption="A model request keeps application instructions separate from changing user data and asks for a result that follows an explicit contract."
      description="System instructions and a customer message enter a bounded model task. The model returns a structured proposal for application validation."
      id="prompt-boundary-visual"
      title="Prompt as an application interface"
    >
      <text className="lesson-visual-kicker" x="60" y="64">MODEL REQUEST INTERFACE</text>
      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="112" rx="18" width="228" x="54" y="112" />
      <text className="lesson-visual-label" textAnchor="middle" x="168" y="150">System instructions</text>
      <text className="lesson-visual-small" textAnchor="middle" x="168" y="181">Task and boundaries</text>
      <text className="lesson-visual-small" textAnchor="middle" x="168" y="204">Application controlled</text>

      <rect className="lesson-visual-panel lesson-visual-panel-yellow" height="112" rx="18" width="228" x="54" y="280" />
      <text className="lesson-visual-label" textAnchor="middle" x="168" y="318">Customer message</text>
      <text className="lesson-visual-small" textAnchor="middle" x="168" y="349">Current request data</text>
      <text className="lesson-visual-small" textAnchor="middle" x="168" y="372">Untrusted input</text>

      <line className="lesson-visual-arrow" markerEnd="url(#prompt-boundary-visual-arrow)" x1="304" x2="382" y1="168" y2="220" />
      <line className="lesson-visual-arrow" markerEnd="url(#prompt-boundary-visual-arrow)" x1="304" x2="382" y1="336" y2="284" />

      <rect className="lesson-visual-block" height="232" rx="24" width="238" x="400" y="138" />
      <text className="lesson-visual-label" textAnchor="middle" x="519" y="180">Bounded model task</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="519" y="222">Classify request</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="519" y="258">Extract identifier</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="519" y="294">Name missing data</text>
      <text className="lesson-visual-small" textAnchor="middle" x="519" y="338">No retrieval or action</text>

      <line className="lesson-visual-arrow" markerEnd="url(#prompt-boundary-visual-arrow)" x1="658" x2="722" y1="254" y2="254" />
      <rect className="lesson-visual-panel lesson-visual-panel-green" height="154" rx="20" width="182" x="740" y="176" />
      <text className="lesson-visual-label" textAnchor="middle" x="831" y="215">Typed proposal</text>
      <text className="lesson-visual-small" textAnchor="middle" x="831" y="250">Schema check</text>
      <text className="lesson-visual-small" textAnchor="middle" x="831" y="278">Application rules</text>
      <text className="lesson-visual-small" textAnchor="middle" x="831" y="306">Then continue</text>
      <text className="lesson-visual-note" textAnchor="middle" x="480" y="458">The prompt defines language work. Application code retains authority.</text>
    </VisualFrame>
  );
}

function ContextBudgetVisual() {
  return (
    <VisualFrame
      caption="Reserve output capacity first, then allocate the remaining input budget across required and optional context components."
      description="A four thousand token context window reserves five hundred tokens for output. Required instructions and the customer request are included before optional order, policy, and history context."
      id="context-budget-visual"
      title="Context budget allocation"
    >
      <text className="lesson-visual-kicker" x="58" y="64">CONTEXT WINDOW BUDGET</text>
      <text className="lesson-visual-label" x="58" y="112">4,000 tokens shared by input and output</text>

      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="96" rx="18" width="640" x="58" y="146" />
      <text className="lesson-visual-label" textAnchor="middle" x="378" y="182">Input capacity</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="378" y="216">3,500 tokens</text>
      <rect className="lesson-visual-panel lesson-visual-panel-coral" height="96" rx="18" width="184" x="718" y="146" />
      <text className="lesson-visual-label" textAnchor="middle" x="810" y="182">Output reserve</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="810" y="216">500 tokens</text>

      <rect className="lesson-visual-chip lesson-visual-chip-blue" height="70" rx="14" width="132" x="58" y="286" />
      <text className="lesson-visual-small" textAnchor="middle" x="124" y="315">Instructions</text>
      <text className="lesson-visual-label" textAnchor="middle" x="124" y="342">300</text>
      <rect className="lesson-visual-chip lesson-visual-chip-yellow" height="70" rx="14" width="132" x="204" y="286" />
      <text className="lesson-visual-small" textAnchor="middle" x="270" y="315">Request</text>
      <text className="lesson-visual-label" textAnchor="middle" x="270" y="342">100</text>
      <rect className="lesson-visual-chip lesson-visual-chip-green" height="70" rx="14" width="132" x="350" y="286" />
      <text className="lesson-visual-small" textAnchor="middle" x="416" y="315">Order</text>
      <text className="lesson-visual-label" textAnchor="middle" x="416" y="342">700</text>
      <rect className="lesson-visual-chip lesson-visual-chip-coral" height="70" rx="14" width="132" x="496" y="286" />
      <text className="lesson-visual-small" textAnchor="middle" x="562" y="315">Policy</text>
      <text className="lesson-visual-label" textAnchor="middle" x="562" y="342">1,200</text>
      <rect className="lesson-visual-panel" height="70" rx="14" width="132" x="642" y="286" />
      <text className="lesson-visual-small" textAnchor="middle" x="708" y="315">Remaining</text>
      <text className="lesson-visual-label" textAnchor="middle" x="708" y="342">1,200</text>
      <rect className="lesson-visual-panel lesson-visual-panel-coral" height="70" rx="14" width="112" x="790" y="286" />
      <text className="lesson-visual-small" textAnchor="middle" x="846" y="315">Old history</text>
      <text className="lesson-visual-label" textAnchor="middle" x="846" y="342">Excluded</text>

      <text className="lesson-visual-note" textAnchor="middle" x="480" y="422">Required context must fit. Optional context is selected by policy and reported when excluded.</text>
      <text className="lesson-visual-note lesson-visual-note-muted" textAnchor="middle" x="480" y="456">The figures are teaching values, not universal production limits.</text>
    </VisualFrame>
  );
}

function ContextAssemblyVisual() {
  return (
    <VisualFrame
      caption="Context assembly filters sources by authorization, audience, validity, relevance, and budget before the model receives them."
      description="Several possible context sources pass through deterministic filters. Approved sources enter the model request while excluded sources and reasons are recorded."
      id="context-assembly-visual"
      title="Context selection pipeline"
    >
      <text className="lesson-visual-kicker" x="58" y="62">CONTEXT SELECTION PIPELINE</text>
      <rect className="lesson-visual-panel" height="54" rx="13" width="184" x="48" y="104" />
      <text className="lesson-visual-small" textAnchor="middle" x="140" y="137">Customer message</text>
      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="54" rx="13" width="184" x="48" y="176" />
      <text className="lesson-visual-small" textAnchor="middle" x="140" y="209">Order records</text>
      <rect className="lesson-visual-panel lesson-visual-panel-yellow" height="54" rx="13" width="184" x="48" y="248" />
      <text className="lesson-visual-small" textAnchor="middle" x="140" y="281">Policy sources</text>
      <rect className="lesson-visual-panel lesson-visual-panel-coral" height="54" rx="13" width="184" x="48" y="320" />
      <text className="lesson-visual-small" textAnchor="middle" x="140" y="353">Conversation turns</text>

      <line className="lesson-visual-arrow" markerEnd="url(#context-assembly-visual-arrow)" x1="250" x2="316" y1="239" y2="239" />
      <rect className="lesson-visual-block" height="302" rx="24" width="270" x="334" y="88" />
      <text className="lesson-visual-label" textAnchor="middle" x="469" y="126">Application filters</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="469" y="171">01 Authorization</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="469" y="211">02 Audience and dates</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="469" y="251">03 Task relevance</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="469" y="291">04 Conversation selection</text>
      <text className="lesson-visual-copy" textAnchor="middle" x="469" y="331">05 Token budget</text>
      <text className="lesson-visual-small" textAnchor="middle" x="469" y="366">Record each exclusion</text>

      <line className="lesson-visual-arrow" markerEnd="url(#context-assembly-visual-arrow)" x1="622" x2="686" y1="186" y2="186" />
      <rect className="lesson-visual-panel lesson-visual-panel-green" height="132" rx="19" width="206" x="704" y="118" />
      <text className="lesson-visual-label" textAnchor="middle" x="807" y="157">Approved context</text>
      <text className="lesson-visual-small" textAnchor="middle" x="807" y="190">Stable source IDs</text>
      <text className="lesson-visual-small" textAnchor="middle" x="807" y="218">Sent to the model</text>

      <line className="lesson-visual-arrow lesson-visual-arrow-return" markerEnd="url(#context-assembly-visual-arrow)" x1="686" x2="622" y1="330" y2="330" />
      <rect className="lesson-visual-panel lesson-visual-panel-coral" height="92" rx="17" width="206" x="704" y="286" />
      <text className="lesson-visual-label" textAnchor="middle" x="807" y="323">Exclusion report</text>
      <text className="lesson-visual-small" textAnchor="middle" x="807" y="351">Source and reason</text>
      <text className="lesson-visual-note" textAnchor="middle" x="480" y="454">The model receives selected evidence, not every source the application can access.</text>
    </VisualFrame>
  );
}

function PromptEvaluationVisual() {
  return (
    <VisualFrame
      caption="Prompt changes are selected with development cases and checked once against held out cases. Prompt demonstrations remain a separate input set."
      description="Prompt examples feed the request. Development cases guide revisions. A held out evaluation checks the selected version before release."
      id="prompt-evaluation-visual"
      title="Prompt evaluation workflow"
    >
      <text className="lesson-visual-kicker" x="58" y="62">CONTROLLED PROMPT EVALUATION</text>
      <rect className="lesson-visual-panel lesson-visual-panel-yellow" height="86" rx="17" width="190" x="48" y="104" />
      <text className="lesson-visual-label" textAnchor="middle" x="143" y="138">Prompt examples</text>
      <text className="lesson-visual-small" textAnchor="middle" x="143" y="166">Visible to the model</text>

      <rect className="lesson-visual-block" height="232" rx="24" width="284" x="330" y="98" />
      <text className="lesson-visual-label" textAnchor="middle" x="472" y="138">Development loop</text>
      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="56" rx="13" width="210" x="367" y="160" />
      <text className="lesson-visual-small" textAnchor="middle" x="472" y="194">Run development cases</text>
      <line className="lesson-visual-arrow" markerEnd="url(#prompt-evaluation-visual-arrow)" x1="472" x2="472" y1="224" y2="248" />
      <rect className="lesson-visual-panel lesson-visual-panel-green" height="56" rx="13" width="210" x="367" y="262" />
      <text className="lesson-visual-small" textAnchor="middle" x="472" y="296">Inspect and revise</text>
      <path className="lesson-visual-loop" d="M590 290 C650 290, 650 188, 590 188" />

      <line className="lesson-visual-arrow" markerEnd="url(#prompt-evaluation-visual-arrow)" x1="632" x2="696" y1="214" y2="214" />
      <rect className="lesson-visual-panel lesson-visual-panel-coral" height="132" rx="19" width="214" x="714" y="148" />
      <text className="lesson-visual-label" textAnchor="middle" x="821" y="184">Held out cases</text>
      <text className="lesson-visual-small" textAnchor="middle" x="821" y="218">Run after selection</text>
      <text className="lesson-visual-small" textAnchor="middle" x="821" y="246">Report limitations</text>

      <line className="lesson-visual-arrow" markerEnd="url(#prompt-evaluation-visual-arrow)" x1="238" x2="312" y1="147" y2="147" />
      <text className="lesson-visual-note" textAnchor="middle" x="480" y="405">Do not move held out failures into the prompt to improve the reported score.</text>
      <text className="lesson-visual-note lesson-visual-note-muted" textAnchor="middle" x="480" y="444">Record prompt, model, provider, cases, checks, latency, and remaining failures.</text>
    </VisualFrame>
  );
}

function Phase2WorkflowVisual() {
  return (
    <VisualFrame
      caption="The Phase 2 project uses two bounded model calls with deterministic authorization, context selection, and validation between them."
      description="A customer message is interpreted by one model call. Application code validates and selects context. A second model call writes a response that is validated before display."
      id="phase2-workflow-visual"
      title="Customer Support Response Assistant"
    >
      <text className="lesson-visual-kicker" x="54" y="60">FIXED TWO CALL APPLICATION WORKFLOW</text>
      <rect className="lesson-visual-panel" height="88" rx="17" width="158" x="38" y="174" />
      <text className="lesson-visual-label" textAnchor="middle" x="117" y="207">Customer</text>
      <text className="lesson-visual-small" textAnchor="middle" x="117" y="236">Support message</text>
      <line className="lesson-visual-arrow" markerEnd="url(#phase2-workflow-visual-arrow)" x1="210" x2="254" y1="218" y2="218" />

      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="118" rx="19" width="184" x="272" y="158" />
      <text className="lesson-visual-label" textAnchor="middle" x="364" y="194">Model call 01</text>
      <text className="lesson-visual-small" textAnchor="middle" x="364" y="226">Interpret request</text>
      <text className="lesson-visual-small" textAnchor="middle" x="364" y="251">Return typed fields</text>
      <line className="lesson-visual-arrow" markerEnd="url(#phase2-workflow-visual-arrow)" x1="470" x2="510" y1="218" y2="218" />

      <rect className="lesson-visual-block" height="236" rx="23" width="198" x="528" y="100" />
      <text className="lesson-visual-label" textAnchor="middle" x="627" y="140">Application code</text>
      <text className="lesson-visual-small" textAnchor="middle" x="627" y="179">Validate request</text>
      <text className="lesson-visual-small" textAnchor="middle" x="627" y="211">Authorize order</text>
      <text className="lesson-visual-small" textAnchor="middle" x="627" y="243">Select context</text>
      <text className="lesson-visual-small" textAnchor="middle" x="627" y="275">Check budget</text>
      <text className="lesson-visual-small" textAnchor="middle" x="627" y="307">Record decisions</text>

      <line className="lesson-visual-arrow" markerEnd="url(#phase2-workflow-visual-arrow)" x1="742" x2="780" y1="218" y2="218" />
      <rect className="lesson-visual-panel lesson-visual-panel-green" height="118" rx="19" width="152" x="798" y="158" />
      <text className="lesson-visual-label" textAnchor="middle" x="874" y="194">Model call 02</text>
      <text className="lesson-visual-small" textAnchor="middle" x="874" y="226">Write from</text>
      <text className="lesson-visual-small" textAnchor="middle" x="874" y="251">approved evidence</text>

      <path className="lesson-visual-sketch-line" d="M117 338 C282 384, 442 350, 627 382 S810 350, 874 382" />
      <text className="lesson-visual-note" textAnchor="middle" x="480" y="432">Validate the final response before it reaches the customer.</text>
      <text className="lesson-visual-note lesson-visual-note-muted" textAnchor="middle" x="480" y="466">The model never owns identity, source access, or business actions.</text>
    </VisualFrame>
  );
}

function ValidationLayersVisual() {
  return (
    <VisualFrame
      caption="Validation proceeds from provider completion to schema, evidence, and application rules. A result must pass every layer before the application accepts it."
      description="A model response passes through four validation layers. Any failed layer follows a safe failure path instead of reaching the customer."
      id="validation-layers-visual"
      title="Layered output validation"
    >
      <text className="lesson-visual-kicker" x="58" y="62">OUTPUT VALIDATION PATH</text>
      <rect className="lesson-visual-panel" height="90" rx="18" width="168" x="40" y="176" />
      <text className="lesson-visual-label" textAnchor="middle" x="124" y="210">Model result</text>
      <text className="lesson-visual-small" textAnchor="middle" x="124" y="238">Untrusted output</text>
      <line className="lesson-visual-arrow" markerEnd="url(#validation-layers-visual-arrow)" x1="222" x2="270" y1="221" y2="221" />

      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="90" rx="18" width="144" x="288" y="176" />
      <text className="lesson-visual-label" textAnchor="middle" x="360" y="207">01 Completion</text>
      <text className="lesson-visual-small" textAnchor="middle" x="360" y="237">Not truncated</text>
      <line className="lesson-visual-arrow" markerEnd="url(#validation-layers-visual-arrow)" x1="446" x2="478" y1="221" y2="221" />

      <rect className="lesson-visual-panel lesson-visual-panel-yellow" height="90" rx="18" width="144" x="496" y="176" />
      <text className="lesson-visual-label" textAnchor="middle" x="568" y="207">02 Schema</text>
      <text className="lesson-visual-small" textAnchor="middle" x="568" y="237">Types and fields</text>
      <line className="lesson-visual-arrow" markerEnd="url(#validation-layers-visual-arrow)" x1="654" x2="686" y1="221" y2="221" />

      <rect className="lesson-visual-panel lesson-visual-panel-green" height="90" rx="18" width="144" x="704" y="176" />
      <text className="lesson-visual-label" textAnchor="middle" x="776" y="207">03 Evidence</text>
      <text className="lesson-visual-small" textAnchor="middle" x="776" y="237">Known sources</text>
      <line className="lesson-visual-arrow" markerEnd="url(#validation-layers-visual-arrow)" x1="776" x2="776" y1="280" y2="318" />

      <rect className="lesson-visual-panel lesson-visual-panel-coral" height="90" rx="18" width="220" x="666" y="334" />
      <text className="lesson-visual-label" textAnchor="middle" x="776" y="366">04 Application rules</text>
      <text className="lesson-visual-small" textAnchor="middle" x="776" y="396">Claims and permissions</text>
      <path className="lesson-visual-sketch-line" d="M288 322 C408 358, 510 312, 624 350" />
      <text className="lesson-visual-note" x="62" y="392">Any failure returns a safe outcome</text>
      <text className="lesson-visual-note lesson-visual-note-muted" x="62" y="426">and records the failed stage.</text>
    </VisualFrame>
  );
}

function ConversationSelectionVisual() {
  return (
    <VisualFrame
      caption="Conversation selection keeps the current request and relevant correction while omitting turns tied only to an abandoned identifier."
      description="Four conversation turns are reviewed for a corrected order request. Relevant turns are selected and an unrelated order turn is excluded."
      id="conversation-selection-visual"
      title="Selecting conversation history"
    >
      <text className="lesson-visual-kicker" x="58" y="62">CONVERSATION CONTEXT</text>
      <rect className="lesson-visual-panel" height="56" rx="13" width="270" x="48" y="102" />
      <text className="lesson-visual-small" x="72" y="136">01 Customer asks about 10492</text>
      <rect className="lesson-visual-panel" height="56" rx="13" width="270" x="48" y="178" />
      <text className="lesson-visual-small" x="72" y="212">02 Assistant discusses 10492</text>
      <rect className="lesson-visual-panel lesson-visual-panel-yellow" height="56" rx="13" width="270" x="48" y="254" />
      <text className="lesson-visual-small" x="72" y="288">03 Customer corrects to 10429</text>
      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="56" rx="13" width="270" x="48" y="330" />
      <text className="lesson-visual-small" x="72" y="364">04 Current damaged item request</text>

      <line className="lesson-visual-arrow" markerEnd="url(#conversation-selection-visual-arrow)" x1="336" x2="398" y1="244" y2="244" />
      <rect className="lesson-visual-block" height="218" rx="23" width="212" x="416" y="136" />
      <text className="lesson-visual-label" textAnchor="middle" x="522" y="178">Selection rules</text>
      <text className="lesson-visual-small" textAnchor="middle" x="522" y="218">Current task</text>
      <text className="lesson-visual-small" textAnchor="middle" x="522" y="250">Correction</text>
      <text className="lesson-visual-small" textAnchor="middle" x="522" y="282">Relevant order</text>
      <text className="lesson-visual-small" textAnchor="middle" x="522" y="314">Token budget</text>

      <line className="lesson-visual-arrow" markerEnd="url(#conversation-selection-visual-arrow)" x1="646" x2="702" y1="202" y2="202" />
      <rect className="lesson-visual-panel lesson-visual-panel-green" height="100" rx="17" width="206" x="720" y="144" />
      <text className="lesson-visual-label" textAnchor="middle" x="823" y="178">Selected</text>
      <text className="lesson-visual-small" textAnchor="middle" x="823" y="210">Turns 03 and 04</text>
      <line className="lesson-visual-arrow lesson-visual-arrow-return" markerEnd="url(#conversation-selection-visual-arrow)" x1="702" x2="646" y1="316" y2="316" />
      <rect className="lesson-visual-panel lesson-visual-panel-coral" height="82" rx="17" width="206" x="720" y="280" />
      <text className="lesson-visual-label" textAnchor="middle" x="823" y="314">Excluded</text>
      <text className="lesson-visual-small" textAnchor="middle" x="823" y="342">Abandoned order context</text>
      <text className="lesson-visual-note" textAnchor="middle" x="480" y="446">Conversation history is selected runtime context, not persistent model memory.</text>
    </VisualFrame>
  );
}

function TrustBoundaryVisual() {
  return (
    <VisualFrame
      caption="Untrusted text may propose identifiers and content, but application code supplies identity, authorizes records, and limits accepted output."
      description="Customer text crosses into a model task. The application validates the proposed identifier against trusted identity and data before approved evidence reaches a response model."
      id="trust-boundary-visual"
      title="Application trust boundaries"
    >
      <text className="lesson-visual-kicker" x="58" y="62">TRUST BOUNDARIES</text>
      <rect className="lesson-visual-panel lesson-visual-panel-coral" height="132" rx="20" width="208" x="46" y="142" />
      <text className="lesson-visual-label" textAnchor="middle" x="150" y="180">Untrusted input</text>
      <text className="lesson-visual-small" textAnchor="middle" x="150" y="215">Customer message</text>
      <text className="lesson-visual-small" textAnchor="middle" x="150" y="244">Retrieved text</text>

      <line className="lesson-visual-arrow" markerEnd="url(#trust-boundary-visual-arrow)" x1="272" x2="326" y1="208" y2="208" />
      <rect className="lesson-visual-panel lesson-visual-panel-blue" height="132" rx="20" width="190" x="344" y="142" />
      <text className="lesson-visual-label" textAnchor="middle" x="439" y="180">Model proposal</text>
      <text className="lesson-visual-small" textAnchor="middle" x="439" y="215">Intent and ID</text>
      <text className="lesson-visual-small" textAnchor="middle" x="439" y="244">No authority</text>

      <line className="lesson-visual-arrow" markerEnd="url(#trust-boundary-visual-arrow)" x1="552" x2="606" y1="208" y2="208" />
      <rect className="lesson-visual-block" height="250" rx="23" width="276" x="624" y="84" />
      <text className="lesson-visual-label" textAnchor="middle" x="762" y="126">Trusted application controls</text>
      <rect className="lesson-visual-panel lesson-visual-panel-yellow" height="48" rx="11" width="214" x="655" y="150" />
      <text className="lesson-visual-small" textAnchor="middle" x="762" y="180">Authenticated identity</text>
      <rect className="lesson-visual-panel lesson-visual-panel-green" height="48" rx="11" width="214" x="655" y="216" />
      <text className="lesson-visual-small" textAnchor="middle" x="762" y="246">Authorized data source</text>
      <text className="lesson-visual-small" textAnchor="middle" x="762" y="300">Schema and domain checks</text>

      <path className="lesson-visual-sketch-line" d="M70 362 C252 326, 416 392, 602 354 S790 338, 884 370" />
      <text className="lesson-visual-note" textAnchor="middle" x="480" y="420">Prompts describe the boundary. Application code enforces it.</text>
      <text className="lesson-visual-note lesson-visual-note-muted" textAnchor="middle" x="480" y="454">A model response is untrusted until the intended sink validates it.</text>
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
    case "prompt-engineering:anatomy-of-a-prompt":
      return <PromptBoundaryVisual />;
    case "context-engineering:context-budgets":
      return <ContextBudgetVisual />;
    case "context-engineering:source-selection-and-provenance":
      return <ContextAssemblyVisual />;
    case "prompt-evaluation:evaluation-datasets":
      return <PromptEvaluationVisual />;
    case "customer-support-response-assistant:project-architecture":
      return <Phase2WorkflowVisual />;
    case "customer-support-response-assistant:second-model-call":
      return <ValidationLayersVisual />;
    case "context-engineering:conversation-history":
      return <ConversationSelectionVisual />;
    case "prompt-injection-and-trust-boundaries:trust-boundaries":
      return <TrustBoundaryVisual />;
    default:
      return null;
  }
}
