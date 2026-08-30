# RiskSentinel X - 3-Minute Technical Deep Dive

**Interviewer:** "Walk me through the architecture."

**Answer:** 
"RiskSentinel X is an event-driven risk platform designed to govern AI investigations safely. 

**Detect (ML):**
Transactions enter the FastAPI backend and are immediately scored by our XGBoost model, trained on the IEEE-CIS benchmark. XGBoost handles the non-linear tabular feature interactions and returns a risk probability.

**Connect (Graph):**
Simultaneously, a NetworkX engine running Louvain community detection checks the transaction entities against our synthetic relationship graph. It looks for hidden linkages like shared devices or IPs, generating a graph risk signal.

**Investigate (AI Agent):**
If risk is detected (e.g., probability > 0.15), a controlled LLM agent invokes exactly two tools—`get_transaction_history` and `get_graph_context`—to synthesize structured JSON evidence. The LLM then generates a reason code and an action recommendation. 

**Explain (Safety Boundary):**
Crucially, the LLM does not independently block transactions. We use deterministic Pydantic schema validation to verify the LLM's evidence. If it hallucinates unsupported facts (like '5 shared IPs' when the graph only returned '1'), the validation layer strips the evidence and flags the agent state as degraded.

**Decide (Policy):**
A hard-coded Python Policy Engine evaluates the ML risk, Graph signals, and verified Agent evidence to make the final deterministic choice between ALLOW, REVIEW, and BLOCK. For instance, an automatic BLOCK requires ML Risk > 0.85 *and* corroborating evidence; high agent confidence alone cannot bypass this rule.

**Audit:**
The entire execution trace—tool calls, evidence, reason codes, ML scores, and final policy enforcement—is securely recorded into a PostgreSQL audit store. This allows full reconstruction through a Next.js Live Dashboard using Server-Sent Events (SSE) for current session visualization."
