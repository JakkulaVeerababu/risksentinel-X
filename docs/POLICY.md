# Policy Engine Runbook

## Purpose
The Policy Engine enforces final decision making. Probabilistic ML/Graph scores and subjective LLM recommendations are mapped deterministically to an outcome: ALLOW, REVIEW, or BLOCK. 

## Source of Truth
Threshold values are frozen based on the Phase 7 validation.
**Version:** policy-v1
- ML HIGH Threshold: `0.80`
- Graph HIGH Threshold: `0.30`

## Safety Rule
> Agent confidence alone cannot produce BLOCK. Automatic BLOCK requires multiple verified conditions (ML ≥ 0.80 AND Graph ≥ 0.30). The agent is advisory only.

## Conditions (policy-v1)
- **ALLOW:** ML Risk < 0.80 AND Graph Risk < 0.30 — low risk, no investigation needed.
- **REVIEW:** ML ≥ 0.80 OR Graph ≥ 0.30, but not both — one strong signal triggers investigation.
- **BLOCK:** ML ≥ 0.80 AND Graph ≥ 0.30 — multiple verified signals confirm high risk.

## Versioning
Policy updates should NEVER overwrite existing versions silently. Use `policy-v2`, `policy-v3` to ensure the Audit trail remains immutably consistent for historical transactions.
