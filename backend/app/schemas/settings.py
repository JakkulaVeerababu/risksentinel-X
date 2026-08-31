from pydantic import BaseModel
from typing import Optional

class WorkspaceSettingsUpdate(BaseModel):
    workspace_name: Optional[str] = None
    currency: Optional[str] = None
    timezone: Optional[str] = None
    auto_block: Optional[bool] = None
    graph_enrichment: Optional[bool] = None
    ai_reasoning: Optional[bool] = None
    step_up: Optional[bool] = None
    email_critical: Optional[bool] = None
    email_summary: Optional[bool] = None
    slack_alerts: Optional[bool] = None
    review_threshold: Optional[float] = None

class WorkspaceSettingsResponse(BaseModel):
    id: int
    workspace_name: str
    merchant_id: str
    currency: str
    timezone: str
    auto_block: bool
    graph_enrichment: bool
    ai_reasoning: bool
    step_up: bool
    email_critical: bool
    email_summary: bool
    slack_alerts: bool
    review_threshold: float

    class Config:
        from_attributes = True

class TeamMemberCreate(BaseModel):
    name: str
    email: str
    role: str

class TeamMemberResponse(TeamMemberCreate):
    id: int

    class Config:
        from_attributes = True
