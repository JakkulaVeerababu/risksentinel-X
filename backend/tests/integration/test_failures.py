import pytest
from app.policy.engine import PolicyEngine
from app.policy.schemas import PolicyInput

def test_agent_unavailable_routes_to_review():
    engine = PolicyEngine()
    # High risk ML, but agent failed
    input_data = PolicyInput(
        transaction_id="TX-INT-1",
        ml_risk_score=0.8,
        graph_risk_score=0.4,
        graph_cluster_detected=False,
        agent_status="FAILED",
        agent_recommendation="PENDING",
        agent_confidence=0.0,
        agent_evidence_count=0
    )
    res = engine.evaluate(input_data)
    # ML is 0.8, which is just shy of 0.85 absolute threshold, so without Agent it MUST Review
    assert res.decision == "REVIEW"

def test_policy_overrides_agent():
    engine = PolicyEngine()
    # Agent hallucinates a block but data is weak
    input_data = PolicyInput(
        transaction_id="TX-INT-2",
        ml_risk_score=0.4,
        graph_risk_score=0.2,
        graph_cluster_detected=False,
        agent_status="COMPLETED",
        agent_recommendation="BLOCK",
        agent_confidence=0.9,
        agent_evidence_count=1
    )
    res = engine.evaluate(input_data)
    # Policy says REVIEW because ML < 0.85 and Graph < 0.6
    assert res.decision == "REVIEW"
