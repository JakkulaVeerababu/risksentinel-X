# RiskSentinel X - Interview Q&A

## Easy Questions
**Q: What is XGBoost?**
A: A gradient boosting framework for tabular data. It iteratively trains decision trees to correct the errors of previous trees, capturing complex non-linear feature interactions efficiently.

**Q: What is PR-AUC?**
A: Precision-Recall Area Under the Curve. It evaluates classification models on imbalanced datasets by plotting precision against recall, avoiding the skewed optimism of accuracy when the positive class (fraud) is rare.

**Q: Why REVIEW instead of just ALLOW/BLOCK?**
A: Risk signals often conflict, or evidence may be missing. `REVIEW` provides a safe, bounded uncertainty state for human analysts, preventing unsafe binary automation and mitigating expensive false positives.

## Medium Questions
**Q: How did you split the data?**
A: 70% Train, 15% Validation, and 15% Test. The thresholds were grid-searched strictly on the Validation set. The held-out test set remained strictly quarantined until the final evaluation to prevent methodology leakage.

**Q: How do you prevent LLM fabricated evidence?**
A: We use deterministic comparison. The LLM must cite specific reason codes from an approved ENUM. If the LLM claims a fact unsupported by the deterministic tools (e.g., hallucinated shared IPs), our validation layer strips the unsupported evidence and downgrades the transaction to REVIEW.

**Q: Why use FastAPI?**
A: It provides excellent async support, auto-generated OpenAPI documentation, and native Pydantic schema validation, which was critical for enforcing strict type contracts on the LLM agent's structured JSON outputs.

## Hard Questions
**Q: How would temporal drift impact your model?**
A: Fraud patterns evolve rapidly. An XGBoost model trained on static IEEE-CIS data will decay over time (concept drift) as fraudsters change tactics. In production, we would need a robust monitoring pipeline tracking feature distributions and a Champion/Challenger deployment strategy for continuous retraining.

**Q: How would you scale online neighborhood queries?**
A: NetworkX requires the entire graph in-memory, which breaks at scale. I would migrate to Neo4j or Amazon Neptune, utilizing indexed nodes and edges for millisecond latency on 2-3 hop neighborhood queries during real-time transaction scoring.

**Q: How would you guarantee policy consistency across versions?**
A: The Policy Engine and its thresholds would be strictly version-controlled. Every audit log entry must store the `policy_version`, `model_version`, and `agent_version` alongside the input features. This enables precise backtesting and ensures a transaction replayed with identical inputs and versions produces the identical ALLOW/BLOCK decision.

## Debugging Story (STAR Format)
**Situation:** During Phase 4 Policy integration, we discovered the AI agent was highly susceptible to "hallucinating" high confidence in fraudulent behavior based on weak signals.
**Task:** Ensure the LLM could safely assist investigations without unilaterally blocking legitimate customers (false positives).
**Action:** We introduced a strict Python `PolicyEngine` boundary. The Agent was restricted to only *recommending* an action and citing approved ENUM reason codes. The Policy Engine then evaluated hard ML/Graph thresholds independently. 
**Result:** 100% mitigation of hallucination-induced false positives during testing. Lesson: Deterministic code should always wrap probabilistic models in financial use cases.
