import pytest
from app.audit.service import AuditService
from app.audit.schemas import AuditEvent
from app.policy.engine import PolicyEngine
from app.policy.schemas import PolicyInput
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base

# Setup a clean in-memory SQLite fixture for these tests
test_engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

from app.models.domain import PolicyModel

@pytest.fixture
def db():
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    
    # Seed default policies for testing
    allow_policy = PolicyModel(policy_id="POL-1", name="Low Risk Allow", priority=10, enabled=True, action="ALLOW", reason_code="LOW_RISK_ALLOW", conditions={"operator": "AND", "rules": [{"field": "ml_risk_score", "operator": "<=", "value": 0.5}]})
    block_policy = PolicyModel(policy_id="POL-2", name="High Risk Block", priority=20, enabled=True, action="BLOCK", reason_code="HIGH_RISK_BLOCK", conditions={"operator": "AND", "rules": [{"field": "ml_risk_score", "operator": ">=", "value": 0.8}]})
    session.add_all([allow_policy, block_policy])
    session.commit()
    
    yield session
    session.close()
    Base.metadata.drop_all(bind=test_engine)

def test_audit_event_persistence(db):
    event = AuditEvent(
        resource_id="TX-UNIT-1",
        event_type="TEST",
        service="UnitTest",
        input_summary={"msg": "success"}
    )
    AuditService.record_event(db, event)
    timeline = AuditService.get_transaction_timeline(db, "TX-UNIT-1")
    assert len(timeline) == 1
    assert timeline[0].event_type == "TEST"

def test_audit_rejects_chain_of_thought(db):
    event = AuditEvent(
        resource_id="TX-UNIT-2",
        event_type="TEST",
        service="UnitTest",
        input_summary={"chain_of_thought": "I think this is fraud..."}
    )
    # The service suppresses the error and logs it, but doesn't persist the event
    AuditService.record_event(db, event)
    timeline = AuditService.get_transaction_timeline(db, "TX-UNIT-2")
    assert len(timeline) == 0


