# Prompt and Context Engineering Practice

## Prompt Engineering

Complete Exercises 1 through 3 in `starter.py` in order. Each exercise builds on the prompt template from the previous exercise.

Run your work from the Phase 2 lab directory.

```bash
uv run python practice/starter.py
```

When you are ready to compare your implementation with the worked answers, run this command.

```bash
uv run python practice/answers.py
```

The local exercises do not call OpenAI or Ollama. They render prompts and check supplied response text with deterministic Python code.

## Exercise 1

Replace the vague instruction `Reply to this customer` with a bounded order status instruction. Include the allowed source, required facts, word limit, prohibited claims, and unavailable order behavior.

## Exercise 2

Create a `PromptTemplate` named `support_summary`. It must accept `issue_type`, `audience`, and `word_limit`.

## Exercise 3

Render the template with one missing variable and then with one unexpected variable. Confirm that each mistake is reported before any model request.

## Prompt Evaluation

Complete Exercises 4 and 5 after reading the Prompt Evaluation lesson. These exercises use the response criteria and comparison helpers in the same starter and answer files.

### Exercise 4

Create response criteria that require `order 10492` and `in transit`, prohibit `guaranteed`, and limit a response to 20 words. Score one passing response and one failing response.

### Exercise 5

Compare supplied baseline and revised responses under the same criteria. Print the result for each prompt version and explain why the comparison must keep the model configuration unchanged.

## Context Engineering

Complete the exercises in `context_starter.py` in order.

```bash
uv run python practice/context_starter.py
```

Compare your implementation with the worked answers.

```bash
uv run python practice/context_answers.py
```

These exercises make no model calls. They use explicit token counts and the supplied synthetic order, policy, and conversation fixtures.

### Exercise 1

Create a context budget with a 4,000 token window and reserve 500 tokens for the model response. Print the input capacity that remains.

### Exercise 2

Allocate required instructions and the current customer request before optional order data, policy evidence, and older conversation history. Inspect which components fit and which are excluded.

### Exercise 3

Select current customer facing policy sources for a damaged item request. Print every included source and each exclusion reason.

### Exercise 4

Load the corrected order conversation and select history for order 10429. Confirm that a result tied only to the abandoned order does not remain in context.

### Exercise 5

Compare generated citation identifiers with the source identifiers included in the request. Report every unsupported citation.
