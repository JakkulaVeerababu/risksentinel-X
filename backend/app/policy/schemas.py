from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any
from app.agent.schemas import InvestigationResult

class PolicyDecisionEnum(str, Literal):
    ALLOW = "ALLOW"
    REVIEW = "REVIEW"
    BLOCK = "BLOCK"

class PolicyInput(BaseModel):
    transaction_id: str
    ml_risk_score: float = Field(ge=0.0, le=1.0)
    graph_risk_score: float = Field(ge=0.0, le=1.0)
    graph_cluster_detected: bool
    agent_status: str
    agent_recommendation: str
    agent_confidence: float = Field(ge=0.0, le=1.0)
    agent_evidence_count: int
    
class PolicyDecisionResult(BaseModel):
    transaction_id: str
    decision: Literal["ALLOW", "REVIEW", "BLOCK"]
    policy_version: str
    decision_reason: str
    triggered_rules: List[str]
    inputs: Dict[str, Any]
