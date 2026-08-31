from sqlalchemy import Column, String, Float, Boolean, Integer, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base import Base

class TransactionModel(Base):
    __tablename__ = "transactions"
    transaction_id = Column(String, primary_key=True, index=True)
    amount = Column(Float)
    customer_id = Column(String)
    ml_risk_score = Column(Float, nullable=True)
    graph_risk_score = Column(Float, nullable=True)
    decision = Column(String, default="PENDING")
    status = Column(String, default="RECEIVED")
    is_synthetic = Column(Boolean, default=False)
    timestamp = Column(DateTime, server_default=func.now())

class PolicyModel(Base):
    __tablename__ = "policies"
    policy_id = Column(String, primary_key=True, index=True)
    name = Column(String)
    priority = Column(Integer)
    conditions = Column(JSON)
    action = Column(String)
    reason_code = Column(String)
    enabled = Column(Boolean, default=True)
    version = Column(String, default="1.0.0")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class InvestigationModel(Base):
    __tablename__ = "investigations"
    transaction_id = Column(String, primary_key=True, index=True)
    agent_state = Column(String, default="COMPLETED")
    recommendation = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    reason_codes = Column(JSON, nullable=True)
    evidence = Column(JSON, nullable=True)
    provider = Column(String, nullable=True)
    tool_calls = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class AuditEventModel(Base):
    __tablename__ = "audit_events"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    transaction_id = Column(String, index=True)
    event_type = Column(String)
    details = Column(JSON)
    timestamp = Column(DateTime, server_default=func.now())
    payload = Column(JSON, nullable=True)
    component = Column(String, nullable=True)

class RiskScoreModel(Base):
    __tablename__ = "risk_scores"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    transaction_id = Column(String, ForeignKey("transactions.transaction_id"), index=True)
    ml_score = Column(Float)
    graph_score = Column(Float)
    model_version = Column(String, nullable=True)
    timestamp = Column(DateTime, server_default=func.now())

class DecisionModel(Base):
    __tablename__ = "decisions"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    transaction_id = Column(String, ForeignKey("transactions.transaction_id"), index=True)
    decision = Column(String)
    reason = Column(String)
    policy_version = Column(String)
    input_fingerprint = Column(String, index=True)
    matched_rules = Column(JSON, nullable=True)
    timestamp = Column(DateTime, server_default=func.now())

class WorkspaceSettingsModel(Base):
    __tablename__ = "workspace_settings"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    workspace_name = Column(String, default="Acme Payments")
    merchant_id = Column(String, default="K8p2xY14")
    currency = Column(String, default="INR")
    timezone = Column(String, default="Asia/Kolkata")
    auto_block = Column(Boolean, default=True)
    graph_enrichment = Column(Boolean, default=True)
    ai_reasoning = Column(Boolean, default=True)
    step_up = Column(Boolean, default=True)
    email_critical = Column(Boolean, default=True)
    email_summary = Column(Boolean, default=True)
    slack_alerts = Column(Boolean, default=False)
    review_threshold = Column(Float, default=0.72)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class TeamMemberModel(Base):
    __tablename__ = "team_members"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    role = Column(String)
    created_at = Column(DateTime, server_default=func.now())
