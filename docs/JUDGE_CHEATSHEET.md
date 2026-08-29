# RiskSentinel X — Judge Cheat Sheet

**Pitch:** "Models detect. Graphs connect. Agents investigate. Policies decide."

## 1. Core Architecture Flow
Transaction → PostgreSQL → XGBoost ML Risk → Graph Intelligence (NetworkX) → InvestigationGate → Agent (Ollama llama3) / Skip → Deterministic Policy (policy-v1) → ALLOW / REVIEW / BLOCK → Audit Log → Dashboard

## 2. Frozen Metrics (IEEE-CIS Held-Out)
- **Average Precision:** 0.4810
- **Precision:** 0.4535
- **Recall:** 0.4635
- **F1 Score:** 0.4585
- **Threshold:** 0.80
- **TP:** 1,429 | **FP:** 1,722 | **TN:** 83,776 | **FN:** 1,654
- **Rows:** 88,581

## 3. Graph Benchmark (Synthetic Seeded)
- **Precision:** 0.9040 | **Recall:** 0.9912 | **F1:** 0.9456

## 4. Agent Tools (Exactly 2, Read-Only)
1. `get_transaction_history(customer_id)`
2. `get_graph_context(entity_id)`

## 5. Policy Safety Rule (policy-v1)
**The LLM does not independently authorize or block transactions.**
- ALLOW: ML < 0.80 AND Graph < 0.30
- REVIEW: ML ≥ 0.80 OR Graph ≥ 0.30 (one strong signal)
- BLOCK: ML ≥ 0.80 AND Graph ≥ 0.30 (both)
- Agent DEGRADED → routes to REVIEW, never ALLOW

Agent recommends `BLOCK` → Policy checks ML + Graph thresholds. If evidence is weak → Policy downgrades to `REVIEW`.

## 6. Dataset Disclaimers
1. **ML:** IEEE-CIS public benchmark. NOT Razorpay data.
2. **Graph:** Synthetic seeded relationship benchmark. NOT Razorpay data.
3. **Latency:** Local development benchmark. NOT production.

## 7. Top 5 Judge Answers
1. **Hallucination:** Pydantic schema validation rejects unsupported reason codes. Invalid agent output degrades to REVIEW.
2. **LLM Failure:** Pipeline degrades gracefully. ML/Graph continue. Policy enforces safe REVIEW.
3. **Thresholds:** 0.80 derived from validation split. Held-out test remained untouched.
4. **Why not just XGBoost?** Scores lack relationship context, investigation evidence, and auditable governance.
5. **Production Ready?** No. Prototype requiring domain data, compliance, distributed graph, streaming, and observability.
