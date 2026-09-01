from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from app.schemas.score import ScoreRequest

class ProcessTransactionRequest(ScoreRequest):
    customer_id: Optional[str] = Field(None, max_length=255)
    entity_id: Optional[str] = Field(None, max_length=255)
    skip_ml: bool = Field(False, description="If true, bypasses ML scoring (e.g. for incompatible schema from webhooks)")

class OrchestrationResponse(BaseModel):
    transaction_id: str
    status: str
    ml: Dict[str, Any]
    graph: Dict[str, Any]
    agent: Dict[str, Any]
    policy: Dict[str, Any]

class ErrorDetail(BaseModel):
    code: str
    message: str

class OrchestrationErrorResponse(BaseModel):
    transaction_id: str
    status: str
    failed_stage: str
    error: ErrorDetail
