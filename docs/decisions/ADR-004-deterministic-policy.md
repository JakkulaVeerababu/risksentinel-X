# ADR-004: Why Deterministic Policy

**Context:** The system produces probabilistic outputs (ML score, Graph risk) and subjective outputs (LLM reasoning). A mechanism was required to decide whether a transaction is ultimately ALLOWed, REVIEWed, or BLOCKed.

**Decision:** We implemented a strictly deterministic, hard-coded Python Policy Engine as the final enforcement layer. The LLM may only *recommend* an action.

**Alternatives Considered:**
- Allowing the LLM to call a `block_transaction` tool directly based on its own logic.

**Tradeoffs:** An autonomous agent is more flexible and requires less manual tuning of thresholds, but it introduces unacceptable risk in a financial compliance setting (e.g., blocking legitimate users due to hallucinated facts or model drift).

**Consequences:** The deterministic policy ensures that high LLM confidence alone can never bypass hard safety boundaries. It provides 100% repeatability, audibility, and safe degradation if the agent service fails.
