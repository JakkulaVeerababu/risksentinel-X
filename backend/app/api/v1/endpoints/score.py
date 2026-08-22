from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.schemas.score import ScoreRequest, ScoreResponse
from app.risk.inference import RiskModelService

router = APIRouter()

@router.post("/score", response_model=ScoreResponse)
def score_transaction(request: ScoreRequest):
    service = RiskModelService.get_instance()
    
    if not service.is_loaded:
        return JSONResponse(
            status_code=503,
            content={
                "error": {
                    "code": "MODEL_NOT_AVAILABLE",
                    "message": "Risk model artifact is not available."
                }
            }
        )
        
    try:
        # Convert request to dict and score
        payload = request.model_dump()
        risk_score = service.score(payload)
        
        return ScoreResponse(
            transaction_id=request.TransactionID,
            risk_score=risk_score,
            model_version=service.version
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to score transaction: {str(e)}")
