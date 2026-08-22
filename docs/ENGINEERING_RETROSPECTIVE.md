# Engineering Retrospective

## Goals
Build a comprehensive, auditable MVP that bridges ML fraud detection with LLM-assisted investigation, ensuring safety through deterministic policy boundaries.

## What We Built
An end-to-end event-driven architecture featuring FastAPI, XGBoost, NetworkX, an LLM orchestration layer, PostgreSQL, and a Next.js Live Dashboard with SSE realtime streaming.

## What Went Well
- **Component Separation:** Strictly decoupling ML, Graph, Agent, and Policy made testing and debugging significantly easier.
- **Structured Agent Contracts:** Enforcing strict Pydantic JSON schemas entirely eliminated parsing errors from the LLM.
- **Policy Safety:** The hard boundary between LLM recommendation and Policy enforcement worked flawlessly, preventing all hallucination-induced false positives during boundary testing.
- **Docker Setup:** Containerizing the stack early accelerated full-system integration testing.

## What Did Not Work Well
- **Local Graph Scalability:** NetworkX proved to be a bottleneck. Computing Louvain community detection on a large in-memory graph blocks the synchronous Python event loop.
- **Model-Domain Mismatch:** The IEEE-CIS dataset was difficult to map cleanly to the simulated graph topology.

## Hardest Decisions
1. **Two Tools vs Broad Autonomy:** We restricted the LLM to only two read-only context tools. While it reduced the agent's autonomy, it massively increased system safety and auditability.
2. **Synthetic Graph Benchmark:** Deciding to use a synthetic generator instead of attempting fragile inference over the IEEE-CIS columns was difficult but ultimately yielded a much stronger testbed.

## Biggest Technical Lessons
- **Validation > Generation:** In financial systems, the validation layer surrounding an LLM is more important than the LLM's raw reasoning capability.
- **Class Imbalance Realities:** Optimizing for Accuracy in fraud detection is useless; tuning operational thresholds using the Precision-Recall curve on a quarantined validation set is critical.

## Biggest Process Lessons
- **Foundation Before ML:** Building the FastAPI and PostgreSQL plumbing first allowed the ML and Agent models to plug directly into a functioning test harness, accelerating development.
- **Evaluation After Freeze:** Quarantining the 15% held-out test set until all thresholds were frozen prevented methodology leakage.

## What We Would Do Differently
- Implement an Online Feature Store (e.g., Redis) to decouple feature engineering from the FastAPI request lifecycle.
- Adopt a distributed graph database (Neo4j) on day one to handle real-world relationship scaling.
