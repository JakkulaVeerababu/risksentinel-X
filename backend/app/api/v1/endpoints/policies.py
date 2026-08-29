from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.session import get_db
from app.models.domain import PolicyModel
from app.policy.schemas import PolicyCreate, PolicyResponse

router = APIRouter()

@router.get("/", response_model=List[PolicyResponse])
def get_policies(db: Session = Depends(get_db)):
    """
    List all policies sorted by priority (highest first).
    """
    policies = db.query(PolicyModel).order_by(PolicyModel.priority.desc()).all()
    return policies

@router.post("/", response_model=PolicyResponse)
def create_policy(policy: PolicyCreate, db: Session = Depends(get_db)):
    """
    Create a new deterministic policy rule.
    """
    raise HTTPException(status_code=405, detail="Policy mutation is disabled in the read-only MVP.")
    new_policy = PolicyModel(
        policy_id=f"POL-{uuid.uuid4().hex[:8].upper()}",
        name=policy.name,
        priority=policy.priority,
        conditions=policy.conditions.model_dump(),
        action=policy.action,
        reason_code=policy.reason_code,
        enabled=policy.enabled,
        version="1.0.0"
    )
    
    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)
    return new_policy

@router.delete("/{policy_id}")
def delete_policy(policy_id: str, db: Session = Depends(get_db)):
    """
    Deletes a policy.
    """
    raise HTTPException(status_code=405, detail="Policy mutation is disabled in the read-only MVP.")
    policy = db.query(PolicyModel).filter(PolicyModel.policy_id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
        
    db.delete(policy)
    db.commit()
    return {"status": "deleted", "policy_id": policy_id}

@router.put("/{policy_id}/toggle")
def toggle_policy(policy_id: str, db: Session = Depends(get_db)):
    """
    Toggles the enabled status of a policy.
    """
    raise HTTPException(status_code=405, detail="Policy mutation is disabled in the read-only MVP.")
    policy = db.query(PolicyModel).filter(PolicyModel.policy_id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
        
    policy.enabled = not policy.enabled
    db.commit()
    return {"status": "success", "enabled": policy.enabled, "policy_id": policy_id}