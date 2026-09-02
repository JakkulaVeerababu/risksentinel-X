from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.db.session import get_db
from app.models.domain import PolicyModel
from app.policy.schemas import PolicyCreate, PolicyResponse

router = APIRouter()

@router.get("", response_model=List[PolicyResponse])
def get_policies(db: Session = Depends(get_db)):
    """
    List all policies sorted by priority (highest first).
    """
    policies = db.query(PolicyModel).order_by(PolicyModel.priority.desc()).all()
    return policies

@router.post("", response_model=PolicyResponse)
def create_policy(policy: PolicyCreate, db: Session = Depends(get_db)):
    """
    Create a new deterministic policy rule.
    """
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
    policy = db.query(PolicyModel).filter(PolicyModel.policy_id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
        
    policy.enabled = not policy.enabled
    db.commit()
    return {"status": "success", "enabled": policy.enabled, "policy_id": policy_id}

@router.post("/seed_demo_data")
def seed_demo_data(db: Session = Depends(get_db)):
    """
    Seeds the live database with demo policies and graph data.
    """
    # 1. Seed Policies
    from app.policy.config import POLICY_VERSION
    policies_to_seed = [
        {
            "policy_id": "P-V1-001",
            "name": "Low Machine Risk -> ALLOW",
            "priority": 100,
            "conditions": {"operator": "AND", "rules": [{"field": "ml_score", "operator": "<", "value": 0.4}]},
            "action": "ALLOW",
            "reason_code": "LOW_MACHINE_RISK",
            "enabled": True,
        },
        {
            "policy_id": "P-V1-004",
            "name": "ML High AND Graph High -> BLOCK",
            "priority": 90,
            "conditions": {"operator": "AND", "rules": [{"field": "ml_score", "operator": ">=", "value": 0.75}, {"field": "graph_score", "operator": ">=", "value": 0.3}]},
            "action": "BLOCK",
            "reason_code": "HIGH_ML_AND_GRAPH",
            "enabled": True,
        },
        {
            "policy_id": "AGENT_RECOMMENDS_REVIEW",
            "name": "Agent REVIEW -> REVIEW",
            "priority": 80,
            "conditions": {"operator": "AND", "rules": [{"field": "agent_recommendation", "operator": "==", "value": "REVIEW"}]},
            "action": "REVIEW",
            "reason_code": "AGENT_ESCALATION",
            "enabled": True,
        }
    ]
    
    seeded_policies = 0
    for p in policies_to_seed:
        existing = db.query(PolicyModel).filter_by(policy_id=p["policy_id"]).first()
        if not existing:
            new_policy = PolicyModel(
                policy_id=p["policy_id"],
                name=p["name"],
                priority=p["priority"],
                conditions=p["conditions"],
                action=p["action"],
                reason_code=p["reason_code"],
                enabled=p["enabled"],
                version=POLICY_VERSION
            )
            db.add(new_policy)
            seeded_policies += 1
            
    db.commit()
    
    # 2. Seed Graph Data
    import logging
    try:
        from app.seed_graph import seed
        seed()
        graph_status = "success"
    except Exception as e:
        logging.error(f"Graph seed failed: {e}")
        graph_status = f"failed: {e}"
        
    return {"status": "success", "policies_seeded": seeded_policies, "graph_status": graph_status}