# RiskSentinel X — Demo Scenarios

All scenarios use the canonical pipeline: `POST /api/v1/transactions/process`

---

## Scenario A — Safe Transaction

| Signal | Expected |
|--------|----------|
| ML score | LOW (< 0.80) |
| Graph score | LOW (< 0.30) |
| Agent | SKIPPED (InvestigationGate) |
| Policy | ALLOW |
| Rule | P-V1-001 |

**How to trigger:** Submit a standard transaction with normal features.

**Judge takeaway:** "We avoid unnecessary LLM cost for obvious low-risk cases."

---

## Scenario B — Single Strong Signal

| Signal | Expected |
|--------|----------|
| ML score | HIGH (≥ 0.80) |
| Graph score | LOW (< 0.30) |
| Agent | RUN |
| Policy | REVIEW |
| Rule | P-V1-002 |

**How to trigger:** Submit a transaction with anomalous velocity/amount features but no graph relationships.

**Judge takeaway:** "One strong signal triggers investigation rather than automatic blocking."

---

## Scenario C — Collusion Ring

| Signal | Expected |
|--------|----------|
| ML score | HIGH (≥ 0.80) |
| Graph score | HIGH (≥ 0.30) |
| Agent | RUN |
| Policy | BLOCK |
| Rule | P-V1-004 |

**How to trigger:** Use the "Simulate Suspicious Collusion Pattern" button in the Simulator.

**What to show:** Shared devices, shared IPs, community structure, density, related transactions.

**Judge takeaway:** "Fraud rings become visible rather than treating transactions independently."

---

## Scenario D — Governance Override (Agent BLOCK → Policy REVIEW)

| Signal | Expected |
|--------|----------|
| ML score | LOW (< 0.80) |
| Graph score | LOW (< 0.30) |
| Agent recommendation | BLOCK (high confidence) |
| Policy | REVIEW |
| Rule | P-V1-003 |

**Critical differentiator:** Agent recommendation ≠ final policy decision.

**How to demonstrate:** Find or create a case where the agent recommended BLOCK but ML/Graph evidence is weak. The policy overrides to REVIEW.

**Judge takeaway:** "An LLM cannot autonomously block a transaction."

---

## Scenario E (Optional) — Agent ALLOW Overridden

| Signal | Expected |
|--------|----------|
| ML score | HIGH (≥ 0.80) |
| Graph score | HIGH (≥ 0.30) |
| Agent recommendation | ALLOW |
| Policy | BLOCK |
| Rule | P-V1-004 |

**Judge takeaway:** "The AI cannot override deterministic machine evidence either."

---

## Scenario F (Optional) — AI Provider Failure

| Signal | Expected |
|--------|----------|
| ML | Normal |
| Graph | Normal |
| Agent | DEGRADED |
| Policy | REVIEW (for ambiguous cases) |
| Audit | Records failure |

**How to trigger:** Stop Ollama service, then submit a transaction that would normally trigger investigation.

**What to show:** ML works, Graph works, Agent DEGRADED, Policy still produces a safe result, Audit records the failure.

**Judge takeaway:** "The system degrades gracefully — a provider outage cannot cause unsafe behavior."

> ⚠️ **Demo reliability:** Only show this if Ollama restart behavior is stable. Do not risk the main demo. Use persisted prior cases if needed.

---

## Simulator

**Title:** Simulate Suspicious Collusion Pattern

**Label:** SYNTHETIC DEMO

The simulator submits transaction/entity facts only. It never injects:
- ML scores
- Graph scores
- Agent recommendations
- Final decisions

Those remain server-derived through the canonical pipeline.

---

## Demo Failure Plan

If Ollama becomes unavailable during judging:
1. Show prior persisted real Ollama cases from the dashboard
2. Explain the DEGRADED fallback mechanism
3. Do NOT fake a provider response
4. Show that ML, Graph, and Policy continue operating

---

## Offline Demo Resilience

Core demo can show the following even without Internet:
- Dashboard with existing cases
- Policy decisions
- Audit trail
- Evaluation metrics page
- Prior Ollama cases (already persisted)
