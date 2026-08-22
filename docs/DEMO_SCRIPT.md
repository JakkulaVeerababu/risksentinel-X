# RiskSentinel X - Demo Script

**Target Duration:** 5:00 minutes

## 0:00–0:25 | Opening
**Action:** Show the live dashboard.
**Talk Track:** "Many fraud systems tell analysts that a transaction looks suspicious. RiskSentinel X investigates *why*. Models detect. Graphs connect. Agents investigate. Policies decide."

## 0:25–0:55 | Normal Transaction
**Action:** Trigger a single, low-risk transaction. Expand the row.
**Talk Track:** "Here is a standard transaction. The XGBoost ML score is low. The NetworkX Graph score is low. No investigation is necessary, and the deterministic policy immediately issues an ALLOW."

## 0:55–2:15 | Suspicious Pattern
**Action:** Click the "Simulate Suspicious Collusion Pattern" button.
**Talk Track:** "But fraud doesn't happen in a vacuum. I just simulated a collusion ring. As these transactions enter, the Graph engine detects shared IPs and devices, surfacing a hidden community. The graph risk spikes."

## 2:15–3:05 | Investigation
**Action:** Expand one of the high-risk simulated rows. Show the Agent Investigation panel.
**Talk Track:** "Instead of just blocking based on a black-box score, our AI Agent investigates. It executes exactly two bounded tools: `get_transaction_history` and `get_graph_context`. We expose the structured evidence and reason codes—not the LLM's hidden chain-of-thought. The AI recommends a BLOCK."

## 3:05–3:35 | Policy Safety
**Action:** Scroll to the Policy Decision section. Show a case where Agent=BLOCK but Policy=REVIEW (if applicable), or explain the boundary.
**Talk Track:** "Crucially, the LLM has no unilateral blocking authority. The model can recommend BLOCK, but our deterministic Policy Engine requires multiple verified conditions to act. If the evidence is weak, Policy downgrades the LLM's recommendation to a safe REVIEW."

## 3:35–4:15 | Evaluation
**Action:** Open the metrics tab / show the README evaluation section.
**Talk Track:** "These aren't just concepts. We evaluated RiskSentinel against an untouched, held-out test split of the public IEEE-CIS dataset. We achieved a PR-AUC of 0.692 and an F1 of 0.641, preventing millions in simulated false-negative costs."

## 4:15–4:40 | Audit
**Action:** Open the transaction Audit Timeline.
**Talk Track:** "Finally, everything is auditable. Every model version, tool call, piece of evidence, and policy rule is appended to an immutable timeline. Every decision can be reconstructed."

## 4:40–5:00 | Close
**Action:** Return to main dashboard view.
**Talk Track:** "RiskSentinel X moves fraud detection from a simple score to an auditable investigation workflow. Models detect. Graphs connect. Agents investigate. Policies decide. Thank you."
