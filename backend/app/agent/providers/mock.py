import json
import logging
from typing import Dict, Any
from app.agent.providers.base import InvestigationLLMProvider
from app.agent.schemas import InvestigationResult

class MockProvider(InvestigationLLMProvider):
    """
    TEST ONLY: Deterministic mock provider for testing structured outputs
    without requiring a paid API or local GPU.
    """
    
    def __init__(self, simulate_failure: bool = False, simulate_hallucination: bool = False):
        self.simulate_failure = simulate_failure
        self.simulate_hallucination = simulate_hallucination

    def generate_structured_investigation(self, prompt: str, context: Dict[str, Any]) -> InvestigationResult:
        logging.info("MockProvider: Simulating LLM generation...")
        
        if self.simulate_failure:
            raise TimeoutError("Mock provider simulated timeout/failure.")
            
        graph_context = context.get("graph_context", {})
        tx_history = context.get("transaction_history", {})
        
        # Build deterministic mock response based on actual input
        reason_codes = []
        evidence = []
        
        # 1. Inspect Graph
        if graph_context.get("cluster_detected", False):
            reason_codes.append("GRAPH_CLUSTER_RISK")
            # If simulating hallucination, invent a fake value
            obs_val = "100" if self.simulate_hallucination else str(graph_context.get("shared_device_count", 0))
            
            evidence.append({
                "signal": "shared_device_count",
                "observed": obs_val,
                "source": "graph_context"
            })
            if graph_context.get("shared_device_count", 0) > 1:
                reason_codes.append("DEVICE_REUSE")
                
        # 2. Inspect History
        if tx_history.get("recent_transaction_count", 0) > 3:
            reason_codes.append("VELOCITY_ANOMALY")
            evidence.append({
                "signal": "recent_transaction_count",
                "observed": str(tx_history.get("recent_transaction_count")),
                "source": "transaction_history"
            })
            
        # Recommendation
        if "GRAPH_CLUSTER_RISK" in reason_codes and "VELOCITY_ANOMALY" in reason_codes:
            rec = "BLOCK"
        elif len(reason_codes) > 0:
            rec = "REVIEW"
        else:
            rec = "ALLOW"
            
        result_dict = {
            "recommendation": rec,
            "confidence": 0.85,
            "reason_codes": reason_codes,
            "evidence": evidence
        }
        
        # Will raise ValidationError if structure is bad
        return InvestigationResult(**result_dict)

    @property
    def provider_info(self) -> str:
        return "mock-deterministic-v1"
