# Policy Safety Boundary

RiskSentinel X introduces a strict boundary between AI probabilistic reasoning and deterministic enforcement.

## The Problem
LLMs are prone to hallucination, hyper-sensitivity, and prompt injection. If an AI agent has direct authority to issue a `BLOCK` on a financial transaction, a hallucinated piece of evidence could result in severe false-positive merchant friction.

## The RiskSentinel X Solution
**The AI agent never independently blocks transactions.**

1. **Investigation:** The LLM uses bounded tools to gather data.
2. **Recommendation:** The LLM recommends `ALLOW`, `REVIEW`, or `BLOCK` and cites specific reason codes.
3. **Enforcement:** The `PolicyEngine` (a standard, deterministic Python rule engine) evaluates the LLM's recommendation against hard math (the XGBoost ML score and NetworkX Graph score).

### Example: Agent Override
- **Agent Output:** `BLOCK` (Confidence: 0.99, Reason: "High velocity anomaly detected")
- **ML Risk Score:** `0.40`
- **Graph Risk Score:** `0.20`
- **Result:** Because the hard risk scores do not cross the absolute thresholds (ML ≥ 0.80 AND Graph ≥ 0.30), the Policy Engine matches rule `P-V1-003` and the final decision is downgraded to `REVIEW`.

*Models detect. Graphs connect. Agents investigate. Policies decide.*
