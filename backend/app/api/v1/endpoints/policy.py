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
@router.get("/")
def list_policies():
    """
    Returns READ-ONLY policies for the UI.
    """
    import datetime
    return {
        "policies": [
            {
                "policy_id": "P-V1-001",
                "name": "Low Machine Risk -> ALLOW",
                "priority": 100,
                "conditions": {"operator": "AND", "rules": [{"field": "ml_risk", "operator": "<", "value": "0.4"}]},
                "action": "ALLOW",
                "reason_code": "LOW_MACHINE_RISK",
                "enabled": True,
                "version": POLICY_VERSION,
                "updated_at": datetime.datetime.now().isoformat()
            },
            {
                "policy_id": "P-V1-004",
                "name": "ML High AND Graph High -> BLOCK",
                "priority": 90,
                "conditions": {"operator": "AND", "rules": [{"field": "ml_risk", "operator": ">=", "value": "0.8"}, {"field": "graph_risk", "operator": ">=", "value": "0.3"}]},
                "action": "BLOCK",
                "reason_code": "HIGH_ML_AND_GRAPH",
                "enabled": True,
                "version": POLICY_VERSION,
                "updated_at": datetime.datetime.now().isoformat()
            }
        ]
    }

from fastapi import HTTPException

@router.post("/")
def create_policy():
    raise HTTPException(status_code=405, detail="Policy mutations disabled in V3 certification mode.")

@router.put("/{policy_id}/toggle")
def toggle_policy(policy_id: str):
    raise HTTPException(status_code=405, detail="Policy mutations disabled in V3 certification mode.")

@router.delete("/{policy_id}")
def delete_policy(policy_id: str):
    raise HTTPException(status_code=405, detail="Policy mutations disabled in V3 certification mode.")
