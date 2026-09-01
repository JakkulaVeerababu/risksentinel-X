from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.db.session import get_db
from app.models.domain import InvestigationModel

router = APIRouter()

class InvestigationUpdateStatus(BaseModel):
    status: str

class InvestigationUpdateAssignee(BaseModel):
    assignee: str

@router.get("")
def list_investigations(db: Session = Depends(get_db)):
    """List all investigations ordered by newest first."""
    investigations = db.query(InvestigationModel).order_by(InvestigationModel.created_at.desc()).all()
    result = []
    for inv in investigations:
        result.append({
            "transaction_id": inv.transaction_id,
            "agent_state": inv.agent_state,
            "recommendation": inv.recommendation,
            "confidence": inv.confidence,
            "reason_codes": inv.reason_codes,
            "evidence": inv.evidence,
            "provider": inv.provider,
            "tool_calls": inv.tool_calls,
            "status": inv.status,
            "assignee": inv.assignee,
            "created_at": inv.created_at.isoformat() + "Z" if inv.created_at else None,
            "updated_at": (inv.updated_at.isoformat() + "Z") if inv.updated_at else (inv.created_at.isoformat() + "Z" if inv.created_at else None)
        })
    return {"investigations": result}

@router.get("/{case_id}")
def get_investigation(case_id: str, db: Session = Depends(get_db)):
    """Get investigation details."""
    inv = db.query(InvestigationModel).filter(InvestigationModel.transaction_id == case_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
        
    return {
        "transaction_id": inv.transaction_id,
        "agent_state": inv.agent_state,
        "recommendation": inv.recommendation,
        "confidence": inv.confidence,
        "reason_codes": inv.reason_codes,
        "evidence": inv.evidence,
        "provider": inv.provider,
        "tool_calls": inv.tool_calls,
        "status": inv.status,
        "assignee": inv.assignee,
        "created_at": inv.created_at.isoformat() + "Z" if inv.created_at else None,
        "updated_at": (inv.updated_at.isoformat() + "Z") if inv.updated_at else (inv.created_at.isoformat() + "Z" if inv.created_at else None)
    }

@router.put("/{case_id}/status")
def update_status(case_id: str, data: InvestigationUpdateStatus, db: Session = Depends(get_db)):
    """Update investigation status."""
    inv = db.query(InvestigationModel).filter(InvestigationModel.transaction_id == case_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
        
    inv.status = data.status
    db.commit()
    return inv

@router.put("/{case_id}/assignee")
def update_assignee(case_id: str, data: InvestigationUpdateAssignee, db: Session = Depends(get_db)):
    """Update investigation assignee."""
    inv = db.query(InvestigationModel).filter(InvestigationModel.transaction_id == case_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
        
    inv.assignee = data.assignee
    db.commit()
    return inv
