# Project Maintenance Checklist

Before any future release, the following checks must be completed:

- [ ] All `pytest` tests pass (`pytest tests/`)
- [ ] Docker environment builds cleanly (`docker compose up --build`)
- [ ] Secrets check passed (`.env` is excluded, no raw API keys in code)
- [ ] Final metrics remain valid (or have been intentionally regenerated and documented)
- [ ] Model version verified
- [ ] Policy version verified
- [ ] Agent safety tests pass (hallucination rejection, policy overrides)
- [ ] System limitations documentation remains accurate

## Model Update Checklist
- [ ] New model version folder created (e.g., `xgb-ieeecis-v2`)
- [ ] New preprocessing version if needed
- [ ] Training methodology documented
- [ ] Validation performed
- [ ] Threshold frozen
- [ ] New untouched evaluation methodology available
- [ ] Metrics regenerated appropriately
- [ ] README updated

## Policy Update Checklist
- [ ] Policy version incremented (e.g., `policy-v2`)
- [ ] Validation methodology documented
- [ ] Boundary tests pass
- [ ] High-confidence-agent-alone test passes
- [ ] Degraded-agent test passes
- [ ] Audit stores new version

## Agent Update Checklist
- [ ] Agent version incremented
- [ ] Prompt version incremented if relevant
- [ ] Tool surface reviewed
- [ ] Hallucination test passes
- [ ] Unsupported evidence test passes
- [ ] Invalid JSON test passes
- [ ] Prompt injection test passes
- [ ] Provider failure test passes

## Graph Update Checklist
- [ ] Benchmark seed/config recorded
- [ ] Detector still isolated from ground truth
- [ ] Synthetic metrics rerun
- [ ] Graph risk methodology documented
- [ ] Version updated
