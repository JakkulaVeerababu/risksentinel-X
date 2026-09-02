import logging
from typing import List, Any
from datetime import datetime, timezone
from app.policy.schemas import PolicyInput, PolicyDecisionResult
from app.policy.config import POLICY_VERSION

class PolicyEngine:
    """
    Dynamic rules engine.
    Evaluates inputs against user-defined active policies from the database.
    Falls back to a safe REVIEW decision if no policies match.
    """
    
    def evaluate(self, inputs: PolicyInput, active_policies: List[Any] = None) -> PolicyDecisionResult:
        logging.info(f"PolicyEngine evaluating transaction: {inputs.transaction_id} with {len(active_policies or [])} policies")
        
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
        
        if active_policies is None:
            active_policies = []

        # Build context dictionary for dynamic evaluation
        context = {
            "ml_score": inputs.ml_score,
            "graph_score": inputs.graph_score,
            "agent_state": inputs.agent_state,
            "agent_recommendation": inputs.agent_recommendation,
            "agent_confidence": inputs.agent_confidence
        }
        
        final_decision = "ALLOW" # Safe fallback
        matched_rule = "SAFE_FALLBACK_ALLOW"
        reason = "NO_MATCHING_POLICY"
        
        for policy in active_policies:
            if self._evaluate_conditions(policy.conditions, context):
                final_decision = policy.action
                matched_rule = policy.policy_id
                reason = policy.reason_code
                break

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

    def _evaluate_conditions(self, conditions: dict, context: dict) -> bool:
        if not conditions or "operator" not in conditions or "rules" not in conditions:
            return False
        
        op = conditions["operator"]
        rules = conditions["rules"]
        if not rules:
            return False
            
        results = [self._evaluate_rule(r, context) for r in rules]
        
        if op == "AND":
            return all(results)
        if op == "OR":
            return any(results)
        return False

    def _evaluate_rule(self, rule: dict, context: dict) -> bool:
        field = rule.get("field")
        op = rule.get("operator")
        val = rule.get("value")
        
        if field not in context:
            return False
            
        actual_val = context[field]
        if actual_val is None:
            return False
            
        try:
            # Type coercion for comparison
            if isinstance(val, (int, float)) and isinstance(actual_val, (int, float)):
                if op == "==": return actual_val == val
                if op == "!=": return actual_val != val
                if op == ">=": return actual_val >= val
                if op == "<=": return actual_val <= val
                if op == ">": return actual_val > val
                if op == "<": return actual_val < val
            else:
                val_str = str(val)
                actual_str = str(actual_val)
                if op == "==": return actual_str == val_str
                if op == "!=": return actual_str != val_str
                
                # Try parsing as float if inequality operator is used on strings
                if op in [">=", "<=", ">", "<"]:
                    return self._compare_numeric(actual_str, val_str, op)
        except (ValueError, TypeError):
            return False
            
        return False
        
    def _compare_numeric(self, val1_str: str, val2_str: str, op: str) -> bool:
        try:
            v1 = float(val1_str)
            v2 = float(val2_str)
            if op == ">=": return v1 >= v2
            if op == "<=": return v1 <= v2
            if op == ">": return v1 > v2
            if op == "<": return v1 < v2
        except ValueError:
            pass
        return False
