# ADR-003: Why Exactly Two Agent Tools

**Context:** The LLM agent needed tools to retrieve context for its investigation without creating an uncontrollable or overly complex attack surface.

**Decision:** We strictly limited the agent to exactly two tools: `get_transaction_history` and `get_graph_context`.

**Alternatives Considered:**
- Providing direct SQL access to the agent.
- Providing 10+ granular micro-tools (e.g., `get_user_ip`, `get_device_id`).

**Tradeoffs:** While SQL or many tools provide flexibility, they massively increase the risk of prompt injection, hallucinations, and un-auditable execution paths.

**Consequences:** Two focused tools guarantee the agent only receives highly structured JSON payloads regarding a specific entity's past behavior and relationships. This bounded MVP approach made Pydantic evidence validation feasible and dramatically simplified the audit log.
