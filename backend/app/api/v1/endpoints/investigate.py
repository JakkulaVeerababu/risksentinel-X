from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.agent.schemas import InvestigationRequest, InvestigationResponse
from app.agent.service import InvestigationService
import logging

router = APIRouter()
service = InvestigationService()

@router.post("/investigate", response_model=InvestigationResponse)
def run_investigation(request: InvestigationRequest, db: Session = Depends(get_db)):
    try:
        response = service.investigate(request, db)
        return response
    except Exception as e:
        logging.error(f"Investigation failed catastrophically: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during investigation.")
