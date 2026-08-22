from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.audit.service import AuditService
from app.audit.schemas import AuditTimelineResponse, AuditEvent

router = APIRouter()

@router.get("/", response_model=List[AuditEvent])
async def search_audit_events(
    transaction_id: Optional[str] = Query(None, description="Filter by TX ID"),
    decision: Optional[str] = Query(None, description="Filter by ALLOW, REVIEW, BLOCK"),
    reason_code: Optional[str] = Query(None, description="Filter by reason code"),
    is_synthetic: Optional[bool] = Query(None, description="Filter by synthetic transactions"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Audit Explorer API endpoint."""
    return AuditService.query_events(
        transaction_id=transaction_id,
        decision=decision,
        reason_code=reason_code,
        is_synthetic=is_synthetic,
        limit=limit,
        offset=offset
    )

@router.get("/{transaction_id}", response_model=AuditTimelineResponse)
async def get_audit_timeline(transaction_id: str):
    events = AuditService.get_transaction_timeline(transaction_id)
    if not events:
        raise HTTPException(status_code=404, detail="Audit timeline not found for transaction")
    return AuditTimelineResponse(
        transaction_id=transaction_id,
        events=events
    )
