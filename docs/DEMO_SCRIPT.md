# RiskSentinel X — 3-Minute Demo Script

**Target Duration:** 3:00

---

## 0:00–0:20 | Problem
**Action:** Show the dashboard.
**Talk Track:** "Every fraud system gives you a score. But a score doesn't tell you *who* is connected, *what* the evidence is, or *whether* the AI is allowed to block a payment. RiskSentinel X investigates the full story — and keeps the AI on a leash."

## 0:20–0:40 | Architecture
**Action:** Show the architecture diagram (README or slide).
**Talk Track:** "The pipeline has six stages: Detect, Connect, Investigate, Explain, Decide, Audit. XGBoost scores. A graph engine finds shared devices and IPs. An AI agent investigates — but a deterministic policy makes the final call. Every decision is auditable."

## 0:40–1:05 | Scenario A — Safe Transaction
**Action:** Submit a low-risk transaction. Expand the case detail.
**Talk Track:** "Here's a normal transaction. ML score is low. Graph risk is low. The InvestigationGate *skips* the AI agent entirely — no LLM cost for obvious safe cases. Policy issues ALLOW immediately."

**Judge takeaway:** "We avoid unnecessary LLM cost for obvious low-risk cases."

## 1:05–1:40 | Scenario C — Collusion Ring
**Action:** Trigger the Simulate Suspicious Collusion Pattern button. Expand a high-risk case.
**Talk Track:** "Now I'm simulating a collusion ring — shared devices, shared IPs, coordinated transactions. The graph engine detects the community structure. ML flags the anomaly. The AI agent investigates using two read-only tools: transaction history and graph context. It produces structured evidence and reason codes."

**Judge takeaway:** "Fraud rings become visible rather than treating transactions independently."

## 1:40–2:10 | Scenario D — Governance Override
**Action:** Show a case where Agent recommended BLOCK but Policy decided REVIEW.
**Talk Track:** "This is the critical differentiator. The AI agent recommends BLOCK with high confidence. But the ML score is below 0.80 and the graph risk is below 0.30 — the hard evidence doesn't support it. The deterministic policy overrides the AI and downgrades to REVIEW. An LLM cannot autonomously block a transaction."

**Judge takeaway:** "Agent recommendation ≠ final policy decision."

## 2:10–2:30 | Audit Trail
**Action:** Open the audit timeline for the governance override case.
**Talk Track:** "Every step is logged chronologically: received, persisted, scored, graph checked, investigated, decided, audited. You can reconstruct exactly why any decision was made — the ML score, the graph risk, the agent's evidence, and the policy rule that fired."

## 2:30–2:50 | Evaluation Evidence
**Action:** Show the evaluation page or README metrics table.
**Talk Track:** "All metrics are frozen held-out results — never tuned after testing. IEEE-CIS ML evaluation, synthetic graph benchmark, 10 real Ollama agent cases, 700/700 deterministic policy runs, 3/3 prompt injection vectors blocked. Every number is defensible."

## 2:50–3:00 | Closing
**Action:** Return to dashboard.
**Talk Track:** "RiskSentinel X doesn't ask an AI to decide whom to block. It lets models detect, graphs connect, an agent investigate, and policy make the final auditable decision. Thank you."
