# Reproducibility Manifest

To accurately reproduce the frozen `v1.0.0` MVP environment, the following stack versions must be used:

- **Python:** 3.11.0
- **Node.js:** 20.x
- **Docker Compose:** v2.24+
- **XGBoost:** 2.0.3
- **scikit-learn:** 1.4.0
- **pandas:** 2.2.0
- **NetworkX:** 3.2.1

## Frozen State Configs
- **Model Version:** `xgb-ieeecis-v1`
- **Policy Version:** `policy-v1`
- **Agent Version:** `agent-v1-mock`

## Reproducing Evaluation
From a clean environment:
```bash
python scripts/evaluate_final.py --model models/xgb-ieeecis-v1
```
This requires `data/raw/train_transaction.csv` to be present.

## Artifact Hashes (Illustrative)
To verify artifact integrity in the future, these hashes represent the finalized MVP state:
- `model.json`: `frozen-hash-xyz`
- `policy_threshold_selection.json`: `frozen-hash-abc`
- `final_test_metrics.json`: `frozen-hash-def`
