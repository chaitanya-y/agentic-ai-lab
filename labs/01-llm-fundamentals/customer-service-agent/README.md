# Customer Service Agent

This lab introduces one small customer service problem in four steps. You will
first call OpenAI directly, then rebuild the same model interaction with
LangChain, run the same analyzer locally with Ollama and qwen3:14b, and finally
add one read only tool inside an application controlled agent loop.

The examples are intentionally small. They show the boundaries before later
lessons add retrieval, memory, workflow state, and multiple tools.

## What you will build

The starting request is:

> Where is order 10492? It was supposed to arrive yesterday.

The four examples are:

1. A Support Request Analyzer built with the OpenAI Responses API. It returns a
   validated Pydantic object and streams a short explanation.
2. The same analyzer built with `ChatOpenAI`, messages, `invoke`, `stream`, and
   `with_structured_output`.
3. The same analyzer built with the native Ollama client and the local
   `qwen3:14b` model.
4. A LangChain Customer Service Agent that can use OpenAI or local Ollama and
   may call one local order lookup tool before returning a validated response.

This lesson uses only the LangChain components needed for model calls and a
basic tool using agent. The Retrieval Augmented Generation lessons introduce
documents, loaders, text splitters, embeddings, vector stores, and retrievers
when those components become useful.

## Local setup

Install Git first. Then install [uv](https://docs.astral.sh/uv/getting-started/installation/)
with the official installer for your operating system.

macOS Terminal:

```bash
git --version
curl -LsSf https://astral.sh/uv/install.sh | sh
uv python install 3.12
```

Windows PowerShell:

```powershell
git --version
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
uv python install 3.12
```

Reopen the terminal if `uv` is not immediately available. uv manages Python for
this lab, so a separate Python installer is not required.

Clone the repository:

```bash
git clone https://github.com/chaitanya-y/agentic-ai-lab.git
cd agentic-ai-lab
```

On macOS, prepare the lab with:

```bash
cd labs/01-llm-fundamentals/customer-service-agent
cp .env.example .env
uv sync --python 3.12
```

On Windows PowerShell, prepare the lab with:

```powershell
cd labs/01-llm-fundamentals/customer-service-agent
Copy-Item .env.example .env
uv sync --python 3.12
```

For the OpenAI SDK and LangChain examples, add an OpenAI API key to `.env`.
For the local Ollama example, the defaults are already present:

```text
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen3:14b
```

You can also change the model, customer message, or demo customer identifier
there.

The agent uses `MODEL_PROVIDER` to select its LangChain model integration:

```text
MODEL_PROVIDER=openai
```

Change it to `ollama` to run the same agent with the local model. Do not infer
the provider from the model name. Keeping the provider explicit makes the
configuration easier to understand and extend.

## Optional local Ollama route

Install [Ollama](https://ollama.com/download) for macOS or Windows, then pull
the local model. The initial `qwen3:14b` download is approximately 9.3 GB.
If it does not run comfortably on your computer, continue with the hosted
examples. Local execution is optional for this lesson.

```bash
ollama pull qwen3:14b
uv run python -m customer_service_lab.ollama_analyzer
```

Ollama does not require an OpenAI API key, but application data controls still
apply. Decide what data reaches the local model and avoid placing sensitive
customer records in ordinary logs.

## Run the examples

Direct OpenAI SDK:

```bash
uv run python -m customer_service_lab.provider_sdk
```

The same analyzer with LangChain:

```bash
uv run python -m customer_service_lab.langchain_analyzer
```

The same analyzer with local Ollama:

```bash
uv run python -m customer_service_lab.ollama_analyzer
```

The bounded Customer Service Agent:

```bash
uv run python -m customer_service_lab.agent
```

For the OpenAI agent route, use:

```text
MODEL_PROVIDER=openai
OPENAI_MODEL=gpt-5.4-mini
```

For the local agent route, use:

```text
MODEL_PROVIDER=ollama
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen3:14b
```

Only the LangChain model configuration changes. The agent loop, tool,
authorization, validation, execution limits, and tests remain the same.

The OpenAI commands make paid API calls. The Ollama command uses the local
computer and does not require an OpenAI API key. Start with the default request
and inspect the response and run metadata before trying your own request.

## The agent boundary

The model can propose `LookupOrder` with an order number. The application then
validates the arguments, applies the authenticated customer identity, checks
access, and executes the lookup. The model never chooses the authenticated
identity and never executes the tool itself.

The loop permits no more than two model calls and one tool call. A missing
order number ends after the first model call:

```text
Customer request
      ↓
Model chooses the next action
      ↓
Application validates and authorizes one optional lookup
      ↓
Model writes a validated customer response
```

The local order store is deliberately small. It represents a service boundary,
not a production database.

## What the examples measure

The run metadata includes the local trace identifier, prompt version, requested
model, provider request identifier when available, configured output budget,
token usage, cached input tokens when reported, time to first output, model
latency, tool latency, total latency, model and tool call counts, argument
validation, authorization result, step count, stop reason, and safe error names.

Structured calls complete before Pydantic validation can return a value, so
their time to first token is reported as `null`. Streaming calls measure it.
Prompt text, customer identity, proposed order number, and complete tool output
are not copied into operational metadata.

## Test without API calls

The tests use deterministic model doubles and the local order store. They do
not require a key and do not make paid requests.

```bash
uv run pytest
```

Try changing the test customer identity or the tool arguments to see where the
application stops an unsafe request.
