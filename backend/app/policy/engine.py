import logging
from datetime import datetime, timezone
from app.policy.schemas import PolicyInput, PolicyDecisionResult
from app.policy.config import POLICY_VERSION, ML_THRESHOLD, GRAPH_THRESHOLD

class PolicyEngine:
    """
    Deterministic rules engine (Phase 4).
    Ensures LLM Agent recommendations are advisory and do not override hard signals.
    """
    
    def evaluate(self, inputs: PolicyInput) -> PolicyDecisionResult:
        logging.info(f"PolicyEngine evaluating transaction: {inputs.transaction_id}")
        
        # Check for unavailable graph evidence FIRST
        if inputs.graph_score is None:
            return PolicyDecisionResult(
                final_decision="REVIEW",
                policy_version=POLICY_VERSION,
                matched_rule_ids=["GRAPH_EVIDENCE_UNAVAILABLE"],
                reason_codes=["GRAPH_EVIDENCE_UNAVAILABLE"],
                ml_score=inputs.ml_score,
                graph_score=None,
                agent_state=inputs.agent_state,
                agent_recommendation=inputs.agent_recommendation,
                agent_confidence=inputs.agent_confidence,
                timestamp=datetime.now(timezone.utc).isoformat()
            )
        
        ml_high = inputs.ml_score >= ML_THRESHOLD
        graph_high = inputs.graph_score >= GRAPH_THRESHOLD
        agent_block = inputs.agent_recommendation == "BLOCK"
        agent_allow = inputs.agent_recommendation == "ALLOW"
        agent_review = inputs.agent_recommendation == "REVIEW"
        
        final_decision = "REVIEW" # Safe fallback
        matched_rule = "SAFE_FALLBACK_REVIEW"
        reason = "SAFE_FALLBACK_REVIEW"
        
        # 1. Independent Machine Evidence Rules (Strongest)
        if ml_high and graph_high:
            final_decision = "BLOCK"
            matched_rule = "P-V1-004"
            reason = "MULTI_SIGNAL_HIGH_RISK"
        
        # 2. Single Machine Signal -> REVIEW
        elif ml_high and not graph_high:
            final_decision = "REVIEW"
            matched_rule = "P-V1-002"
            reason = "ML_HIGH"
            
        elif not ml_high and graph_high:
            final_decision = "REVIEW"
            matched_rule = "P-V1-003"
            reason = "GRAPH_HIGH"
            
        # 3. Agent Governance Rules (When Machine Evidence is Low)
        elif not ml_high and not graph_high:
            if agent_block:
                final_decision = "REVIEW"
                matched_rule = "AGENT_BLOCK_WITHOUT_STRONG_MACHINE_EVIDENCE"
                reason = "AGENT_BLOCK_UNCORROBORATED"
            elif agent_review:
                final_decision = "REVIEW"
                matched_rule = "AGENT_RECOMMENDS_REVIEW"
                reason = "AGENT_REVIEW"
            elif agent_allow or inputs.agent_recommendation is None:
                # Agent ALLOW, SKIPPED, or DEGRADED -> ALLOW
                final_decision = "ALLOW"
                matched_rule = "P-V1-001"
                reason = "LOW_MACHINE_RISK"
            else:
                # Unknown agent recommendation with low machine risk -> REVIEW
                final_decision = "REVIEW"
                matched_rule = "SAFE_FALLBACK_REVIEW"
                reason = "UNKNOWN_AGENT_STATE"

        # 4. Agent Availability Overrides
        # (Though DEGRADED/SKIPPED mostly falls into the rules above, 
        # let's be explicit if needed).
        if inputs.agent_state == "DEGRADED" and final_decision == "ALLOW" and matched_rule == "P-V1-001":
            reason = "LOW_MACHINE_RISK_AGENT_DEGRADED"
        
        return PolicyDecisionResult(
            final_decision=final_decision,
            policy_version=POLICY_VERSION,
            matched_rule_ids=[matched_rule],
            reason_codes=[reason],
            ml_score=inputs.ml_score,
            graph_score=inputs.graph_score,
            agent_state=inputs.agent_state,
            agent_recommendation=inputs.agent_recommendation,
            agent_confidence=inputs.agent_confidence,
            timestamp=datetime.now(timezone.utc).isoformat()
        )
