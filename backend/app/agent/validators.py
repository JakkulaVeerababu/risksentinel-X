import logging
from typing import Dict, Any
from app.agent.schemas import InvestigationResult, ReasonCodeEnum

class DeterministicValidator:
    """
    Validates LLM output against the actual ground-truth tool outputs.
    Rejects hallucinated evidence and unsupported reason codes.
    """
    
    @staticmethod
    def validate_and_filter(result: InvestigationResult, context: Dict[str, Any]) -> InvestigationResult:
        logging.info("Validator: Cross-checking LLM evidence against deterministic tool outputs...")
        
        valid_evidence = []
        valid_reason_codes = set()
        
        tx_history = context.get("transaction_history", {})
        graph_ctx = context.get("graph_context", {})
        
        # Build namespaces of allowed facts from context
        allowed_namespaces = {
            "transaction_history": {k: str(v) for k, v in tx_history.items()},
            "graph_context": {k: str(v) for k, v in graph_ctx.items()}
        }
        
        # Keep flat lookup for reason code validation
        allowed_facts = {}
        allowed_facts.update(allowed_namespaces["transaction_history"])
        allowed_facts.update(allowed_namespaces["graph_context"])
            
        # 1. Validate Evidence (Anti-Hallucination)
        for item in result.evidence:
            source_namespace = allowed_namespaces.get(item.source)
            
            if source_namespace is None:
                logging.warning(f"Hallucination Blocked: Invalid source {item.source}")
                continue
                
            if item.signal in source_namespace:
                if str(item.observed) == source_namespace[item.signal]:
                    valid_evidence.append(item)
                else:
                    logging.warning(f"Hallucination Blocked: {item.source}.{item.signal} claimed {item.observed}, actual {source_namespace[item.signal]}")
            else:
                logging.warning(f"Hallucination Blocked: Unknown signal {item.signal} in source {item.source}")
                
        # 2. Validate Reason Codes (Must have backing evidence)
        for rc in result.reason_codes:
            if rc == ReasonCodeEnum.DEVICE_REUSE and "shared_device_count" in allowed_facts and int(allowed_facts["shared_device_count"]) > 1:
                valid_reason_codes.add(rc)
            elif rc == ReasonCodeEnum.IP_REUSE and "shared_ip_count" in allowed_facts and int(allowed_facts["shared_ip_count"]) > 1:
                valid_reason_codes.add(rc)
            elif rc == ReasonCodeEnum.VELOCITY_ANOMALY and "recent_transaction_count" in allowed_facts and int(allowed_facts["recent_transaction_count"]) > 2:
                valid_reason_codes.add(rc)
            elif rc == ReasonCodeEnum.GRAPH_CLUSTER_RISK and allowed_facts.get("cluster_detected") == "True":
                valid_reason_codes.add(rc)
            elif rc in [ReasonCodeEnum.UNUSUAL_AMOUNT, ReasonCodeEnum.HIGH_ML_RISK, ReasonCodeEnum.INSUFFICIENT_EVIDENCE]:
                # These are softer, allow them if model feels it's right based on context
                valid_reason_codes.add(rc)
            else:
                logging.warning(f"Unsupported Reason Code Stripped: {rc.value}")
                
        # 3. Apply safe degradation if validation fundamentally failed
        if len(valid_evidence) == 0 and len(result.evidence) > 0:
            logging.error("All proposed evidence was hallucinated. Applying SAFE DEGRADATION.")
            result.recommendation = "REVIEW"
            result.confidence = 0.0
            valid_reason_codes = {ReasonCodeEnum.INSUFFICIENT_EVIDENCE}
            
        result.evidence = valid_evidence
        result.reason_codes = list(valid_reason_codes)
        
        return result
