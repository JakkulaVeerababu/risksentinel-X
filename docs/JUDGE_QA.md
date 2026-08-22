# RiskSentinel X - Judging Defense Q&A

This document contains defensive answers to aggressive technical scrutiny from Razorpay engineering judges. 
If an answer isn't here, fall back to the core principle: **Models detect. Graphs connect. Agents investigate. Policies decide.**

## Core Questions

**Q: What is the main innovation?**
A: RiskSentinel X turns a fraud-risk score into a bounded, evidence-driven investigation workflow. ML detects anomalies, graph intelligence connects related entities, an agent investigates using controlled tools, and deterministic policy retains enforcement authority.

**Q: Why not just use XGBoost?**
A: XGBoost can estimate risk, but a score alone does not explain connected devices, shared infrastructure, investigation evidence, or how an operational decision should be safely enforced. RiskSentinel adds those investigation and governance layers.

## ML & Dataset Questions

**Q: Is this Razorpay data?**
A: No. The ML benchmark uses public IEEE-CIS data, and graph evaluation uses a labeled synthetic relationship benchmark. No private Razorpay customer data is used.

**Q: How did you select your ML thresholds?**
A: Thresholds were selected using validation data. The held-out test set was reserved for final evaluation and was not used to tune the operating points.

**Q: Why PR-AUC? Why not Accuracy?**
A: Fraud is the minority class. PR-AUC focuses on positive-class retrieval quality and precision/recall tradeoffs. Accuracy can remain artificially high (e.g., 99%) while missing massive amounts of fraud.

**Q: Is 0.87 really an 87% probability of fraud?**
A: It is the model's output risk score/probability estimate, but we have not claimed production-grade calibration. Calibration (Platt scaling / Isotonic regression) is future work.

## Graph Questions

**Q: Why do you need a graph when you already have ML?**
A: Transaction features identify unusual behavior, while graphs expose relationships: shared devices, shared IPs, and connected accounts. These are different types of signals.

**Q: Why is the graph data synthetic?**
A: The public ML benchmark does not provide the complete customer-device-IP-payment-instrument relationship network needed for graph evaluation, so we built a labeled synthetic benchmark with known ground truth.

**Q: Why Louvain? What if communities change?**
A: Louvain efficiently discovers dense relationship groups without predefined labels. However, a Louvain community is *not* automatically fraud—suspicion only triggers when multiple risk signals (e.g., density + shared IPs) cross the deterministic threshold.

## Agent & AI Safety Questions

**Q: Why use an LLM?**
A: The LLM is used for bounded evidence synthesis and recommendation, not raw mathematical calculation or final enforcement. Deterministic services calculate the underlying signals, and the agent can only reason over trusted structured evidence.

**Q: Can the AI block a transaction?**
A: No. The agent may recommend BLOCK, but automatic blocking requires deterministic policy conditions based on multiple verified signals. High LLM confidence alone can never block a transaction.

**Q: How do you prevent hallucinations?**
A: Agent evidence is validated against trusted transaction, ML, history, and graph outputs. Unsupported facts and reason codes are strictly rejected. Invalid or unavailable agent output safely degrades to REVIEW rather than becoming a final decision.

**Q: What if the AI fails or goes down?**
A: ML and graph analysis continue. The agent is marked DEGRADED, and deterministic policy continues. Ambiguous cases route to REVIEW rather than relying on fabricated AI output.

## Policy & Audit Questions

**Q: Why REVIEW? Why not just ALLOW or BLOCK?**
A: Risk signals can conflict, evidence can be missing, or false-positive costs may be too high. REVIEW provides a bounded uncertainty state, preventing unsafe binary automation.

**Q: Why don't you show the AI's Chain of Thought?**
A: RiskSentinel exposes the auditable artifacts that matter operationally—tool calls, evidence, reason codes, recommendations, and policy rules—rather than claiming access to private model chain-of-thought, which can be misleading or hallucinated.

## Scale & Production Readiness

**Q: Is this production ready?**
A: No. It is a prototype demonstrating the architecture and evaluation methodology. Production use would require domain-specific data, stronger security and compliance controls, monitoring, governance, calibration, scalability validation, and mature analyst operations.

**Q: Would NetworkX scale to Razorpay?**
A: Not in this prototype configuration. Production-scale relationship querying would likely require distributed graph infrastructure (e.g., Neo4j, Neptune) and streaming architectures (Kafka).
