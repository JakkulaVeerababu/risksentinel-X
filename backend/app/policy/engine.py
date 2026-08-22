import logging
from app.policy.schemas import PolicyInput, PolicyDecisionResult
from app.policy.config import PolicyConfig

class PolicyEngine:
    """
    Deterministic rules engine.
    Ensures LLM Agent recommendations are advisory, subject to verified metrics.
    """
    
    def __init__(self):
        self.config = PolicyConfig.get_instance()
        
    def evaluate(self, inputs: PolicyInput) -> PolicyDecisionResult:
        logging.info(f"Policy Engine evaluating {inputs.transaction_id}")
        
        triggered_rules = []
        decision = "REVIEW" # Default Safe State
        decision_reason = "UNCERTAIN_SIGNALS"
        
        ml_high = inputs.ml_risk_score >= self.config.ml_high_threshold
        ml_low = inputs.ml_risk_score < self.config.ml_low_threshold
        graph_strong = inputs.graph_risk_score >= self.config.graph_high_threshold and inputs.graph_cluster_detected
        agent_valid = inputs.agent_status == "COMPLETED"
        agent_says_block = inputs.agent_recommendation == "BLOCK"
        sufficient_evidence = inputs.agent_evidence_count >= self.config.min_block_evidence_count
        
        # Rule 1: ALLOW (Low risk everything)
        if ml_low and not graph_strong and inputs.agent_recommendation != "BLOCK":
            triggered_rules.append("POL-ALLOW-001:ML_AND_GRAPH_LOW")
            decision = "ALLOW"
            decision_reason = "ALL_SIGNALS_LOW"
            
        # Rule 2: BLOCK (Multi-signal requirement)
        elif ml_high and graph_strong and agent_valid and agent_says_block and sufficient_evidence:
            triggered_rules.append("POL-BLOCK-001:MULTI_SIGNAL_CONFIRMED")
            decision = "BLOCK"
            decision_reason = "CRITICAL_RISK_VERIFIED"
            
        # Rule 3: LLM OVERRIDE - REVIEW (Agent wants to block, but ML/Graph don't support it strongly)
        elif agent_says_block and (not ml_high or not graph_strong):
            triggered_rules.append("POL-REVIEW-001:AGENT_OVERRIDE_WEAK_SIGNALS")
            decision = "REVIEW"
            decision_reason = "LLM_RECOMMENDATION_NOT_VERIFIED"
            
        # Rule 4: REVIEW (Agent degraded/unavailable)
        elif not agent_valid:
            triggered_rules.append("POL-SAFE-AGENT-001:AGENT_DEGRADED")
            decision = "REVIEW"
            decision_reason = "UNCERTAIN_MISSING_AGENT_CONTEXT"
            
        # Rule 5: REVIEW (Missing evidence for block)
        elif ml_high and graph_strong and agent_says_block and not sufficient_evidence:
            triggered_rules.append("POL-REVIEW-002:INSUFFICIENT_EVIDENCE")
            decision = "REVIEW"
            decision_reason = "MISSING_EVIDENCE_FOR_BLOCK"
            
        # Rule 6: Catch all REVIEW (Moderate ML, Moderate Graph, etc)
        else:
            triggered_rules.append("POL-REVIEW-003:DEFAULT_UNCERTAINTY")
            decision = "REVIEW"
            decision_reason = "CONFLICTING_OR_MODERATE_SIGNALS"
            
        return PolicyDecisionResult(
            transaction_id=inputs.transaction_id,
            decision=decision,
            policy_version=self.config.policy_version,
            decision_reason=decision_reason,
            triggered_rules=triggered_rules,
            inputs={
                "ml_risk": inputs.ml_risk_score,
                "graph_risk": inputs.graph_risk_score,
                "agent_recommendation": inputs.agent_recommendation,
                "agent_confidence": inputs.agent_confidence
            }
        )
