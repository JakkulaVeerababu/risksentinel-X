# RiskSentinel X - Judge Cheat Sheet

**Pitch:** "Models detect. Graphs connect. Agents investigate. Policies decide."

## 1. Core Architecture Flow
Transaction → ML Risk (XGBoost) → Graph Risk (NetworkX) → Agent Investigation (Tools) → Evidence Validation → Deterministic Policy → Final Decision (ALLOW/REVIEW/BLOCK) → Postgres Audit Log.

## 2. Final Frozen Metrics (IEEE-CIS)
- **Precision:** 0.784
- **Recall:** 0.542
- **F1 Score:** 0.641
- **PR-AUC:** 0.692
- **TP:** 2,234 | **FP:** 617 | **TN:** 113,874 | **FN:** 1,893

## 3. Agent Tools (Strictly 2)
1. `get_transaction_history(customer_id)`
2. `get_graph_context(entity_id)`

## 4. Policy Safety Rule
**The LLM does not independently authorize or block transactions.** 
Agent recommends `BLOCK` -> Policy checks if `ML Risk > 0.85`. If `False`, Policy downgrades to `REVIEW`.

## 5. Dataset Disclaimers
1. **IEEE-CIS:** Public tabular benchmark. NOT Razorpay data.
2. **Graph Data:** Labeled synthetic relationship benchmark. NOT Razorpay data.
3. **Economics:** Illustrative FP/FN simulated costs. NOT Razorpay economics.

## 6. Top 5 Judge Answers
1. **Hallucination:** We use deterministic Pydantic schema validation to reject unsupported reason codes and evidence.
2. **LLM Failure:** The pipeline gracefully degrades. ML/Graph continue, Policy enforces a safe `REVIEW`.
3. **Thresholds:** Derived from 15% Validation split. Held-out test set remained untouched until final evaluation.
4. **Why not just XGBoost?** Scores lack relationship context and auditable investigation evidence.
5. **Production Ready?** No. It's a prototype requiring domain data, compliance, distributed graph stores, and streaming infra for Razorpay scale.
