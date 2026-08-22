# RiskSentinel X - Engineering Handoff

## 1. Project Purpose
RiskSentinel X is an evidence-driven AI risk investigation prototype. It bridges the gap between raw ML fraud scores and actionable human reviews by combining XGBoost, NetworkX graph intelligence, controlled LLM agent tools, and a deterministic policy engine into a single auditable pipeline.

## 2. Current Status
**Status:** Hackathon MVP complete and submitted (v1.0.0). Core architecture is frozen. No active major feature development.

## 3. Architecture
The final working pipeline:
```text
Transaction
↓
Input Validation
↓
Feature Engineering
↓
XGBoost (ML Risk)
↓
NetworkX (Graph Intelligence)
↓
Controlled Investigation Agent
↓
Evidence Validation
↓
Reason Codes
↓
Agent Recommendation
↓
Deterministic Policy
↓
ALLOW / REVIEW / BLOCK
↓
Audit (PostgreSQL)
↓
Live Dashboard (SSE)
```

## 4. Component Ownership
| Component | Responsibility |
|---|---|
| Risk Model | Produces ML risk score |
| Graph Engine | Detects suspicious connected relationships |
| Agent | Investigates trusted evidence |
| Evidence Validator | Rejects unsupported agent claims |
| Policy Engine | Produces final deterministic decision |
| Audit Service | Stores decision history |
| Dashboard | Displays investigation state |
| Simulation | Generates defensive synthetic test scenario |

**IMPORTANT SAFETY BOUNDARY:**
The Agent performs investigation and recommendation. The Policy makes the final enforcement decision. **The LLM is never the direct transaction-blocking authority.**

## 5. Local Startup
See `DOCKER.md`. Use `docker compose up --build`.

## 6. Data Sources
- **ML Data:** IEEE-CIS Fraud Detection. (Public benchmark data used to demonstrate model training and evaluation methodology).
- **Graph Data:** Labeled synthetic relationship benchmark. (Synthetic data used to evaluate graph relationship detection).

## 7. Documentation Index
Start by reviewing the following runbooks in order:
- `MODEL_TRAINING.md`
- `GRAPH_ENGINE.md`
- `AGENT.md`
- `POLICY.md`
- `EVALUATION.md`
- `AUDIT.md`
- `SIMULATION.md`
- `TESTING.md`
- `DOCKER.md`
- `TROUBLESHOOTING.md`
