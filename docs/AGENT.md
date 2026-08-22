# Investigation Agent Runbook

## Architecture
The LLM Agent uses a mocked provider abstracting OpenAI/Claude functionality, inspired by LangChain execution chains. It relies exclusively on structured outputs.

## Agent Tools
The agent has access to exactly two tools (any future additions should be explicitly marked as *Future Work*):
1. `get_transaction_history(customer_id)`
2. `get_graph_context(entity_id)`

## Output Schema
The Agent outputs structured JSON containing:
- `evidence`: Text synthesis.
- `reason_codes`: Array of valid ENUMs (e.g., `DEVICE_REUSE`).
- `recommendation`: ALLOW, REVIEW, or BLOCK.
- `confidence`: Float 0.0 - 1.0.

> **CRITICAL:** `recommendation != final decision`.

## Evidence Validation
Evidence is compared securely against trusted execution of the internal tools. If the agent returns an unsupported `reason_code` (e.g., citing `DEVICE_REUSE` without corresponding graph evidence), the validation layer strips the reason code and routes the transaction toward `REVIEW`.

## Failure Handling
In cases of:
- Provider Timeout
- Invalid JSON
- Tool Failure
- Entirely Unsupported Evidence
The Agent status transitions to `DEGRADED`. ML and Graph scoring continue unaffected, and the Policy Engine falls back to safe evaluation.
