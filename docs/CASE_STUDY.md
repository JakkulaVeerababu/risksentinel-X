# RiskSentinel X: Building an Evidence-Driven AI Risk Investigation System
> Combining tabular ML, graph intelligence, bounded AI investigation, deterministic policy, and auditability.

## Executive Summary
A fraud model can identify suspicious activity, but human analysts require context to make blocking decisions. RiskSentinel X bridges this gap by orchestrating an evidence-driven pipeline. It processes transactions through an XGBoost anomaly detector and a NetworkX graph intelligence layer. A bounded AI agent then synthesizes structured evidence using strict tool limits. Crucially, the system decouples probabilistic LLM reasoning from enforcement: the LLM recommends, but a deterministic Policy Engine decides. Evaluated on a quarantined 15% split of the IEEE-CIS benchmark, the ML layer achieved a 0.4810 Average Precision. The primary limitation is the prototype-scale in-memory graph infrastructure, which requires distributed graph technology (e.g., Neo4j) for production volumes.

## Problem Statement
Fraud models produce risk scores (e.g., "0.89 probability of fraud"), leaving risk analysts to manually hunt for the underlying context. RiskSentinel bridges the prediction to an actionable investigation, structuring evidence, enforcing policy, and writing to an immutable audit log.

## System Thesis
**Models detect. Graphs connect. Agents investigate. Policies decide.**
- **ML:** Statistical risk detection (XGBoost).
- **Graph:** Relationship intelligence (NetworkX).
- **Agent:** Evidence synthesis (LLM).
- **Policy:** Deterministic enforcement (Python).

## Architecture
```text
Transaction
↓
Feature Pipeline
↓
XGBoost (ML Risk)
↓
NetworkX (Graph Intelligence)
↓
Investigation Agent
↓
Evidence Validation
↓
Agent Recommendation
↓
Deterministic Policy
↓
ALLOW / REVIEW / BLOCK
↓
Audit (PostgreSQL)
```

## ML Methodology
The system uses the public IEEE-CIS Fraud Detection dataset to demonstrate tabular risk modeling. We utilized XGBoost due to its competitive baseline performance on non-linear tabular interactions and efficient CPU inference.
**Data Split:** 70% Train, 15% Validation, 15% Held-out Test (split chronologically to prevent temporal leakage).

### Held-Out Evaluation Results
(Metrics sourced from `evaluation/final_test_metrics.json`)
- **Average Precision:** 0.4810
- **Precision:** 0.4535
- **Recall:** 0.4635
- **F1:** 0.4585

## Graph Intelligence
Transaction-level ML naturally misses cross-entity linkages (e.g., shared IPs). Because IEEE-CIS lacks labeled relationship networks, we generated a synthetic relationship graph with planted suspicious structures (e.g., device reuse) to benchmark our NetworkX and Louvain community detection implementation.

## Agent Design & Safety
The LLM agent is strictly bounded to two tools: `get_transaction_history` and `get_graph_context`. This limited attack surface improves auditability and prevents broad prompt injection.
**Hallucination Containment:** The agent outputs structured JSON. An Evidence Validation layer verifies the LLM's reason codes against the trusted deterministic tools. If the LLM hallucinates uncorroborated evidence, the transaction degrades safely to `REVIEW`.

## Deterministic Policy
**LLM recommends. Policy decides.**
Automatic blocking requires ML ≥ 0.80 AND Graph ≥ 0.30. High agent confidence alone cannot produce a `BLOCK` decision.

## Auditability
Operational systems need verifiable evidence, not private chain-of-thought model reasoning. The PostgreSQL audit log stores exact ML scores, executed tool payloads, synthesized evidence, and the deterministic policy trace.

## Limitations
1. **Public benchmark domain mismatch:** Tabular data lacks real-world real-time sequential topology.
2. **Prototype-scale infrastructure:** NetworkX does not scale to production TPS.
3. **Illustrative cost assumptions:** Simulation economics do not represent real-world costs.
