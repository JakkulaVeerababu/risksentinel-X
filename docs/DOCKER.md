# Docker Runbook

## Standard Startup
To launch the full MVP environment (Backend, Frontend, PostgreSQL DB, Admin):
```bash
docker compose up --build
```
This maps local volumes and exposes ports (e.g., UI on 3000, API on 8000, DB on 5432).

## Standard Shutdown
To stop the services safely:
```bash
docker compose down
```
> **WARNING:** `docker compose down -v` is safe ONLY IF you intend to permanently delete the persistent PostgreSQL audit logs. Use with caution.

## Environment Variables
The `.env` file must never be committed. 

**Database:**
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `DATABASE_URL`

**Application:**
- `FRONTEND_URL`
- `BACKEND_URL`
- `API_KEY` (if implemented)
- `SIMULATE_AGENT_FAILURE` (Feature toggle for demoing degraded state)

**Agent:**
- `OPENAI_API_KEY` (Mocked in MVP)
- `ANTHROPIC_API_KEY` (Mocked in MVP)

## Secret Management
API keys and database passwords are sensitive. The provided `.env.example` file contains safe dummy values for local development.
