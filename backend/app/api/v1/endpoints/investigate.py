from fastapi import APIRouter, HTTPException
from app.agent.schemas import InvestigationRequest, InvestigationResponse
from app.agent.service import InvestigationService
import logging

router = APIRouter()
service = InvestigationService()

@router.post("/investigate", response_model=InvestigationResponse)
def run_investigation(request: InvestigationRequest):
    try:
        response = service.investigate(request)
        return response
    except Exception as e:
        logging.error(f"Investigation failed catastrophically: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during investigation.")
