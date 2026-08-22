# Policy Engine Runbook

## Purpose
The Policy Engine enforces final decision making. Probabilistic ML/Graph scores and subjective LLM recommendations are mapped deterministically to an outcome: ALLOW, REVIEW, or BLOCK. 

## Source of Truth
Threshold values are frozen based on the Phase 7 validation.
**Version:** v1.0
- ML LOW Threshold: `0.15`
- ML HIGH Threshold: `0.85`

## Safety Rule
> Agent confidence alone cannot produce BLOCK. Automatic BLOCK requires multiple verified conditions (e.g., ML > 0.85 AND corroborating Graph/Agent evidence).

## Conditions
- **ALLOW:** ML Risk < 0.15 AND Graph Confidence < 0.70.
- **REVIEW:** Missing evidence, degraded agent, or conflicting signals (e.g., ML=0.40, Agent=BLOCK).
- **BLOCK:** ML Risk > 0.85 AND Agent confirms malicious activity.

## Versioning
Policy updates should NEVER overwrite existing versions silently. Use `policy-v2`, `policy-v3` to ensure the Audit trail remains immutably consistent for historical transactions.
