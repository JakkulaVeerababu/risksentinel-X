# RiskSentinel X - Judge Feedback Responses

**Feedback F-002: NetworkX Scalability**
- **Feedback:** "How does NetworkX scale? Will this handle Razorpay's 5,000 TPS peak load?"
- **Our Assessment:** Valid architectural concern. NetworkX is an in-memory graph library suitable for local modeling and prototyping, but it cannot support horizontal scaling or concurrent high-volume transactions in production.
- **Action Taken:** Acknowledged limitation during Q&A. Documented requirement for distributed graph databases (e.g., Amazon Neptune, Neo4j) and streaming ingestion via Kafka for the production target state.
- **Evidence:** Documented in `POST_JUDGING_REPORT.md` Future Work.
- **Version:** v1.0.0 (Unchanged)

**Feedback F-003: Model Explainability**
- **Feedback:** "Consider adding SHAP values to explain the XGBoost risk score directly on the dashboard."
- **Our Assessment:** Valuable feature request for Tier 2 iteration. SHAP would provide feature-level interpretability.
- **Action Taken:** Logged as Future Work. No MVP architectural changes introduced to maintain verified stability.
- **Evidence:** Added to `POST_JUDGING_REPORT.md`.
- **Version:** v1.0.0 (Unchanged)
