# RiskSentinel X - System Design Evolution

**Interviewer:** "How would you redesign RiskSentinel for millions of transactions per second?"

**Answer:** 
"RiskSentinel X is currently a prototype optimized for rapid local development and architectural validation. To scale it to enterprise volumes (e.g., 5,000 TPS), we would need a distributed streaming architecture.

**1. Event Stream (Ingestion):**
Instead of synchronous HTTP requests to FastAPI, transactions would land on an Apache Kafka or Pulsar topic. This decouples ingestion from processing and absorbs traffic spikes.

**2. Online Feature Service & Model Serving:**
The XGBoost inference would move behind a dedicated high-performance serving layer like NVIDIA Triton or Seldon Core. Features would be fetched from a low-latency distributed cache (e.g., Redis) or an Online Feature Store to avoid heavy database lookups per transaction.

**3. Graph Service:**
In-memory NetworkX is the current bottleneck. It would be replaced by a distributed graph database like Neo4j or Amazon Neptune, capable of millisecond-latency multi-hop traversals over billions of nodes.

**4. Asynchronous Investigation:**
The AI agent is slow (hundreds of milliseconds). It would operate asynchronously on a separate Kafka topic. Only transactions marked 'REVIEW' or high-risk would trigger the agent, conserving API costs and latency.

**5. Deterministic Policy Service:**
The Policy Engine would remain deterministic but scale horizontally via Kubernetes deployments. It would subscribe to the ML, Graph, and Agent streams, emitting final ALLOW/BLOCK decisions back to the core payment gateway.

**6. Audit Stream:**
Finally, the PostgreSQL audit log would transition to an append-only analytical store (like ClickHouse or Snowflake) tailored for high-throughput inserts and rapid risk-analyst querying."
