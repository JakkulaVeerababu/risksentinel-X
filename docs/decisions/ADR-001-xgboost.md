# ADR-001: Why XGBoost

**Context:** The system required a highly capable ML classifier to process the IEEE-CIS tabular fraud dataset containing categorical variables, missing values, and complex non-linear feature interactions.

**Decision:** We selected XGBoost over Logistic Regression, Random Forests, or deep learning models.

**Alternatives Considered:**
- *Logistic Regression:* Too weak for non-linear interactions without extensive manual feature engineering.
- *Deep Neural Networks:* Unnecessary complexity and computational overhead for a tabular dataset, harder to tune quickly in a hackathon setting.

**Tradeoffs:** XGBoost requires careful handling of class imbalance (`scale_pos_weight`) and tuning to avoid overfitting compared to simpler models.

**Consequences:** A fast, performant, and easily explainable baseline risk score that achieved a 0.692 PR-AUC locally in under 200ms per inference.
