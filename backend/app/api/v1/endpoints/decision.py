from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.policy.service import PolicyService
from app.policy.schemas import PolicyDecisionResult
from pydantic import BaseModel
import logging

router = APIRouter()

class DecisionRequest(BaseModel):
    transaction_id: str

@router.post("/decision", response_model=PolicyDecisionResult)
def get_final_decision(request: DecisionRequest, db: Session = Depends(get_db)):
    """
    Retrieves internal metrics (ML, Graph, Agent) and applies deterministic policy rules.
    """
    service = PolicyService(db)
    try:
        decision = service.evaluate_decision(request.transaction_id)
        return decision
    except ValueError as e:
        if str(e) == "RISK_EVIDENCE_NOT_AVAILABLE":
            raise HTTPException(status_code=400, detail="RISK_EVIDENCE_NOT_AVAILABLE")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logging.error(f"Decision evaluation failed catastrophically: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during policy evaluation.")
