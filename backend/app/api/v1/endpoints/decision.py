from fastapi import APIRouter, HTTPException
from app.policy.service import PolicyService, DecisionRequest
from app.policy.schemas import PolicyDecisionResult
import logging

router = APIRouter()
service = PolicyService()

@router.post("/decision", response_model=PolicyDecisionResult)
def get_final_decision(request: DecisionRequest):
    """
    Retrieves internal metrics (ML, Graph, Agent) and applies deterministic policy rules.
    """
    try:
        decision = service.evaluate_decision(request)
        return decision
    except Exception as e:
        logging.error(f"Decision evaluation failed catastrophically: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during policy evaluation.")
