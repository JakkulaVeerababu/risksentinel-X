# RiskSentinel X — Submission Copy

---

## 50-Word Description

RiskSentinel X is an evidence-driven fraud investigation platform combining XGBoost scoring, graph-based collusion detection, bounded AI investigation, and deterministic policy governance. The AI investigates and recommends — but a rule engine makes the final auditable ALLOW/REVIEW/BLOCK decision. No LLM hallucination can autonomously block a transaction.

---

## 100-Word Description

Fraud systems flag suspicious transactions, but investigators still need to understand relationships, validate evidence, and apply policy consistently. RiskSentinel X automates this investigation pipeline: XGBoost scores transaction risk, a NetworkX graph engine discovers shared devices and coordinated behavior, and a bounded AI agent synthesizes evidence using read-only tools. Critically, the AI never makes the final decision — a deterministic policy engine maps quantitative evidence to ALLOW, REVIEW, or BLOCK, ensuring no hallucination causes a false block. Every decision is logged to a complete audit trail. The architecture separates recommendation from authority, keeping AI-powered investigation safe and auditable.

---

## 250-Word Description

Traditional fraud detection stops at a risk score. A score of 0.92 tells an analyst to act, but not *why* — who shares this device, whether there's a coordinated ring, or what evidence actually supports blocking. If an LLM is given autonomous blocking authority, hallucinations create false positives and governance risk.

RiskSentinel X solves this with a six-stage evidence pipeline: **Detect → Connect → Investigate → Explain → Decide → Audit.**

**Detect:** An XGBoost classifier trained on the IEEE-CIS Fraud Detection dataset scores transaction risk based on engineered features.

**Connect:** A NetworkX graph engine discovers hidden relationships — shared devices, IPs, and payment instruments — using Louvain community detection.

**Investigate:** When evidence crosses thresholds, a bounded AI agent (Ollama/llama3) investigates using exactly two read-only tools: transaction history and graph context. It produces structured JSON evidence with validated reason codes.

**Decide:** A deterministic policy engine (policy-v1) maps the quantitative ML and graph signals to ALLOW, REVIEW, or BLOCK. The AI agent's recommendation has no weight in the policy formula. If the agent recommends BLOCK but the hard evidence is weak, policy overrides to REVIEW.

**Audit:** Every decision is logged chronologically — ML score, graph risk, tool calls, agent evidence, policy rule, and timestamp — enabling complete reconstruction.

The result: AI-powered investigation with deterministic governance. No LLM hallucination can autonomously block a legitimate payment. Models detect. Graphs connect. Agents investigate. Policies decide.

---

## Problem Statement

Fraud systems can flag suspicious transactions, but investigators still need to understand relationships, validate evidence, and apply policy consistently. LLM-only automation introduces hallucination and governance risk. RiskSentinel X constrains AI inside an evidence-driven deterministic governance pipeline, separating investigation from enforcement authority.

---

## Innovation Claim

RiskSentinel X's primary innovation is not "we used AI." It is: **AI is constrained inside an evidence-driven deterministic governance pipeline.** The strongest differentiator is the architectural separation between recommendation (what the AI thinks) and authority (what the policy permits).

---

## Product Description

RiskSentinel X is an evidence-driven AI risk investigation and governance platform that combines machine-learning risk scoring, relationship-graph intelligence, bounded AI investigation, and deterministic policy enforcement.
