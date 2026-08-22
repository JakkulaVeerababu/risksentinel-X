import pytest
from app.audit.service import AuditService
from app.audit.schemas import AuditEvent
from app.policy.engine import PolicyEngine
from app.policy.schemas import PolicyInput

def test_audit_event_persistence():
    event = AuditEvent(
        transaction_id="TX-UNIT-1",
        event_type="TEST",
        component="UnitTest",
        payload={"msg": "success"}
    )
    AuditService.record_event(event)
    timeline = AuditService.get_transaction_timeline("TX-UNIT-1")
    assert len(timeline) == 1
    assert timeline[0].event_type == "TEST"

def test_audit_rejects_chain_of_thought():
    event = AuditEvent(
        transaction_id="TX-UNIT-2",
        event_type="TEST",
        component="UnitTest",
        payload={"chain_of_thought": "I think this is fraud..."}
    )
    # The service suppresses the error and logs it, but doesn't persist the event
    AuditService.record_event(event)
    timeline = AuditService.get_transaction_timeline("TX-UNIT-2")
    assert len(timeline) == 0

def test_policy_allow_low_risk():
    engine = PolicyEngine()
    input_data = PolicyInput(
        transaction_id="TX-UNIT-3",
        ml_risk_score=0.1,
        graph_risk_score=0.1,
        graph_cluster_detected=False,
        agent_status="COMPLETED",
        agent_recommendation="ALLOW",
        agent_confidence=0.9,
        agent_evidence_count=0
    )
    res = engine.evaluate(input_data)
    assert res.decision == "ALLOW"

def test_policy_block_high_risk():
    engine = PolicyEngine()
    input_data = PolicyInput(
        transaction_id="TX-UNIT-4",
        ml_risk_score=0.9,
        graph_risk_score=0.9,
        graph_cluster_detected=True,
        agent_status="COMPLETED",
        agent_recommendation="BLOCK",
        agent_confidence=0.9,
        agent_evidence_count=2
    )
    res = engine.evaluate(input_data)
    assert res.decision == "BLOCK"
