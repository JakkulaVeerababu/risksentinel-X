import logging
from pydantic import BaseModel
from app.policy.schemas import PolicyInput, PolicyDecisionResult
from app.policy.engine import PolicyEngine

# In a real architecture, this service would fetch ML, Graph, and Agent results
# from the internal services/DB. For this MVP, we accept a structured DecisionRequest
# to simulate the pipeline orchestration.

class DecisionRequest(BaseModel):
    transaction_id: str
    customer_id: str
    graph_entity_id: str

class PolicyService:
    def __init__(self):
        self.engine = PolicyEngine()
        
    def evaluate_decision(self, request: DecisionRequest) -> PolicyDecisionResult:
        logging.info(f"PolicyService: Building context for {request.transaction_id}")
        
        # 1. MOCK RETRIEVAL OF INTERNAL STATE 
        # (In reality, we would call RiskModelService, GraphRiskService, InvestigationService)
        # We simulate fetching the context based on a hash of the transaction ID for testing.
        
        tx_hash = hash(request.transaction_id) % 100
        
        # Simulate different scenarios based on ID
        if tx_hash > 80:
            # High Risk Scenario
            ml_risk = 0.95
            graph_risk = 0.92
            cluster = True
            rec = "BLOCK"
            ev_count = 3
        elif tx_hash < 20:
            # Low Risk Scenario
            ml_risk = 0.05
            graph_risk = 0.10
            cluster = False
            rec = "ALLOW"
            ev_count = 0
        else:
            # Ambiguous/Review Scenario
            ml_risk = 0.50
            graph_risk = 0.40
            cluster = False
            rec = "REVIEW"
            ev_count = 1
            
        policy_input = PolicyInput(
            transaction_id=request.transaction_id,
            ml_risk_score=ml_risk,
            graph_risk_score=graph_risk,
            graph_cluster_detected=cluster,
            agent_status="COMPLETED",
            agent_recommendation=rec,
            agent_confidence=0.85,
            agent_evidence_count=ev_count
        )
        
        # 2. EVALUATE DETERMINISTIC RULES
        decision = self.engine.evaluate(policy_input)
        
        return decision
