from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any
from enum import Enum
from app.agent.schemas import InvestigationResult

class PolicyDecisionEnum(str, Enum):
    ALLOW = "ALLOW"
    REVIEW = "REVIEW"
    BLOCK = "BLOCK"

class PolicyInput(BaseModel):
    transaction_id: str
    ml_score: float = Field(ge=0.0, le=1.0)
    ml_model_version: Optional[str]
    graph_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    graph_version: Optional[str]
    agent_state: str
    agent_recommendation: Optional[str]
    agent_confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    agent_reason_codes: Optional[List[str]] = None
    validated_agent_evidence: Optional[List[Dict[str, Any]]] = None
    
class PolicyDecisionResult(BaseModel):
    final_decision: Literal["ALLOW", "REVIEW", "BLOCK"]
    policy_version: str
    matched_rule_ids: List[str]
    reason_codes: List[str]
    ml_score: float
    graph_score: Optional[float]
    agent_state: str
    agent_recommendation: Optional[str]
    agent_confidence: Optional[float]
    timestamp: str

class PolicyRuleSchema(BaseModel):
    field: str
    operator: str
    value: Any

class PolicyConditionRootSchema(BaseModel):
    operator: Literal["AND", "OR"]
    rules: List[PolicyRuleSchema]

class PolicyCreate(BaseModel):
    name: str
    priority: int
    conditions: PolicyConditionRootSchema
    action: Literal["ALLOW", "REVIEW", "BLOCK"]
    reason_code: str
    enabled: bool = True

class PolicyResponse(PolicyCreate):
    policy_id: str
    version: str
    created_at: Any
    updated_at: Any
