# Demo Runbook

Follow these pre-flight checks before recording or presenting the live demo.

## Pre-Demo Checks
1. **Clean State:**
   - Run `docker compose down -v` to wipe previous database state.
   - Run `docker compose up -d --build` to start a fresh environment.
2. **Health Verification:**
   - Backend API: Check `http://localhost:8000/health` (should return 200 OK).
   - Frontend UI: Open `http://localhost:3000` (ensure no React console errors).
3. **Environment:**
   - Ensure `.env` is loaded with `AGENT_PROVIDER=mock` (unless explicitly testing Claude/Ollama live).
   - Confirm `GRAPH_SUSPICIOUS_THRESHOLD` is set to `0.6`.
4. **Browser Setup:**
   - Close all unrelated tabs.
   - Maximize browser window or set to 1080p resolution.
   - Disable Slack/email notifications.

## Fallback Plans
- **LLM Unavailable:** If Claude API times out during a live demo, the system is designed to gracefully degrade. The UI will show Agent Status as `FAILED`, and the Policy Engine will route the transaction to `REVIEW`. State: "As designed, if the LLM provider fails, our deterministic policy ensures the transaction is safely routed to human review, preventing a pipeline crash."
- **Dashboard Disconnects:** Refresh the page. The SSE connection will automatically re-establish.
