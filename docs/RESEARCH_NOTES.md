# Research Notes: RiskSentinel X

## Abstract
Modern fraud models reliably detect statistical anomalies but lack the contextual intelligence required for automated enforcement. This study presents RiskSentinel X, a prototype orchestration pipeline combining tabular risk modeling (XGBoost), graph community detection (NetworkX/Louvain), and a bounded Large Language Model (LLM) investigation agent. Evaluated on the IEEE-CIS benchmark and a synthetic relationship graph, the system achieved a 0.692 PR-AUC in risk detection. We demonstrate that strictly bounding the LLM to two read-only context tools and wrapping its outputs in deterministic Python policy rules safely mitigates hallucination risks, allowing automated evidence synthesis without sacrificing auditability. The primary limitation is the in-memory graph architecture, which requires migration to distributed datastores for enterprise deployment.

## Research Questions
- **RQ1:** Can a tabular risk model provide useful detection performance on a highly imbalanced held-out fraud benchmark?
- **RQ2:** Can graph relationship signals identify planted suspicious communities without direct access to labels?
- **RQ3:** Can a bounded LLM synthesize evidence while deterministic validation prevents unsupported claims from controlling final decisions?
- **RQ4:** Can deterministic policy safely contain agent failure or disagreement?

## Paper Outline
1. Abstract
2. Introduction
3. Related Problem Context (Fraud scores vs Investigation context)
4. System Architecture
5. ML Risk Modeling (XGBoost on IEEE-CIS)
6. Graph Intelligence (NetworkX/Louvain on synthetic benchmark)
7. Controlled AI Investigation (Tool bounding & validation)
8. Deterministic Policy (LLM recommends, Policy decides)
9. Experimental Methodology
10. Results
11. Failure Analysis
12. Limitations
13. Future Work
14. Conclusion

## Threats to Validity
- **Dataset validity:** IEEE-CIS is heavily anonymized and lacks the dynamic sequential flow of real Razorpay production data.
- **Graph validity:** Synthetic networks, even when carefully designed, fail to capture the noisy overlap of legitimate shared resources (e.g., public Wi-Fi) seen in real payment relationships.
- **Measurement validity:** The FP/FN simulation economics use illustrative units, meaning actual operational cost savings remain theoretical.
- **External validity:** The model's performance on this specific dataset does not guarantee identical generalizability to other transaction formats.
