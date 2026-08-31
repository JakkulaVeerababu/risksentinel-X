# Model Training Runbook

## Dataset Acquisition
Raw IEEE-CIS data is not committed to Git due to size and licensing constraints.
Place the required files at:
```text
data/raw/
├── train_transaction.csv
└── train_identity.csv
```

## Fresh Clone Setup
Because trained model binaries are not tracked in Git, you must either:
1. Run the training script locally (see **Training Execution** below).
2. Download the pre-compiled `xgb-ieeecis-v1.json`, `preprocessor-v1.joblib`, and `threshold-v1.json` artifacts from the release page and place them into the `models/` directory.

## Methodology
The dataset is split chronologically to prevent temporal leakage:
- **Train (70%):** Model fitting.
- **Validation (15%):** Tuning and threshold selection.
- **Held-out Test (15%):** Final evaluation only.

## Training Execution
```bash
python scripts/train_xgboost.py --data data/raw/
```
This script performs preprocessing, handles class imbalance via `scale_pos_weight`, and saves artifacts.

## Feature Manifest
Features are transformed and strictly ordered. The feature manifest (`models/xgb-ieeecis-v1/feature_manifest.json`) maps raw fields to engineered and categorically encoded fields. Inference MUST reproduce this exact ordering.

## Artifacts
Training produces a versioned folder, e.g., `models/xgb-ieeecis-v1/` containing:
- `model.json`
- `preprocessor.joblib`
- `feature_manifest.json`
- `metadata.json`
- `validation_metrics.json`

## Model Change Rule
> **WARNING:** Changing the model, features, preprocessing, or evaluation threshold may invalidate existing evaluation claims. You must generate new evaluation metrics if these change. Never overwrite old models silently; increment the version (e.g., `xgb-ieeecis-v2`).
