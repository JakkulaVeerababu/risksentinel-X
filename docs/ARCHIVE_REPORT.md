# Final Archival Report

- **Project version:** v1.0.0
- **Submission version:** v1.0.0
- **Current commit:** *Frozen release state*
- **Documentation status:** 100% Complete. Runbooks, ADRs, and maintenance guides created.
- **Test status:** 20/20 Critical Regression Tests Passing.
- **Docker status:** `docker compose up --build` functioning cleanly.
- **Evaluation artifact status:** Preserved in `evaluation/final_test_metrics.json`
- **Backup status:** Remote Git synced. No sensitive data exposed. Database persistent volume `.gitignore`d.

## Known Limitations
1. **IEEE-CIS domain mismatch:** The tabular benchmark lacks real-time sequential relationships typical in Razorpay.
2. **Synthetic graph simplification:** Graph topologies are planted explicitly; real-world graphs are noisier.
3. **Illustrative economics:** The FP/FN Cost Explorer uses arbitrary unit costs.
4. **Prototype-scale infrastructure:** In-memory NetworkX and synchronous Python orchestration cannot scale to 5,000 TPS.
5. **LLM recommendation uncertainty:** LLMs remain probabilistic and their reasoning requires the deterministic safety wrap implemented here.

## Future Work
- **Model calibration:** Platt scaling or Isotonic Regression on XGBoost outputs.
- **Production graph infrastructure:** Migration to Neo4j or Amazon Neptune.
- **Streaming Ingestion:** Migration to Apache Kafka for decoupling the pipeline.
- **Analyst feedback loop:** Allowing Dashboard analysts to override the policy and feed labels back into the XGBoost training loop.
