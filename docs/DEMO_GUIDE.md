# RiskSentinel X — Demo Guide

This guide consolidates the pre-flight checks, scenarios, and the exact 3-minute talk track for presenting RiskSentinel X.

---

## Part 1: Demo Runbook (Pre-Flight Checks)

Follow these pre-flight checks before recording or presenting the live demo.

1. **Clean State:**
   - Run `docker compose down` to wipe previous database state if needed.
   - Run `docker compose up -d --build` to start a fresh environment.
2. **Health Verification:**
   - Backend API: Check `http://localhost:8000/health` (should return 200 OK).
   - Frontend UI: Open `http://localhost:3000` (ensure no React console errors).
3. **Environment:**
   - Ensure `.env` is loaded.
   - Confirm `GRAPH_SUSPICIOUS_THRESHOLD` is set to `0.6`.
4. **Browser Setup:**
   - Close all unrelated tabs.
   - Maximize browser window or set to 1080p resolution.
   - Disable Slack/email notifications.

### Fallback Plans
- **LLM Unavailable:** If the Claude API times out, the system degrades safely. State: "As designed, if the LLM provider fails, our deterministic policy ensures the transaction is safely routed to human review, preventing a pipeline crash."
- **Dashboard Disconnects:** Refresh the page. The SSE connection will automatically re-establish.

---

## Part 2: Demo Scenarios

All scenarios use the canonical pipeline: `POST /api/v1/transactions/process`

### Scenario A — Safe Transaction
| Signal | Expected |
|--------|----------|
| ML score | LOW (< 0.80) |
| Graph score | LOW (< 0.30) |
| Agent | SKIPPED (InvestigationGate) |
| Policy | ALLOW |

**How to trigger:** Submit a standard transaction with normal features.
**Judge takeaway:** "We avoid unnecessary LLM cost for obvious low-risk cases."

### Scenario B — Single Strong Signal
| Signal | Expected |
|--------|----------|
| ML score | HIGH (≥ 0.80) |
| Graph score | LOW (< 0.30) |
| Agent | RUN |
| Policy | REVIEW |

**How to trigger:** Submit a transaction with a high ML score but no known graph risks.
**Judge takeaway:** "One strong signal triggers investigation."

### Scenario C — Collusion Ring
| Signal | Expected |
|--------|----------|
| ML score | HIGH (≥ 0.80) |
| Graph score | HIGH (≥ 0.30) |
| Agent | RUN |
| Policy | BLOCK |

**How to trigger:** Simulate a collusion ring — shared devices, shared IPs.
**Judge takeaway:** "Fraud rings become visible rather than treating transactions independently."

### Scenario D — Governance Override
| Signal | Expected |
|--------|----------|
| ML score | LOW (< 0.80) |
| Graph score | LOW (< 0.30) |
| Agent | BLOCK (0.99) |
| Policy | REVIEW |

**How to trigger:** Hardcode Agent recommendation to BLOCK for a safe transaction.
**Judge takeaway:** "Agent recommendation ≠ final policy decision."

---

## Part 3: 3-Minute Demo Script

**Target Duration:** 3:00

### 0:00–0:20 | Problem
**Action:** Show the dashboard.
**Talk Track:** "Every fraud system gives you a score. But a score doesn't tell you *who* is connected, *what* the evidence is, or *whether* the AI is allowed to block a payment. RiskSentinel X investigates the full story — and keeps the AI on a leash."

### 0:20–0:40 | Architecture
**Action:** Show the architecture diagram (README or slide).
**Talk Track:** "The pipeline has six stages: Detect, Connect, Investigate, Explain, Decide, Audit. XGBoost scores. A graph engine finds shared devices and IPs. An AI agent investigates — but a deterministic policy makes the final call. Every decision is auditable."

### 0:40–1:05 | Scenario A — Safe Transaction
**Action:** Submit a low-risk transaction. Expand the case detail.
**Talk Track:** "Here's a normal transaction. ML score is low. Graph risk is low. The InvestigationGate *skips* the AI agent entirely — no LLM cost for obvious safe cases. Policy issues ALLOW immediately."

### 1:05–1:40 | Scenario C — Collusion Ring
**Action:** Trigger the Simulate Suspicious Collusion Pattern button. Expand a high-risk case.
**Talk Track:** "Now I'm simulating a collusion ring — shared devices, shared IPs, coordinated transactions. The graph engine detects the community structure. ML flags the anomaly. The AI agent investigates using two read-only tools: transaction history and graph context. It produces structured evidence and reason codes."

### 1:40–2:10 | Scenario D — Governance Override
**Action:** Show a case where Agent recommended BLOCK but Policy decided REVIEW.
**Talk Track:** "This is the critical differentiator. The AI agent recommends BLOCK with high confidence. But the ML score is below 0.80 and the graph risk is below 0.30 — the hard evidence doesn't support it. The deterministic policy overrides the AI and downgrades to REVIEW. An LLM cannot autonomously block a transaction."

### 2:10–2:30 | Audit Trail
**Action:** Open the audit timeline for the governance override case.
**Talk Track:** "Every step is logged chronologically: received, persisted, scored, graph checked, investigated, decided, audited. You can reconstruct exactly why any decision was made — the ML score, the graph risk, the agent's evidence, and the policy rule that fired."

### 2:30–2:50 | Evaluation Evidence
**Action:** Show the evaluation page or README metrics table.
**Talk Track:** "All metrics are frozen held-out results — never tuned after testing. IEEE-CIS ML evaluation, synthetic graph benchmark, 10 real Ollama agent cases, 700/700 deterministic policy runs, 3/3 prompt injection vectors blocked. Every number is defensible."

### 2:50–3:00 | Closing
**Action:** Return to dashboard.
**Talk Track:** "RiskSentinel X doesn't ask an AI to decide whom to block. It lets models detect, graphs connect, an agent investigate, and policy make the final auditable decision. Thank you."
