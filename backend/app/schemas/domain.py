from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.enums import DecisionType, ReasonCode

class Transaction(BaseModel):
    transaction_id: str
    amount: float
    customer_id: str

class RiskScore(BaseModel):
    transaction_id: str
    risk_score: float = Field(ge=0.0, le=1.0)
    model_version: str

class GraphEvidence(BaseModel):
    entity_id: str
    cluster_detected: bool
    cluster_id: Optional[str] = None
    cluster_risk: Optional[float] = None
    related_entities: List[str] = []

class InvestigationResult(BaseModel):
    recommendation: DecisionType
    confidence: float = Field(ge=0.0, le=1.0)
    reason_codes: List[ReasonCode]
    evidence: List[dict] = []

class PolicyDecision(BaseModel):
    transaction_id: str
    decision: DecisionType
    reason: str

class ErrorDetail(BaseModel):
    code: str
    message: str

class ErrorResponse(BaseModel):
    error: ErrorDetail
