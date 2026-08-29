# RiskSentinel X — Final Evaluation Report

> All metrics are frozen Phase-7 held-out results. No post-test tuning was performed.
> IEEE-CIS is a public benchmark dataset, not Razorpay production traffic.

---

## 1. ML — IEEE-CIS Held-Out Evaluation

**Dataset:** IEEE-CIS Fraud Detection (public Kaggle)
**Split:** Chronological 70/15/15 (Train / Validation / Held-out)
**Model:** xgb-ieeecis-v1
**Preprocessor:** preprocessor-v1.joblib
**Threshold:** 0.80

### Held-Out Split Distribution
- **Total rows:** 88,581
- **Fraud rows:** 3,083
- **Fraud prevalence:** 3.48%

### Metrics

| Metric | Value |
|--------|-------|
| Average Precision (AP) | 0.4810 |
| Precision | 0.4535 |
| Recall | 0.4635 |
| F1 | 0.4585 |

### Confusion Matrix

|  | Predicted Legit | Predicted Fraud |
|--|----------------|----------------|
| **Actual Legit** | 83,776 (TN) | 1,722 (FP) |
| **Actual Fraud** | 1,654 (FN) | 1,429 (TP) |

### Interpretation

F1 of 0.4585 reflects the highly imbalanced nature of IEEE-CIS (~3.5% fraud) and the precision-oriented 0.80 threshold. RiskSentinel X does not rely on ML alone — the architecture combines ML, graph context, AI investigation, and deterministic policy for the final decision.

**Artifact:** `evaluation/results/ml_heldout_metrics.json`

---

## 2. Synthetic Seeded Graph Benchmark

| Metric | Value |
|--------|-------|
| Precision | 0.9040 |
| Recall | 0.9912 |
| F1 | 0.9456 |
| Threshold | 0.30 |
| TP | 113 |
| FP | 12 |
| TN | 2,988 |
| FN | 1 |

> This is a synthetic seeded benchmark, not real-world graph performance. IEEE-CIS lacks rich entity resolution data, so a labeled synthetic benchmark with known ground truth was constructed.

**Artifact:** `evaluation/results/graph_final_unseen_metrics.json`

---

## 3. Agent Evaluation

### Real Ollama (llama3)
- **Cases attempted:** 10
- **Structured valid:** 10/10
- **Invalid:** 0
- **Degraded:** 0
- **Max tool calls:** 2
- **Max provider calls:** 1

### Controlled Mock
- **Cases:** 30
- **Prompt injection resistance:** 3/3 (transaction, history, graph vectors)
- **Unsupported evidence rejected:** 30/30

**Artifact:** `evaluation/results/agent_eval.json`

---

## 4. Policy Governance Evaluation

- **Scenarios:** 7
- **Total runs:** 700
- **Deterministic:** 700/700 (100%)
- **BLOCK-0.99 override tested:** ✓ (agent BLOCK overridden to REVIEW)
- **ALLOW-0.99 override tested:** ✓ (agent ALLOW overridden to BLOCK)

**Artifact:** `evaluation/results/policy_eval.json`

---

## 5. Failure Safety

- **Unsafe silent ALLOW on failure:** 0/5
- ML failure → DEGRADED
- Graph failure → DEGRADED (evidence unavailable, NOT 0.0)
- Agent failure → DEGRADED
- Policy failure → FAILED
- DB failure → FAILED

**Artifact:** `evaluation/results/failure_eval.json`

---

## 6. Local Development Latency

**Hardware:** AMD64 Family 25 (Ryzen 7), 24GB RAM, RTX 4050 Laptop GPU, Windows 11

| Path | n | Mean (ms) | Median (ms) | P95 (ms) |
|------|---|-----------|-------------|----------|
| Skip (no agent) | 20 | 190 | 163 | 264 |
| Canonical Ollama E2E | 5 | 5,743 | 5,720 | 5,845 |

> Local development benchmark only. Production latency would differ significantly.

**Artifact:** `evaluation/results/latency_eval.json`

---

## 7. Audit Completeness

All 10 canonical cases verified:
- Transactions: 10/10
- Risk scores: 10/10
- Investigations: 10/10
- Decisions: 10/10
- Audit events: 10/10

**Artifact:** `evaluation/results/audit_eval.json`

---

## 8. Idempotency

- Requests attempted: 111
- Initial processing: 1
- Idempotent replays: 105
- Conflicts: 0
- DB rows (transactions/scores/investigations/decisions): 1/1/1/1
- Contradictory decisions: 0

**Artifact:** `evaluation/results/idempotency_eval.json`

---

## 9. Limitations

1. IEEE-CIS distribution differs from real Razorpay traffic
2. Graph benchmark is synthetic
3. No production payment traffic tested
4. Local Ollama latency is hardware-dependent
5. Graph historical Phase-2B result could not be exactly reproduced; current reproducible result is used
6. Dependency advisories remain accepted security debt for local MVP
7. Prototype is not production authorization infrastructure

---

## 10. Reproducibility

- ML evaluation: `evaluation/run_phase7_true_ml.py`
- Graph evaluation: `evaluation/run_phase7_true_graph.py`
- Agent/policy evaluation: `evaluation/run_phase7_true_agent_policy.py`
- Latency evaluation: `evaluation/run_phase7_true_latency.py`
- Aggregation: `evaluation/aggregate_phase7.py`
- Final summary: `evaluation/results/evaluation_summary.json`
