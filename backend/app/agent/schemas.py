from pydantic import BaseModel, Field, model_validator
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

    @model_validator(mode='before')
    @classmethod
    def normalize_observed(cls, data: Any) -> Any:
        if isinstance(data, dict):
            observed = data.get("observed")
            if isinstance(observed, (bool, int, float)):
                data["observed"] = str(observed)
        return data

class InvestigationResult(BaseModel):
    recommendation: Optional[RecommendationEnum] = Field(
        default=None,
        description="Advisory recommendation: ALLOW, REVIEW, or BLOCK. Null when investigation is skipped."
    )
    confidence: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=1.0,
        description="Agent confidence from 0 to 1. Null when investigation is skipped."
    )
    reason_codes: List[ReasonCodeEnum] = Field(description="Applicable reason codes")
    evidence: List[EvidenceItem] = Field(description="Evidence supporting the reason codes and recommendation")

class ToolCallRecord(BaseModel):
    tool: str
    status: str
    duration_ms: float
    output: Optional[Dict[str, Any]] = None

class InvestigationResponse(BaseModel):
    transaction_id: str
    status: Literal["COMPLETED", "DEGRADED", "FAILED_VALIDATION", "SKIPPED"]
    provider_info: str
    tool_calls: List[ToolCallRecord]
    investigation: InvestigationResult

class InvestigationRequest(BaseModel):
    transaction_id: str
    customer_id: str
    graph_entity_id: str
    # Simulating internal context retrieval for MVP
    amount: float = 0.0 
    ml_risk_score: Optional[float] = 0.0
    graph_risk_score: Optional[float] = None
