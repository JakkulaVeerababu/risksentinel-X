from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any
from enum import Enum

class RecommendationEnum(str, Enum):
    ALLOW = "ALLOW"
    REVIEW = "REVIEW"
    BLOCK = "BLOCK"

class ReasonCodeEnum(str, Enum):
    VELOCITY_ANOMALY = "VELOCITY_ANOMALY"
    DEVICE_REUSE = "DEVICE_REUSE"
    IP_REUSE = "IP_REUSE"
    PAYMENT_INSTRUMENT_REUSE = "PAYMENT_INSTRUMENT_REUSE"
    GRAPH_CLUSTER_RISK = "GRAPH_CLUSTER_RISK"
    UNUSUAL_AMOUNT = "UNUSUAL_AMOUNT"
    HIGH_ML_RISK = "HIGH_ML_RISK"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"
    AGENT_UNAVAILABLE = "AGENT_UNAVAILABLE"

class EvidenceItem(BaseModel):
    signal: str = Field(description="Name of the signal, e.g., 'recent_transaction_frequency'")
    observed: str = Field(description="The actual value observed")
    source: Literal["transaction_history", "graph_context", "ml_model", "transaction"] = Field(
        description="The tool or component that provided this evidence"
    )

class InvestigationResult(BaseModel):
    recommendation: RecommendationEnum = Field(description="Advisory recommendation: ALLOW, REVIEW, or BLOCK")
    confidence: float = Field(ge=0.0, le=1.0, description="Agent's self-reported confidence in the recommendation (0 to 1)")
    reason_codes: List[ReasonCodeEnum] = Field(description="Applicable reason codes")
    evidence: List[EvidenceItem] = Field(description="Evidence supporting the reason codes and recommendation")

class ToolCallRecord(BaseModel):
    tool: str
    status: str
    duration_ms: float
    output: Optional[Dict[str, Any]] = None

class InvestigationResponse(BaseModel):
    transaction_id: str
    status: Literal["COMPLETED", "DEGRADED", "FAILED_VALIDATION"]
    provider_info: str
    tool_calls: List[ToolCallRecord]
    investigation: InvestigationResult

class InvestigationRequest(BaseModel):
    transaction_id: str
    customer_id: str
    graph_entity_id: str
    # Simulating internal context retrieval for MVP
    amount: float = 0.0 
    ml_risk_score: float = 0.0
