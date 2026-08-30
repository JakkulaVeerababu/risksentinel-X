# RiskSentinel X - Release Report

**Release Version:** v1.0.0-rc1
**Date:** 2026-08-21
**Branch:** main

## Final Status
**RELEASE CANDIDATE READY**

## Test & Verification Matrix
| Component | Status | Notes |
|---|---|---|
| PostgreSQL | Healthy | Started cleanly from `docker-compose up` |
| Backend API | Healthy | Passed all FastAPI health checks (`/health`) |
| Frontend UI | Healthy | Next.js build succeeded, running on port 3000 |
| ML Model | Loaded | XGBoost model hash matches frozen Phase 7 artifact |
| Graph Engine | Loaded | NetworkX synthetic relationships initialized |
| Agent Provider | Healthy | Mock provider initialized cleanly |
| Policy Engine | Ready | Deterministic thresholds match Phase 4 exactly |
| Audit Service | Ready | persisted chronological store initialized |
| Realtime SSE | Connected | Dashboard stream functional |

## Testing Results
- **Backend Tests:** 20 / 20 Passed (Coverage: 92% Critical Path)
- **Frontend Build:** `npm run build` Succeeded with no fatal type errors.
- **Normal E2E:** Verified `ALLOW` for low risk score.
- **Suspicious Simulation:** Verified detection of graph clusters and subsequent `BLOCK`/`REVIEW`.
- **Policy Safety Case:** Verified `TX-111` where Agent=BLOCK and Policy=REVIEW.
- **LLM Failure Case:** Verified graceful degradation to `REVIEW` via `SIMULATE_AGENT_FAILURE` toggle.

## Metric Integrity
Metrics perfectly match `final_test_metrics.json` across the README, Dashboard, and docs:
- **Precision:** 0.784
- **Recall:** 0.542
- **F1 Score:** 0.641
- **PR-AUC:** 0.692
- **TP:** 2,234
- **FP:** 617
- **TN:** 113,874
- **FN:** 1,893

## Security Scan
- **Secrets:** Checked for `OPENAI_API_KEY`, `CLAUDE_API_KEY`. Clean.
- **Raw Data:** No raw `train_transaction.csv` files committed.
- **Mocks:** Verified live paths do not use mock payloads (except the intentionally documented MockProvider for the LLM).

## Non-Blocking Issues
- In-memory `AuditService` sort will not scale infinitely without full PostgreSQL implementation (expected for MVP Prototype).
- Minor CSS flex-wrapping on very small mobile screens for the Evidence panel.
