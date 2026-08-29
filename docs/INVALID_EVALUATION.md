# Evaluation Runbook

## Final Evaluation Command
To reproduce the final evaluation on the 15% quarantined held-out split, run:
```bash
python scripts/evaluate_final.py --model models/xgb-ieeecis-v1
```
This script loads the frozen model, preprocessing pipeline, and thresholds, and calculates metrics over the untouched test set.

## Metrics Source of Truth
The exact output of Phase 7 is stored immutably in:
`evaluation/final_test_metrics.json`

> **IMPORTANT:** Public metrics in the README/dashboard should always be copied directly from this artifact to prevent conflicting values.

**Final Held-Out Metrics:**
- Precision: 0.784
- Recall: 0.542
- F1: 0.641
- PR-AUC: 0.692
- TP: 2,234
- FP: 617
- TN: 113,874
- FN: 1,893

## Cost Simulation Source of Truth
`evaluation/policy_threshold_selection.json` contains the FP/FN economic modeling assumptions.
> **DISCLAIMER:** These values are entirely illustrative and do not represent actual Razorpay economics.
