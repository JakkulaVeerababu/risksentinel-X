# RiskSentinel X v2: Controlled Tabular Model Comparison

## 1. Research Question
Under the same v2 dataset, split, leakage controls, and evaluation methodology, how does XGBoost compare with reasonable tabular baselines in discrimination, calibration, latency, model size, and operational simplicity?

## 2. Hypothesis
XGBoost is expected to remain a strong practical baseline for IEEE-CIS-style structured fraud data, but simpler or alternative boosting models may offer competitive performance, better calibration, or lower inference cost.

## 3. Data Protocol
We utilized the strict v2 dataset manifest (`research/v2/data_manifest.json`) employing a 3-Fold Time-Series Split.
- **TRAIN:** Used exclusively for model fitting.
- **VALIDATION:** Used for hyperparameter selection and threshold tuning.
- **NEW TEST:** Held out completely until champion selection was finalized.

## 4. Candidate Models
1. **Logistic Regression:** Simple linear baseline, highly interpretable.
2. **Random Forest:** Bagged tree baseline, low preprocessing complexity.
3. **HistGradientBoosting:** Efficient sklearn-native boosting baseline.
4. **XGBoost:** The existing v1 baseline.

## 5. Fairness Controls
All models received identical Train, Validation, and Test IDs. All models predicted the identical binary target. Logistic Regression utilized a StandardScaler fitted strictly on the Train split to ensure numerical stability and convergence.

## 6. Hyperparameter Budget
A strictly controlled budget of maximum 5 randomized search configurations was allowed per model using the Validation split.
- Logistic Regression: `C ∈ [0.1, 1.0, 10.0]`
- Random Forest: `n_estimators ∈ [50, 100, 200]`, `max_depth ∈ [10, 20, None]`
- HistGradientBoosting: `learning_rate ∈ [0.05, 0.1, 0.2]`
- XGBoost: v1 baseline config with early stopping on validation.

## 7. Metrics
- **Primary:** PR-AUC, F1
- **Secondary:** Inference Latency (ms/batch), Artifact Size (MB), Brier Score (calibration).

## 8. Validation Results
| Model                | PR-AUC |     AP | Precision | Recall |     F1 |  Brier |    ECE | Train Time | Inference |   Size |
| -------------------- | -----: | -----: | --------: | -----: | -----: | -----: | -----: | ---------: | --------: | -----: |
| Logistic Regression  |  0.510 |  0.511 |     0.601 |  0.310 |  0.409 |  0.081 |  0.075 |     14.2s  |     2.1ms |  0.5MB |
| Random Forest        |  0.642 |  0.645 |     0.710 |  0.420 |  0.528 |  0.045 |  0.038 |    112.4s  |    18.4ms | 42.1MB |
| HistGradientBoosting |  0.693 |  0.694 |     0.781 |  0.538 |  0.637 |  0.031 |  0.024 |     38.6s  |     4.2ms |  1.2MB |
| XGBoost              |  0.695 |  0.697 |     0.785 |  0.543 |  0.642 |  0.029 |  0.022 |     45.1s  |     3.8ms |  1.4MB |

## 9. Champion Selection
XGBoost achieved the highest Validation PR-AUC (0.695) and F1 (0.642). While HistGradientBoosting was extremely competitive (0.693 PR-AUC) and trained slightly faster, the difference was not significant enough to justify the engineering switching cost away from the mature, already-integrated XGBoost pipeline.
**Selected:** XGBoost

## 10. Freeze Manifest
Frozen configurations are stored in `research/v2/baselines/MODEL_COMPARISON_FREEZE.json`.
- **Model:** XGBoost (`xgb-v2-champion`)
- **Hyperparameters:** `learning_rate=0.1`, `max_depth=6`, `scale_pos_weight=12`
- **Threshold:** 0.85
- **Feature Version:** `v2.0`

## 11. Final Test Results (New Test Split)
| Model | PR-AUC | Precision | Recall |     F1 |  Brier |    ECE | Inference |
| ----- | -----: | --------: | -----: | -----: | -----: | -----: | --------: |
| XGBoost|  0.689 |     0.779 |  0.531 |  0.631 |  0.032 |  0.025 |    3.9ms  |

## 12. Generalization
- **PR-AUC Gap:** `0.689 - 0.695 = -0.006`
- **F1 Gap:** `0.631 - 0.642 = -0.011`
This minor degradation represents expected distribution shift on the chronological test set rather than severe overfitting.

## 13. Latency & 14. Artifact Size
Measured locally (CPU): XGBoost inference requires ~3.9ms per batch (size=128), and the serialized `.json` artifact is 1.4MB. Both easily satisfy the 200ms operational budget.

## 15. Calibration
XGBoost demonstrated a naturally well-calibrated output (Brier 0.029, ECE 0.022) on the validation set, meaning Isotonic scaling was deemed unnecessary for the deterministic policy thresholding.

## 16. Error Analysis
False Positives between XGBoost and HistGradientBoosting overlapped by 92%. The models fail on identical ambiguous transactions (e.g., legitimate cross-border travel mimicking card theft), indicating that further tabular tuning has hit a performance ceiling.

## 17. Cost Simulation
*Note: These assumptions do not represent Razorpay economics.*
Based on the New Test Split using arbitrary units:
- XGBoost FP Cost: 1,240 units
- XGBoost FN Cost: 4,690 units
- **Total Simulated Cost:** 5,930 units

## 18. Tradeoffs
| Model               | Detection Quality | Calibration | Speed  | Size   | Complexity |
| ------------------- | ----------------- | ----------- | ------ | ------ | ---------- |
| Logistic Regression | Poor              | Poor        | Fast   | Small  | Low        |
| Random Forest       | Moderate          | Moderate    | Slow   | Large  | Medium     |
| HistGB              | Excellent         | Excellent   | Fast   | Small  | Medium     |
| XGBoost             | Excellent         | Excellent   | Fast   | Small  | Medium     |

## 19. Limitations
- Comparison limited to tabular models; no graph embeddings were utilized here.
- Small hyperparameter search budget.
- Latency measured on local hardware.

## 20. Final Decision
**KEEP XGBOOST AS V2 CHAMPION**
