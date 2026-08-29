from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
import uuid

class AuditEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    actor: str = "SYSTEM"
    service: str
    event_type: str
    resource_id: str
    input_summary: Dict[str, Any] = {}
    output_summary: Dict[str, Any] = {}
    model_version: Optional[str] = None
    policy_version: Optional[str] = None
    latency: Optional[float] = None
    status: str = "SUCCESS"

class AuditTimelineResponse(BaseModel):
    transaction_id: str
    events: list[AuditEvent]
