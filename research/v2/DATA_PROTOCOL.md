# RiskSentinel X v2 Data & Evaluation Protocol

## Motivation
The original `v1` held-out test set (the final 15% chronological split) has already been heavily inspected and published in `v1.0.0` metrics. Reusing this exact split for `v2` hyperparameter tuning, model selection, or iterative calibration testing would result in dangerous methodology leakage.

## New Splitting Methodology
For v2 research on the IEEE-CIS dataset, we will implement a rolling-window evaluation or nested validation approach to establish unbiased estimates of future performance.

**Proposed Method: 3-Fold Time-Series Split**
```text
Window 1: Train (Months 1-3) → Validate (Month 4) → Evaluate (Month 5)
Window 2: Train (Months 1-4) → Validate (Month 5) → Evaluate (Month 6)
```

## Dataset Freeze Manifest
*A data manifest (`data_manifest.json`) will be generated detailing exact transaction IDs for the new splits.*

## Strict Split Roles
- **TRAIN:** Used exclusively for model fitting.
- **VALIDATION:** Used for model selection, calibration fitting, threshold selection, and early stopping.
- **NEW TEST:** Reserved strictly for the final v2 evaluation. Never tune against this split.

## Graph Benchmark Methodology
The graph evaluation relies on synthetic data. To improve rigor, all graph ablations and algorithm updates must be evaluated across multiple deterministic seeds.
- **Protocol:** Run `generate_synthetic_benchmark.py` with 5-10 distinct seeds.
- **Reporting:** Report mean F1 score, standard deviation, and range rather than a single point estimate.
