# ADR-002: Why NetworkX

**Context:** The system required a graph intelligence layer to detect suspicious linkages (shared devices, IPs) across transactions to augment the isolated ML score.

**Decision:** We chose NetworkX (an in-memory Python graph library) to build the prototype graph and run Louvain community detection.

**Alternatives Considered:**
- *Neo4j / Amazon Neptune:* Enterprise-grade distributed graph databases.
- *Relational DB Joins:* Slow and complex for multi-hop graph traversals.

**Tradeoffs:** NetworkX is free, open-source, and highly transparent for a hackathon MVP. However, it requires the entire graph to fit in RAM and does not scale to millions of concurrent transactions or distributed nodes. 

**Consequences:** The MVP can demonstrate graph-risk calculation successfully in a bounded local environment. For a production deployment, this layer must be rewritten to utilize a dedicated graph database.
