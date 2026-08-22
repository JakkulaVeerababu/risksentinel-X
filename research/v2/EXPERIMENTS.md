# RiskSentinel X v2 Experiment Registry

| ID | Hypothesis | Configuration | Result | Decision | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EXP-001-calibration** | Isotonic regression will improve ECE on Validation data without dropping PR-AUC by > 0.01. | XGBoost + Isotonic Calibrator (Scikit-Learn). | TBD | TBD | PLANNED |
| **EXP-002-model-baselines** | HistGradientBoosting matches XGBoost PR-AUC but offers faster training times. | HGB vs XGBoost on identical temporal splits. | XGBoost PR-AUC: 0.695, HGB PR-AUC: 0.693, LR PR-AUC: 0.510 | XGBoost selected due to higher PR-AUC and acceptable latency | COMPLETED |
| **EXP-003-graph-multiseed** | Graph precision/recall will vary across seeds but remain within an acceptable range. | NetworkX Louvain across 10 deterministic generator seeds. | Mean F1 0.812 ± 0.015, stable across 10 seeds | Robust baseline verified | COMPLETED |
| **EXP-004-graph-ablation** | Removing multi-entity relationship signals will reduce graph-detection F1. | One-at-a-time removal of Device, IP, Payment, and Density signals. | Device reuse removal caused largest F1 drop (-0.14) | Device reuse is strongest synthetic signal | COMPLETED |
| **EXP-005-graph-hardening** | Increasing legitimate shared-device/IP behavior will increase false positives. | Stress testing High Legitimate Sharing vs Sparse Suspicious Density. | Precision dropped from 0.84 to 0.76 under High Legitimate Sharing | Multiple signals required to maintain Precision | COMPLETED |
| **EXP-006-counterfactuals** | Constrained counterfactual generation provides useful model-debugging explanations while preserving domain constraints and avoiding evasion disclosure. | DiCE-based local search with strict immutable/derived constraints on XGBoost. | 94% Validity Rate, 100% Safety Pass Rate. Avg features changed: 2.1 | Explanations suitable for analyst-facing v2 | COMPLETED |

*Note: All experiments must state their hypothesis prior to execution. Negative results must be preserved.*
