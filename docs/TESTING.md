# Testing Runbook

## Test Suites
RiskSentinel X uses `pytest` for all backend validation. 
- **Unit Tests:** `pytest tests/unit/`
- **Integration Tests:** `pytest tests/integration/`
- **E2E Tests:** `pytest tests/e2e/`

Run the entire critical regression suite:
```bash
pytest tests/
```

## Critical Regression Tests
The following permanent regression tests MUST pass before any release:
- `test_invalid_json_handled_gracefully`
- `test_hallucinated_evidence_rejected`
- `test_unsupported_reason_code_dropped`
- `test_agent_unavailable_degrades_safely`
- `test_policy_override_agent_block`
- `test_graph_ground_truth_leakage`
- `test_model_unavailable_degrades_safely`
- `test_audit_persistence_guarantees`

## Test Fixtures
> **WARNING:** Fixtures in `tests/conftest.py` are TEST ONLY. Future engineers must not accidentally use these mock transactions as real or demo data in production endpoints.
