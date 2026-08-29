import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Union

from app.db.session import get_db
from app.orchestration.schemas import ProcessTransactionRequest, OrchestrationResponse, OrchestrationErrorResponse
from app.orchestration.service import RiskOrchestrator

router = APIRouter()

@router.post("/process", response_model=Union[OrchestrationResponse, OrchestrationErrorResponse])
def process_transaction(
    request: ProcessTransactionRequest,
    db: Session = Depends(get_db)
):
    orchestrator = RiskOrchestrator(db)
    
    response = orchestrator.process_transaction(request)
    
    if isinstance(response, OrchestrationErrorResponse):
        # The prompt says: "Catches 409 Conflict and 500s safely"
        if response.error.code == "409":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=response.model_dump())
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=response.model_dump())
            
    return response
