from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.domain import WorkspaceSettingsModel, TeamMemberModel
from app.schemas.settings import WorkspaceSettingsResponse, WorkspaceSettingsUpdate, TeamMemberResponse, TeamMemberCreate

router = APIRouter()

@router.get("", response_model=WorkspaceSettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(WorkspaceSettingsModel).first()
    if not settings:
        settings = WorkspaceSettingsModel()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("", response_model=WorkspaceSettingsResponse)
def update_settings(payload: WorkspaceSettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(WorkspaceSettingsModel).first()
    if not settings:
        settings = WorkspaceSettingsModel()
        db.add(settings)
    
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    db.commit()
    db.refresh(settings)
    return settings

@router.get("/team", response_model=List[TeamMemberResponse])
def get_team_members(db: Session = Depends(get_db)):
    members = db.query(TeamMemberModel).all()
    if not members:
        # Seed default members for demo
        defaults = [
            TeamMemberModel(name="Ananya Iyer", email="ananya@acme.example", role="Administrator"),
            TeamMemberModel(name="Rohan Shah", email="rohan@acme.example", role="Fraud analyst"),
            TeamMemberModel(name="Nisha Menon", email="nisha@acme.example", role="Viewer")
        ]
        db.add_all(defaults)
        db.commit()
        members = db.query(TeamMemberModel).all()
    return members

@router.post("/team", response_model=TeamMemberResponse)
def add_team_member(payload: TeamMemberCreate, db: Session = Depends(get_db)):
    existing = db.query(TeamMemberModel).filter(TeamMemberModel.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Team member with this email already exists")
        
    new_member = TeamMemberModel(
        name=payload.name,
        email=payload.email,
        role=payload.role
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member
