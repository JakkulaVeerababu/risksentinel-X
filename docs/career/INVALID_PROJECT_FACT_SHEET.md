# RiskSentinel X - Project Fact Sheet

- **Model:** XGBoost Classifier
- **Dataset:** IEEE-CIS Fraud Detection (Public Tabular Benchmark)
- **Graph Technology:** NetworkX with Louvain community detection
- **Agent Architecture:** OpenAI/Claude via MockProvider; LangChain-inspired bounded execution
- **Agent Tools:** `get_transaction_history(customer_id)`, `get_graph_context(entity_id)`
- **Policy Architecture:** Deterministic Python evaluation layer (ALLOW / REVIEW / BLOCK)
- **Database:** PostgreSQL (Audit Log)
- **Backend:** FastAPI (Python)
- **Frontend:** Next.js (TypeScript)
- **Realtime Mechanism:** Server-Sent Events (SSE)
- **Docker:** `docker-compose.yml` orchestrating API, UI, DB, and Admin services
- **Tests:** 20 critical regression tests (Pytest)
- **Final Held-Out Metrics:** Precision 0.784, Recall 0.542, F1 0.641, PR-AUC 0.692
- **Graph Benchmark Metrics:** Synthetic evaluation (100% precision on planted clusters)
- **Local Performance Measurements:** ~150ms ML inference; ~400ms Agent overhead (mocked)
