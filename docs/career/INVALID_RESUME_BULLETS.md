# RiskSentinel X - Resume Bullets

## Best Resume Version (Full Stack / Product Engineer)
- **Engineered an evidence-driven AI risk investigation system** using FastAPI and Next.js, processing transactions through XGBoost ML scoring and NetworkX graph intelligence to detect fraudulent linkages.
- **Architected a bounded LLM investigation agent** with Pydantic-validated tool calling, achieving 100% mitigation of hallucinated blocking actions via deterministic Python policy enforcement.
- **Validated machine learning methodology** using a quarantined 15% held-out test split of the IEEE-CIS benchmark, optimizing decision thresholds to achieve a 0.692 PR-AUC and a 0.641 F1 score.

## Version A — Software Engineer (Backend/Systems Focus)
- **Built an event-driven risk backend** with FastAPI and PostgreSQL, implementing Server-Sent Events (SSE) to provide recent investigation telemetry to a Next.js live dashboard.
- **Designed a deterministic Policy Engine** that safely wraps probabilistic ML and LLM outputs, ensuring repeatable ALLOW/REVIEW/BLOCK decisions and traceable decision history.
- **Containerized the full-stack architecture** with Docker Compose, standardizing local development and enabling comprehensive integration testing via Pytest across isolated services.

## Version B — ML Engineer (Model/Data Focus)
- **Trained an XGBoost fraud classification model** on the IEEE-CIS dataset, engineering categorical and continuous tabular features to establish a robust anomaly detection baseline.
- **Implemented rigorous validation methodology** by splitting data chronologically (70/15/15) and tuning operational thresholds on the validation set to balance precision and recall.
- **Evaluated final model performance** strictly on a quarantined held-out test set, achieving a 0.784 Precision and a 0.692 PR-AUC in a highly imbalanced positive-class distribution.

## Version C — AI / Agent Engineer (LLM Integration Focus)
- **Developed a controlled LLM investigation agent** equipped with scoped context tools, converting raw fraud risk scores into structured JSON evidence and actionable reason codes.
- **Engineered an anti-hallucination validation layer** that compares LLM outputs against trusted deterministic tool results, safely degrading ambiguous cases to manual REVIEW.
- **Decoupled AI recommendation from policy enforcement**, ensuring that high LLM confidence could never bypass hard-coded security boundaries or automatically block legitimate transactions.
