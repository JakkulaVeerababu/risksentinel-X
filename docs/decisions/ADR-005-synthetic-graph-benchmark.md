# ADR-005: Why Synthetic Graph Benchmark

**Context:** We needed to prove the Graph Engine's capability to detect connected fraud rings. However, the primary dataset (IEEE-CIS) is an anonymized tabular dataset lacking comprehensive real-world relationship linkages.

**Decision:** We generated a synthetic, labeled graph benchmark containing deliberately planted suspicious linkage patterns (e.g., device reuse among disconnected accounts).

**Alternatives Considered:**
- Attempting to infer a fragile graph purely from the limited IEEE-CIS columns.
- Not evaluating the graph engine quantitatively.

**Tradeoffs:** A synthetic graph cannot perfectly replicate real-world adversarial fraud networks. 

**Consequences:** The synthetic benchmark allowed us to rigorously unit-test the NetworkX/Louvain engine and calculate Precision/Recall for graph-based anomaly detection independently of the XGBoost ML model.
