# Customer Support Response Assistant

This Phase 2 lab shows how prompts, selected context, trust boundaries, and evaluation fit inside one AI application. The application handles order status, damaged item, and refund questions using synthetic customer data.

The workflow is deliberately fixed. One model call interprets the customer message. Application code then validates the result and selects permitted evidence. A second model call writes a response from that evidence. The model cannot retrieve arbitrary records, approve actions, or change application permissions.

## What you will practise

You will work with the same application throughout Phase 2.

1. Compare a baseline prompt with a revised prompt.
2. Add a small set of demonstrations and test whether they help.
3. Validate model output with Pydantic contracts.
4. Assemble relevant order, policy, and conversation context within a budget.
5. Keep customer text and retrieved content outside the instruction boundary.
6. Score development and held out cases with deterministic checks.
7. Inspect model calls, selected evidence, exclusions, validation stages, and latency.

The fixtures and evaluation cases are synthetic. They demonstrate engineering methods and are not evidence that the application is ready for production.

## Local setup

Install Git and [uv](https://docs.astral.sh/uv/getting-started/installation/). Python 3.12 is recommended. The project supports Python 3.11 or newer, but the instructions and examples are tested with Python 3.12.

On macOS, install uv with the official installer.

```bash
git --version
curl -LsSf https://astral.sh/uv/install.sh | sh
```

On Windows PowerShell, install uv with the official installer.

```powershell
git --version
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

If `uv` is already installed, the installer updates or confirms the existing installation. Reopen the terminal if the command is not immediately available.

Clone the repository and enter the lab.

```bash
git clone https://github.com/chaitanya-y/agentic-ai-lab.git
cd agentic-ai-lab/labs/02-prompt-context-engineering/customer-support-assistant
```

On macOS, prepare the environment.

```bash
cp .env.example .env
uv sync --python 3.12
```

On Windows PowerShell, prepare the environment.

```powershell
Copy-Item .env.example .env
uv sync --python 3.12
```

## Choose a model

OpenAI is the hosted option. Put your API key in `.env`, keep the provider set to `openai`, and explicitly allow paid calls.

```text
MODEL_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.4-mini
ALLOW_PAID_API_CALLS=true
```

The program refuses an OpenAI request while `ALLOW_PAID_API_CALLS` is false. This prevents an accidental paid run during setup or testing.

Ollama is the optional local route. Install [Ollama](https://ollama.com/download), pull the model once, and change the provider in `.env`.

```bash
ollama pull qwen3:14b
```

```text
MODEL_PROVIDER=ollama
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen3:14b
ALLOW_PAID_API_CALLS=false
```

The initial model download is large and local inference requires suitable memory. You do not need a local model to complete this phase.

## Read the code in order

Start with `src/support_assistant/models.py`. It defines the input, context, response, and trace contracts.

Next read `src/support_assistant/prompt_practice.py`. It defines the small prompt template contract used in Prompt Engineering and the deterministic response checks used in Prompt Evaluation. Prompt exercises use `practice/prompt_starter.py` and `practice/prompt_answers.py`. Evaluation exercises use `practice/evaluation_starter.py` and `practice/evaluation_answers.py`.

Then read `src/support_assistant/prompts.py`. It contains the baseline, revised, and few shot prompt variants. Customer input remains a separate message rather than being joined to system instructions.

Then read `src/support_assistant/context_practice.py`. It introduces input and output budgets, required and optional components, priority based allocation, and citation checks. Continue with `src/support_assistant/context.py`. It authenticates the synthetic order, selects current customer facing policies, chooses relevant conversation turns, records exclusions, and checks the complete request budget.

Read `src/support_assistant/validation.py` next. These checks reject unknown evidence, unsupported order claims, incomplete output, and claims that a refund or replacement has already been completed.

Finally read `src/support_assistant/workflow.py`. This file connects the two model calls to deterministic application code. Provider setup is isolated in `src/support_assistant/providers.py`. Evaluation code is in `src/support_assistant/evaluation.py`.

## Complete the prompt exercises

Read the Prompt Engineering exercise instructions and complete `practice/prompt_starter.py`.

```bash
uv run python practice/prompt_starter.py
```

Compare your implementation with the worked answers after attempting the exercises.

```bash
uv run python practice/prompt_answers.py
```

The three exercises cover prompt instructions, templates, and variable validation. They run locally without OpenAI or Ollama requests.

## Complete the prompt evaluation exercises

Read the Prompt Evaluation exercise instructions and complete `practice/evaluation_starter.py`.

```bash
uv run python practice/evaluation_starter.py
```

Compare your implementation with the worked answers after attempting the exercises.

```bash
uv run python practice/evaluation_answers.py
```

The exercise scores and compares supplied responses with deterministic criteria. It runs locally without OpenAI or Ollama requests.

## Complete the context exercises

Read the Context Engineering exercise instructions and complete `practice/context_starter.py`.

```bash
uv run python practice/context_starter.py
```

Compare your implementation with the worked answers after attempting the exercises.

```bash
uv run python practice/context_answers.py
```

These exercises allocate context components, inspect policy exclusions, select corrected conversation history, and validate citation identifiers. They are deterministic and make no model requests.

## Run one request

Start with the default order status question.

```bash
uv run support-assistant
```

Try a damaged item request.

```bash
uv run support-assistant "Order 10429 arrived with a cracked screen. What should I do?"
```

Compare prompt versions without changing the workflow.

```bash
uv run support-assistant "Where is order 10492?" --prompt-version support-analysis.baseline.v1
uv run support-assistant "Where is order 10492?" --prompt-version support-analysis.revised.v1
uv run support-assistant "Where is order 10492?" --prompt-version support-analysis.few-shot.v1
```

The output shows the customer response, structured request, selected and excluded context, validation stages, model metadata, and total latency. Read the trace before changing a prompt. A better sounding answer is not enough if it used the wrong evidence or failed an application rule.

Conversation fixtures can be included explicitly. This request contains a complete damaged item issue and asks the assistant to use the corrected order number stored in the selected conversation.

```bash
uv run support-assistant "Order 10429 arrived damaged and I want a replacement." --conversation corrected_order
```

Confirm that `turn_correction` appears in the selected context and that information tied only to the earlier order number is excluded.

## Run the tests

The tests use deterministic model doubles and local fixtures. They make no network requests and do not require an API key.

```bash
uv run pytest
```

The test suite covers prompt roles, structured contracts, source filtering, conversation selection, context budgets, trust boundaries, provider failures, workflow outcomes, and evaluation scoring.

## Run a small evaluation

Use development cases while changing prompts.

```bash
uv run support-eval --split development --limit 4
```

Use held out cases only after the prompt choice is fixed.

```bash
uv run support-eval --split held_out --limit 12
```

This command makes live model calls with the selected provider. It writes a report to `.artifacts/evaluation-report.json`. The report records exact checks for issue classification, order extraction, outcome, required evidence, forbidden evidence, and forbidden response phrases. It also records per case token usage and end to end latency, plus aggregate token totals and average latency when those values are available.

The repository starts with 12 development cases and 12 held out cases. Keep prompt demonstrations in `src/support_assistant/prompts.py` separate from both scored sets. Do not move difficult evaluation cases into the prompt merely to improve the reported score.
