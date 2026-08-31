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
From a clean environment, ensure the model is trained or present in `models/`:
```bash
python evaluation/run_final.py
```
This requires the dataset and `models/xgb-ieeecis-v1.json` to be present.

## Artifact Hashes
The finalized MVP state results can be verified directly against the JSON payloads stored in `evaluation/results/`. Due to active development, strict SHA-256 hash enforcement of model binaries is currently bypassed in this repository version.
