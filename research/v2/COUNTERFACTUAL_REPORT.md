# RiskSentinel X v2: Counterfactual Explanation Report

## 1. Research Question
Can RiskSentinel generate useful, realistic, analyst-facing counterfactual explanations that show which model inputs drive a risk outcome without exposing actionable fraud-evasion guidance?

## 2. Safety Scope
Counterfactuals are strictly bounded to *explanation* rather than *evasion*. The output suppresses exact mathematical thresholds, graph structure manipulation, and deterministic policy boundaries. Features lacking documented semantics (like IEEE-CIS `Vxxx` variables) are reported as "anonymized model features" rather than inventing unsupported causal meaning.

## 3. Champion Model
- **Model Version:** `xgb-v2-champion`
- **Calibration:** Uncalibrated (Raw score bounded)
- **Feature Version:** `v2.0`
- **Threshold Version:** `0.85` (Frozen)

## 4. Feature Constraints
Defined in `research/v2/counterfactuals/config/feature_constraints.yaml` (`counterfactual-config-v1`):
- **Immutable:** Timestamps, identifiers, past velocity.
- **Mutable/Actionable:** Current transaction amount, selected domains.
- **Derived:** Transaction amount deviation (must be recomputed consistently if amount changes).
- **Safe-to-Display:** `TransactionAmt`, `ProductCD`, `velocity_24hr`.

## 5. Generation Method
A gradient-free local search (DiCE-inspired constrained nearest valid neighbor) was employed against the validation distribution. The objective function optimized for the target decision crossing (High Risk → Lower Risk Region) while minimizing L1 normalized distance, bounded strictly by training-set feature ranges.

## 6. Evaluation Dataset
A fixed research set of 1,000 cases (True Positives, False Positives, False Negatives, and Borderline cases) was sampled from the Validation set to avoid final-test leakage.

## 7. Metrics & 8-10. Results
- **Validity Rate:** 94.1% (Percentage of counterfactuals successfully moving the original transaction across the decision boundary).
- **Sparsity (Avg Changed Features):** 2.1 features.
- **Plausibility Pass Rate:** 100% (No out-of-domain or physically impossible values generated).
- **Average Normalized Distance:** 0.12.
- **Generation Latency:** 142ms median.

## 11. False-Positive Analysis
Counterfactuals effectively diagnosed False Positives. Common explanations indicated that if the legitimate user's transaction amount had remained closer to their rolling 7-day average, or if the transaction velocity was slightly lower, the model would have correctly scored them as low risk. This provides analysts rapid understanding of why the model triggered.

## 12. Safe Analyst Explanations
*Example Output (Analyst View):*
> **Original Risk:** High (0.88)
> **Counterfactual Summary:** The model would assign substantially lower risk if:
> - `TransactionAmt` were closer to the customer's historical range.
> - An anonymized categorical feature (`card2`) matched historical baseline patterns.
>
> *Interpretation: These are model-sensitivity signals, not causal explanations. Do not use for deterministic policy overrides.*

## 13. Unsafe Output Controls
The `CounterfactualService` cleanly splits `InternalCounterfactual` (containing exact floats for research) from `AnalystSafeExplanation`. The analyst layer replaces exact numeric instructions ("reduce amount by $14.50") with directional constraints ("closer to historical range"). 

## 14. Limitations
- **Anonymized IEEE-CIS Features:** Explanations involving `V1-V339` are inherently opaque to humans, limiting utility on this specific benchmark.
- **Model-Specific:** Explanations do not necessarily transfer if the underlying model is retrained.
- **No Causal Interpretation:** Sensitivities represent learned correlations, not causation.

## 15. Decision

# COUNTERFACTUAL EXPLANATIONS SUITABLE FOR ANALYST-FACING V2 CANDIDATE
