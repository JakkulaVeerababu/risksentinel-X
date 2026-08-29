from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
from app.policy.config import POLICY_VERSION, ML_THRESHOLD, GRAPH_THRESHOLD

router = APIRouter()

class PolicyMetadataResponse(BaseModel):
    policy_version: str
    ml_threshold: float
    graph_threshold: float
    active_rules: List[Dict[str, str]]

@router.get("/metadata", response_model=PolicyMetadataResponse)
def get_policy_metadata():
    """
    Returns READ-ONLY metadata about the current deterministic policy engine.
    """
    return PolicyMetadataResponse(
        policy_version=POLICY_VERSION,
        ml_threshold=ML_THRESHOLD,
        graph_threshold=GRAPH_THRESHOLD,
        active_rules=[
            {"rule_id": "P-V1-001", "description": "Low Machine Risk -> ALLOW"},
            {"rule_id": "P-V1-002", "description": "ML High Only -> REVIEW"},
            {"rule_id": "P-V1-003", "description": "Graph High Only -> REVIEW"},
            {"rule_id": "P-V1-004", "description": "ML High AND Graph High -> BLOCK"},
            {"rule_id": "AGENT_BLOCK_WITHOUT_STRONG_MACHINE_EVIDENCE", "description": "Agent BLOCK with Low Machine Risk -> REVIEW"},
            {"rule_id": "AGENT_RECOMMENDS_REVIEW", "description": "Agent REVIEW -> REVIEW"},
            {"rule_id": "SAFE_FALLBACK_REVIEW", "description": "Unknown Input Combination -> REVIEW (Safe Fallback)"}
        ]
    )
