export type LessonCodeExample = {
  afterParagraph?: number;
  code: string;
  description?: string;
  file: string;
  intent?: "practice";
  title: string;
};

const examples: Record<string, Record<string, LessonCodeExample[]>> = {
  "using-llm-apis-and-langchain": {
    "provider-sdks": [
      {
        title: "Call the Responses API directly",
        file: "provider_sdk.py",
        description: "The provider SDK exposes the request and the parsed provider response without another framework in between.",
        code: `from openai import OpenAI

client = OpenAI(timeout=20, max_retries=2)

response = client.responses.parse(
    model=model,
    instructions=ANALYZER_INSTRUCTIONS,
    input=customer_message,
    text_format=SupportRequest,
    max_output_tokens=250,
)

analysis = response.output_parsed
if analysis is None:
    raise ValueError("The model did not return a parsed support request")`
      }
    ],
    "structured-output": [
      {
        title: "Define the application contract",
        file: "shared.py",
        description: "Pydantic validates the shape of the model result. It does not verify that an extracted order exists.",
        code: `class SupportRequest(BaseModel):
    issue_type: Literal[
        "order_status", "damaged_item", "refund", "other"
    ]
    order_id: str | None = Field(
        description="A five digit order number when present, otherwise null",
        pattern=r"^\\d{5}$",
    )
    needs_order_data: bool
    missing_details: list[str]`
      }
    ],
    "streaming-and-cancellation": [
      {
        title: "Measure the first streamed text",
        file: "provider_sdk.py",
        description: "This excerpt is inside stream_explanation, where client, model, and analysis are function inputs. The first text event establishes time to first token. The final response supplies usage and completion metadata.",
        code: `from time import perf_counter

from customer_service_lab.shared import ModelCallMetrics

call = ModelCallMetrics(
    name="stream_support_explanation",
    model=model,
    prompt_version="support-explanation.provider.v1",
    configured_output_budget_tokens=180,
)
started = perf_counter()

with client.responses.stream(
    model=model,
    instructions=EXPLANATION_INSTRUCTIONS,
    input=analysis.model_dump_json(),
    max_output_tokens=180,
) as stream:
    for event in stream:
        if event.type != "response.output_text.delta":
            continue
        if call.ttft_ms is None:
            call.ttft_ms = round((perf_counter() - started) * 1000, 1)
        print(event.delta, end="", flush=True)

    response = stream.get_final_response()`
      }
    ],
    "langchain-model-operations": [
      {
        title: "Run the same analyzer through LangChain",
        file: "langchain_analyzer.py",
        description: "ChatOpenAI standardizes model operations while the application keeps the provider model and metadata visible.",
        code: `model = ChatOpenAI(
    model=model_name,
    timeout=20,
    max_retries=2,
    stream_usage=True,
    use_responses_api=True,
)

structured_model = model.with_structured_output(
    SupportRequest,
    method="json_schema",
    include_raw=True,
)

result = structured_model.invoke([
    SystemMessage(content=ANALYZER_INSTRUCTIONS),
    HumanMessage(content=customer_message),
])

analysis = result["parsed"]`
      },
      {
        title: "Stream through the common model interface",
        file: "langchain_analyzer.py",
        code: `for chunk in model.stream([
    SystemMessage(content=EXPLANATION_INSTRUCTIONS),
    HumanMessage(content=analysis.model_dump_json()),
]):
    text = chunk.text
    if text:
        print(text, end="", flush=True)`
      }
    ],
    "local-models-with-ollama": [
      {
        title: "Run the analyzer through a local Ollama model",
        file: "ollama_analyzer.py",
        description: "The native Ollama client receives an explicit JSON contract. The local model returns JSON, and Pydantic validates it before the application uses the result.",
        code: `from ollama import Client

client = Client(host="http://localhost:11434")

response = client.chat(
    model="qwen3:14b",
    messages=[
        {"role": "system", "content": ANALYZER_INSTRUCTIONS},
        {"role": "user", "content": customer_message},
    ],
    options={"num_predict": 250, "temperature": 0},
    think=False,
)

analysis = SupportRequest.model_validate_json(response.message.content)`
      }
    ],
    "build-support-request-analyzer": [
      {
        title: "Step 01 Install uv and Python on macOS",
        file: "macOS Terminal",
        intent: "practice",
        afterParagraph: 1,
        description: "Use the official uv installer, reopen Terminal if needed, and let uv install Python 3.12.",
        code: `git --version
curl -LsSf https://astral.sh/uv/install.sh | sh
uv --version
uv python install 3.12`
      },
      {
        title: "Step 01 Install uv and Python on Windows",
        file: "Windows PowerShell",
        intent: "practice",
        afterParagraph: 1,
        description: "Use the official uv installer, reopen PowerShell if needed, and let uv install Python 3.12.",
        code: `git --version
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
uv --version
uv python install 3.12`
      },
      {
        title: "Step 02 Clone Agentic AI Lab",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "Clone the public repository with HTTPS and enter its root directory.",
        code: `git clone https://github.com/chaitanya-y/agentic-ai-lab.git
cd agentic-ai-lab`
      },
      {
        title: "Step 03 Prepare the lab on macOS",
        file: "macOS Terminal",
        intent: "practice",
        afterParagraph: 3,
        description: "Enter the lab, create the local environment file, and install dependencies with Python 3.12.",
        code: `cd labs/01-llm-fundamentals/customer-service-agent
cp .env.example .env
uv sync --python 3.12`
      },
      {
        title: "Step 03 Prepare the lab on Windows",
        file: "Windows PowerShell",
        intent: "practice",
        afterParagraph: 3,
        description: "Enter the lab, create the local environment file, and install dependencies with Python 3.12.",
        code: `cd labs/01-llm-fundamentals/customer-service-agent
Copy-Item .env.example .env
uv sync --python 3.12`
      },
      {
        title: "Step 04 Configure OpenAI",
        file: ".env",
        intent: "practice",
        afterParagraph: 4,
        description: "Use this configuration for the provider SDK and LangChain examples. The .env file is ignored by Git and must remain local.",
        code: `OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.4-mini
CUSTOMER_MESSAGE=Where is order 10492? It was supposed to arrive yesterday.`
      },
      {
        title: "Step 04 Configure Ollama",
        file: ".env",
        intent: "practice",
        afterParagraph: 4,
        description: "Use this configuration for the local Ollama example. No OpenAI API key is required.",
        code: `OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen3:14b
CUSTOMER_MESSAGE=Where is order 10492? It was supposed to arrive yesterday.`
      },
      {
        title: "Step 07 Run the provider SDK",
        file: "Terminal",
        intent: "practice",
        afterParagraph: 7,
        description: "Run the direct SDK path only after reading shared.py and provider_sdk.py in the order described above.",
        code: `uv run python -m customer_service_lab.provider_sdk`
      },
      {
        title: "Step 10 Run the LangChain implementation",
        file: "Terminal",
        intent: "practice",
        afterParagraph: 10,
        description: "Use the same environment values so the comparison changes the integration rather than the task.",
        code: `uv run python -m customer_service_lab.langchain_analyzer`
      },
      {
        title: "Step 11 Download qwen3:14b",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 11,
        description: "Install the Ollama application from ollama.com/download before running this command. The first download is approximately 9.3 GB.",
        code: `ollama pull qwen3:14b`
      },
      {
        title: "Step 12 Run the Ollama implementation",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 12,
        description: "Run the same analyzer against the local Ollama service with the same customer message.",
        code: `uv run python -m customer_service_lab.ollama_analyzer`
      }
    ],
    "testing-the-analyzer": [
      {
        title: "Run the Section 5 tests",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 1,
        description: "Run this command from labs/01-llm-fundamentals/customer-service-agent. It uses no API key and makes no model calls.",
        code: `uv run pytest tests/test_shared.py tests/test_ollama_analyzer.py`
      }
    ]
  },
  "building-a-basic-agent-with-langchain": {
    "model-configuration": [
      {
        title: "Create the selected LangChain model",
        file: "agent.py",
        description: "Provider specific settings stay in one factory. The remaining agent code receives the same LangChain chat model interface.",
        code: `provider = os.getenv("MODEL_PROVIDER", "openai").lower()

if provider == "openai":
    model = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-5.4-mini"),
        max_tokens=AGENT_OUTPUT_BUDGET,
    )
elif provider == "ollama":
    model = ChatOllama(
        model=os.getenv("OLLAMA_MODEL", "qwen3:14b"),
        base_url=os.getenv("OLLAMA_HOST", "http://localhost:11434"),
        num_predict=AGENT_OUTPUT_BUDGET,
        temperature=0,
        reasoning=False,
    )`
      }
    ],
    "agent-boundary": [
      {
        title: "Describe one read only tool",
        file: "agent.py",
        description: "The model sees the tool schema. The application supplies the authenticated customer identity separately.",
        code: `class LookupOrder(BaseModel):
    """Look up the current status of one order."""

    order_id: str = Field(
        description="The five digit order number supplied by the customer"
    )

    @field_validator("order_id")
    @classmethod
    def require_five_digits(cls, value: str) -> str:
        if len(value) != 5 or not value.isdigit():
            raise ValueError("order_id must contain five digits")
        return value`
      }
    ],
    "first-model-call": [
      {
        title: "Let the model propose the next step",
        file: "agent.py",
        description: "Binding a tool gives the model a choice. It does not execute the Python function.",
        code: `model_with_tools = model.bind_tools(
    [LookupOrder],
    strict=True,
    tool_choice="auto",
)

decision = stream_decision(
    model_with_tools,
    messages,
    model_name,
    trace,
)`
      }
    ],
    "tool-validation-and-authorization": [
      {
        title: "Validate first and authorize inside the application",
        file: "agent.py",
        code: `proposed_call = decision.tool_calls[0]
arguments = LookupOrder.model_validate(proposed_call.get("args"))

order = store.lookup(
    authenticated_customer_id,
    arguments.order_id,
)

messages.append(ToolMessage(
    content=order.model_dump_json(),
    tool_call_id=proposed_call["id"],
))`
      }
    ],
    "second-model-call": [
      {
        title: "Validate the final customer response",
        file: "agent.py",
        description: "The second call explains the limited tool result through a response contract owned by the application.",
        code: `structured_model = model.with_structured_output(
    CustomerReply,
    method="function_calling",
    include_raw=True,
)

result = structured_model.invoke(messages)
if result.get("parsing_error") or result.get("parsed") is None:
    raise ValueError("The final response did not pass validation")

reply = result["parsed"]`
      },
      {
        title: "Validate the local JSON response",
        file: "agent.py",
        description: "qwen3:14b receives an explicit JSON instruction because it may return normal text instead of the requested CustomerReply tool call.",
        code: `raw = model.invoke([
    *messages,
    HumanMessage(content=OLLAMA_REPLY_INSTRUCTIONS),
])

reply = CustomerReply.model_validate_json(raw.text)`
      }
    ],
    "execution-limits-and-tracing": [
      {
        title: "Keep the execution limits visible",
        file: "agent.py",
        code: `MAX_MODEL_CALLS = 2
MAX_TOOL_CALLS = 1

while model_calls < MAX_MODEL_CALLS and final_reply is None:
    if model_calls == 0:
        model_with_tools = model.bind_tools([LookupOrder], strict=True)
        decision = stream_decision(model_with_tools, messages, model_name, trace)
        model_calls += 1
        messages.append(decision)
    else:
        final_reply = create_final_reply(model, messages, model_name, trace)
        model_calls += 1`
      },
      {
        title: "Record operational facts without customer content",
        file: "shared.py",
        code: `@dataclass
class ModelCallMetrics:
    name: str
    model: str
    prompt_version: str
    configured_output_budget_tokens: int | None = None
    configured_retry_limit: int | None = None
    provider_request_id: str | None = None
    usage: TokenUsage = field(default_factory=TokenUsage)
    ttft_ms: float | None = None
    latency_ms: float | None = None
    stop_reason: str | None = None
    validation_result: str | None = None
    error: str | None = None`
      }
    ],
    "testing": [
      {
        title: "Test authorization without an API call",
        file: "tests/test_agent.py",
        description: "Deterministic model doubles let the safety boundary run in a normal unit test without spending tokens.",
        code: `reply, trace = run_agent(
    model=fake_model,
    model_name="test-model",
    customer_message="Where is order 10492?",
    authenticated_customer_id="another_customer",
    order_store=OrderStore(),
)

assert reply.order_verified is False
        assert trace.authorization_result == "not_authorized_or_not_found"
assert "In transit" not in reply.message`
      },
      {
        title: "Run the Section 6 tests",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 1,
        description: "Run this command from labs/01-llm-fundamentals/customer-service-agent. The model doubles make an API key and a running Ollama model unnecessary.",
        code: `uv run pytest tests/test_agent.py`
      }
    ],
    "run-the-agent": [
      {
        title: "Step 01 Enter the lab folder",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 1,
        description: "Run this from the root folder of the cloned Agentic AI Lab repository.",
        code: `cd labs/01-llm-fundamentals/customer-service-agent`
      },
      {
        title: "Step 02 Install the lab dependencies",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 2,
        description: "uv creates or updates the lab environment from the locked dependencies.",
        code: `uv sync --python 3.12`
      },
      {
        title: "Step 04 Configure the OpenAI route",
        file: ".env",
        intent: "practice",
        afterParagraph: 4,
        description: "Create this file from .env.example first. This route requires an OpenAI API key and makes paid requests.",
        code: `MODEL_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.4-mini
CUSTOMER_MESSAGE=Where is order 10492?`
      },
      {
        title: "Step 05 Run the agent",
        file: "Terminal or PowerShell",
        intent: "practice",
        afterParagraph: 5,
        description: "Run this command from the customer-service-agent folder.",
        code: `uv run python -m customer_service_lab.agent`
      },
      {
        title: "Step 06 Configure the Ollama route",
        file: ".env",
        intent: "practice",
        afterParagraph: 6,
        description: "Change only these provider settings, save .env, and run the same module command again.",
        code: `MODEL_PROVIDER=ollama
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen3:14b

uv run python -m customer_service_lab.agent`
      }
    ]
  }
};

export function getLessonCodeExamples(lessonSlug: string, sectionId: string) {
  return examples[lessonSlug]?.[sectionId] ?? [];
}
