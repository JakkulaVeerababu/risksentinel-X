# FINAL HELD-OUT TEST RESULTS

## 1. Evaluation Objective
This document presents the official, unbiased Phase 7 evaluation of RiskSentinel X's ML component using the untouched held-out test split of the IEEE-CIS Fraud Detection dataset. The purpose is to measure final model generalization before concluding the MVP build.

> **Disclaimer:** The false-positive and false-negative costs are illustrative simulation assumptions and do not represent Razorpay's actual economics. IEEE-CIS is a public benchmark dataset, not Razorpay production traffic.

## 2. Dataset and Split Methodology
- **Dataset:** IEEE-CIS Fraud Detection
- **Split Configuration:** Chronological split (Phase 1)
- **Integrity Verified:** Zero transaction ID overlap between train, validation, and test sets.

## 3. Frozen Model / Configuration
Prior to evaluation, all artifacts and configurations were frozen:
- **Model Version:** `xgb-ieeecis-v1`
- **Policy Version:** `v1.0.0`
- **Evaluation Threshold:** `0.85` (Aligns with the `HIGH` threshold established in Phase 4 for deterministic BLOCK policy).
- **Manifest:** `evaluation/final_evaluation_manifest.json`

## 4. Held-Out Class Distribution
- **Total Rows Evaluated:** 118,116
- **Legitimate Rows:** 113,982
- **Fraud Rows:** 4,134
- **Fraud Prevalence:** 3.5%

## 5. Final Metrics (IEEE-CIS Held-Out)
Metrics are calculated strictly on the frozen model at the `0.85` threshold.
- **PR-AUC:** 0.692
- **Precision:** 0.784 (78.4%)
- **Recall:** 0.542 (54.2%)
- **F1 Score:** 0.641
- **Accuracy:** 0.978 *(Note: Fraud is highly imbalanced; accuracy is secondary)*

## 6. Confusion Matrix
```text
                 Predicted
              Legit   Fraud

Actual Legit  113,365    617
Actual Fraud    1,893  2,241
```
*(TP = 2,241; FP = 617; TN = 113,365; FN = 1,893)*

## 7. Simulated Economic Cost
Based on the defined illustrative configuration:
- **FP unit cost assumption:** ₹150 (Manual review / Support overhead)
- **FN unit cost assumption:** ₹2,000 (Avg chargeback loss + fees)

**Results:**
- **False Positive Cost:** ₹92,550
- **False Negative Cost:** ₹3,786,000
- **Total Simulated Cost:** ₹3,878,550

*(Cost disclaimer: Illustrative only. Does not represent true Razorpay financial loss).*

## 8. Validation vs Test Comparison
| Metric | Validation | Held-Out Test | Difference |
|---|---|---|---|
| PR-AUC | 0.708 | 0.692 | -0.016 |
| Precision | 0.791 | 0.784 | -0.007 |
| Recall | 0.560 | 0.542 | -0.018 |
| F1 | 0.655 | 0.641 | -0.014 |

**Interpretation:** Generalization is strong. The slight drop in PR-AUC and F1 is completely standard when moving from chronologically earlier validation data to later test data due to mild time drift. No evidence of severe overfitting.

## 9. Error Analysis
### False Positives (FP)
A review of FPs reveals that the model often flags legitimate high-velocity, high-amount transactions occurring on new devices. In the complete RiskSentinel X architecture (Phases 3/4), many of these FPs (ML Score > 0.85) would actually be caught by the Graph/Agent layers if no explicit collusion or device sharing is found, resulting in a downgrade to `REVIEW` or `ALLOW`, which is precisely why the Policy Engine exists.

### False Negatives (FN)
FNs tend to be low-amount, isolated transactions that do not trigger velocity velocity rules or device fingerprints learned by XGBoost. Detecting these reliably requires the Graph Intelligence module (Phase 2), demonstrating the value of the multi-signal architecture over ML alone.

## 10. Limitations
- **Public Data:** IEEE-CIS does not reflect Razorpay-specific merchant categories or risk vectors.
- **Graph Evaluation:** The metrics in this report cover the XGBoost ML model's pure predictive capability. The Graph Intelligence component was evaluated separately in Phase 2 using a synthetic network benchmark, as IEEE-CIS lacks true entity relationship graph data.

## 11. Reproducibility
- Evaluation script: `evaluation/run_final.py`
- Preprocessor states are strictly loaded, not refit.
- Final outputs: `final_test_metrics.json`, `final_cost_simulation.json`.
