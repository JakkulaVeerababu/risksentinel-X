# Troubleshooting Guide

## Backend Cannot Connect to PostgreSQL
- **Symptom:** `psycopg2.OperationalError: could not connect to server`.
- **Fix:** Ensure Docker is running. The `db` container might take a few seconds to initialize. Restart the `backend` container or ensure the `DATABASE_URL` in `.env` is correct.

## Model Artifact Not Found
- **Symptom:** FastAPI fails to start with `FileNotFoundError: models/xgb-ieeecis-v1/model.json`.
- **Fix:** Ensure you have either trained the model locally via `python scripts/train_xgboost.py` or downloaded the pre-compiled hackathon artifacts into the `models/` directory.

## WebSocket / SSE Disconnected
- **Symptom:** The dashboard stops updating live transactions.
- **Fix:** Server-Sent Events (SSE) connections may drop if the backend restarts. The frontend is configured with auto-reconnect, but if it stalls, a hard refresh (F5) of the dashboard clears the stalled listener.

## Agent Provider Unavailable
- **Symptom:** Logs show `LLMTimeoutError`.
- **Fix:** This is an expected failure mode. The system degrades safely and the transaction is routed to `REVIEW`. No manual fix required unless the outage is permanent.

## Docker Port Already In Use
- **Symptom:** `Bind for 0.0.0.0:5432 failed: port is already allocated`.
- **Fix:** Another local PostgreSQL instance is running. Stop the local service (`sudo service postgresql stop`) or change the mapped port in `docker-compose.yml` (e.g., `"5433:5432"`).
