# RiskSentinel X v2 Research Plan

## Objective
Investigate whether RiskSentinel can improve along four dimensions:
1. Better calibrated ML risk
2. Stronger experimental evidence (baselines, ablations)
3. Better analyst-facing explanations (counterfactuals)
4. Better component versioning/governance

> **CRITICAL:** RiskSentinel v1 artifacts, code, and metrics remain entirely frozen. All research will occur on this isolated branch using a newly defined evaluation protocol.

## Research Questions & Hypotheses
- **RQ1 (Calibration):** Are RiskSentinel's model scores well calibrated?
  - *Hypothesis:* Isotonic calibration will improve the Brier score and Expected Calibration Error (ECE) without materially degrading PR-AUC ranking performance.
- **RQ2 (Model Comparison):** Is XGBoost still the best practical choice among tabular baselines?
  - *Hypothesis:* XGBoost will maintain the optimal tradeoff between PR-AUC, training time, and inference latency when compared rigorously against HistGradientBoosting and Logistic Regression.
- **RQ3 (Ablations):** Which components actually contribute useful information?
  - *Hypothesis:* Ablating the "Shared Device" graph signal will significantly degrade community-density metrics on the synthetic benchmark.
- **RQ4 (Counterfactuals):** What smallest feature changes reduce a transaction's ML risk?
  - *Hypothesis:* Analyst-facing counterfactuals can safely explain ML sensitivity bounds without functioning as operational bypass recipes.

## Prioritized Milestones
- **Milestone 1:** Model Calibration
- **Milestone 2:** Controlled Baseline Model Comparison
- **Milestone 3:** Graph Robustness and Multi-Seed Ablation
- **Milestone 4:** Counterfactual Explanations
- **Milestone 5:** Strict Component Versioning/Governance
- **Milestone 6:** Enhanced Agent Evaluation Metrics

## Promotion Criteria
Nothing moves from `research/v2/` into the main application until:
- The hypothesis is tested and results are documented in an experiment report.
- The validation methodology ensures no data leakage from the new test splits.
- Automated tests are added.
- A new version identifier is assigned.

## V2 Release Gate
A future "RiskSentinel X v2.0" release requires:
- A new evaluation protocol on a fresh dataset split.
- Newly frozen artifacts.
- A passing full regression suite.
- Updated audit versioning and documentation.
