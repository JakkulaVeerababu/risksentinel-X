import pytest
from app.policy.engine import PolicyEngine
from app.policy.schemas import PolicyInput

def test_agent_unavailable_routes_to_review():
    engine = PolicyEngine()
    # High risk ML, but agent failed
    input_data = PolicyInput(
        transaction_id="TX-INT-1",
        ml_score=0.8,
        ml_model_version="v1",
        graph_score=0.2,
        graph_version="v1",
        agent_state="FAILED",
        agent_recommendation=None,
        agent_confidence=None
    )
    res = engine.evaluate(input_data)
    # ML is 0.8 (which is >= ML_THRESHOLD 0.8), but graph is low (0.4). So REVIEW.
    assert res.final_decision == "REVIEW"

def test_policy_overrides_agent():
    engine = PolicyEngine()
    # Agent hallucinates a block but data is weak
    input_data = PolicyInput(
        transaction_id="TX-INT-2",
        ml_score=0.4,
        ml_model_version="v1",
        graph_score=0.2,
        graph_version="v1",
        agent_state="COMPLETED",
        agent_recommendation="BLOCK",
        agent_confidence=0.9
    )
    res = engine.evaluate(input_data)
    # Policy says REVIEW because ML < 0.8 and Graph < 0.3
    assert res.final_decision == "REVIEW"
