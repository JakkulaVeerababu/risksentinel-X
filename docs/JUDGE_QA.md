# RiskSentinel X — Judge Q&A

Core principle: **Models detect. Graphs connect. Agents investigate. Policies decide.**

---

## Innovation & Architecture

**Q: What is the main innovation?**
A: The separation between recommendation and authority. AI investigates and recommends, but a deterministic policy engine retains enforcement authority. The strongest differentiator is that AI is constrained inside an evidence-driven deterministic governance pipeline.

**Q: How is this different from a fraud dashboard?**
A: A dashboard displays data. RiskSentinel X is an investigation *pipeline* — it automatically connects entities via graph analysis, invokes bounded AI investigation when warranted, applies deterministic policy, and produces an auditable decision trail. The dashboard is the output surface, not the intelligence.

**Q: Why not just use an LLM?**
A: LLMs hallucinate, are vulnerable to prompt injection, and cannot provide deterministic guarantees. RiskSentinel X uses the LLM strictly for bounded evidence synthesis — never for scoring, graph analysis, or final decisions. Deterministic services calculate signals; the agent reasons over trusted structured evidence only.

---

## ML Questions

**Q: Why XGBoost?**
A: XGBoost excels on tabular fraud data with strong performance on imbalanced classes, interpretable feature importance, and fast inference. It is the standard baseline in financial fraud detection competitions and production systems.

**Q: Are these Razorpay transactions?**
A: No. The ML benchmark uses the public IEEE-CIS Fraud Detection dataset from Kaggle. Graph evaluation uses a synthetic seeded relationship benchmark. No private Razorpay customer data is used.

**Q: Where did the data come from?**
A: ML: IEEE-CIS Fraud Detection (public Kaggle). Graph: synthetic seeded benchmark with known ground truth. Agent/policy: controlled synthetic evaluation scenarios.

**Q: How accurate is it?**
A: On the frozen IEEE-CIS held-out split (88,581 rows): AP = 0.4810, Precision = 0.4535, Recall = 0.4635, F1 = 0.4585 at threshold 0.80. These numbers were frozen without post-test tuning.

**Q: Why is ML F1 only ~0.46?**
A: IEEE-CIS is highly imbalanced (~3.5% fraud). The frozen 0.80 threshold is precision-oriented — we prefer fewer false positives over catching every fraud case. Crucially, RiskSentinel X does not rely on ML alone. The architecture combines ML, graph context, AI investigation and deterministic policy. The held-out numbers were frozen without post-test tuning, which demonstrates evaluation integrity over inflated metrics.

**Q: Why threshold 0.80?**
A: Selected on the validation split to balance precision and recall for a high-risk payment investigation context. The held-out test set was never used for threshold selection or tuning.

---

## Graph Questions

**Q: Why NetworkX?**
A: Rapid prototyping for a hackathon. NetworkX provides rich graph algorithms (Louvain community detection, centrality measures) in pure Python, ideal for demonstrating the architecture without distributed infrastructure overhead.

**Q: Why graph fraud detection?**
A: Transaction features identify unusual behavior in isolation. Graphs expose *relationships*: shared devices, shared IPs, connected accounts, coordinated velocity. These are fundamentally different signal types. A transaction that looks normal individually may be part of a collusion ring.

**Q: How would this scale beyond NetworkX?**
A: Production would use distributed graph infrastructure (Neo4j, Amazon Neptune, JanusGraph) with streaming ingestion (Kafka) and pre-computed graph features. NetworkX is a prototype-scale demonstration of the architectural pattern.

---

## Agent & AI Safety

**Q: Can the AI block a transaction?**
A: No. The agent may recommend BLOCK with 0.99 confidence, but automatic blocking requires ML ≥ 0.80 AND Graph ≥ 0.30 in the deterministic policy. High LLM confidence alone can never block a transaction.

**Q: What happens if the AI hallucinates?**
A: Agent evidence is validated against Pydantic schemas. Unsupported reason codes and evidence types are rejected. If the agent produces invalid output, it degrades to REVIEW status — never to ALLOW. The deterministic pipeline continues with ML + Graph evidence.

**Q: What happens if Ollama fails?**
A: ML and graph analysis continue normally. The agent is marked DEGRADED. The deterministic policy continues — missing agent evidence routes ambiguous cases to REVIEW rather than ALLOW. The audit trail records the failure.

**Q: How do you prevent AI from blocking legitimate payments?**
A: The agent cannot block anything. It recommends. The deterministic policy requires multiple verified quantitative signals (ML ≥ 0.80 AND Graph ≥ 0.30) before issuing BLOCK. A single strong signal from any component — including the agent — routes to REVIEW for human investigation, not automatic blocking.

---

## Policy & Governance

**Q: Why deterministic policy?**
A: Deterministic rules are auditable, reproducible, and free from hallucination. Every decision can be explained by citing the exact policy rule that fired (e.g., P-V1-002). Regulators and compliance teams require this level of traceability.

**Q: Why REVIEW? Why not just ALLOW or BLOCK?**
A: Risk signals can conflict, evidence can be missing, or false-positive costs may be too high. REVIEW provides a bounded uncertainty state that routes to human investigation, preventing unsafe binary automation.

---

## Scale & Production

**Q: How would you deploy this at Razorpay scale?**
A: Current MVP uses NetworkX + PostgreSQL + single-service. Production architecture would add: stream processing (Kafka), feature store, distributed graph store (Neo4j/Neptune), model-serving layer, message queues, policy service, and observability (Prometheus/Grafana). This is clearly labeled as future work.

**Q: Is this production ready?**
A: No. It is a prototype demonstrating the architecture and evaluation methodology. Production deployment requires domain-specific data, authentication, rate limiting, TLS, container hardening, compliance controls, monitoring, and mature analyst operations.

---

## Razorpay Relevance

**Q: How is this relevant to Razorpay?**
A: Razorpay risk teams investigate transaction anomalies, shared entities, coordinated behavior, false positives, and case evidence. RiskSentinel X demonstrates an architecture for reducing manual investigation effort while maintaining deterministic governance — the same fundamental problem Razorpay's risk operations face at scale.
