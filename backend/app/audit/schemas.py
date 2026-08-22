from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
import uuid

class AuditEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    transaction_id: str
    event_type: str
    component: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    model_version: Optional[str] = None
    agent_version: Optional[str] = None
    policy_version: Optional[str] = None
    simulation_id: Optional[str] = None
    payload: Dict[str, Any] = {}

class AuditTimelineResponse(BaseModel):
    transaction_id: str
    events: list[AuditEvent]
