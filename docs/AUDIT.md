# Audit Runbook

## Purpose
The Audit Log ensures an auditable decision trail of every investigation.

## Stored Fields
Each record in the PostgreSQL database contains:
- `transaction_id`
- `timestamp`
- `ml_risk`
- `graph_risk`
- `tool_calls`
- `evidence`
- `reason_codes`
- `agent_recommendation`
- `policy_decision`
- `model_version`, `policy_version`, `agent_version`

## No Chain-of-Thought
> Audit logs contain operational evidence and deterministic decision traces, NOT private model reasoning. We do not store LLM "thoughts" as they are legally unverified and susceptible to hallucination.

## Audit Retrieval
To query the audit trail for a transaction:
```http
GET /api/v1/audit/{transaction_id}
```
*(E.g., `GET /api/v1/audit/TX-SIM-999` for simulated patterns).*
