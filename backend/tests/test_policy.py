import pytest
from app.policy.schemas import PolicyInput
from app.policy.engine import PolicyEngine

def test_policy_allow_low_risk():
    engine = PolicyEngine()
    # Force defaults in case config fails to load
    engine.config.ml_low_threshold = 0.15
    engine.config.graph_high_threshold = 0.80
    
    input_data = PolicyInput(
        transaction_id="TX1",
        ml_risk_score=0.05,
        graph_risk_score=0.10,
        graph_cluster_detected=False,
        agent_status="COMPLETED",
        agent_recommendation="ALLOW",
        agent_confidence=0.9,
        agent_evidence_count=1
    )
    
    res = engine.evaluate(input_data)
    assert res.decision == "ALLOW"
    assert "POL-ALLOW-001:ML_AND_GRAPH_LOW" in res.triggered_rules

def test_policy_block_high_risk():
    engine = PolicyEngine()
    engine.config.ml_high_threshold = 0.85
    engine.config.graph_high_threshold = 0.80
    engine.config.min_block_evidence_count = 2
    
    input_data = PolicyInput(
        transaction_id="TX2",
        ml_risk_score=0.95,
        graph_risk_score=0.90,
        graph_cluster_detected=True,
        agent_status="COMPLETED",
        agent_recommendation="BLOCK",
        agent_confidence=0.9,
        agent_evidence_count=3
    )
    
    res = engine.evaluate(input_data)
    assert res.decision == "BLOCK"
    assert "POL-BLOCK-001:MULTI_SIGNAL_CONFIRMED" in res.triggered_rules

def test_agent_override_weak_signals():
    engine = PolicyEngine()
    engine.config.ml_high_threshold = 0.85
    engine.config.graph_high_threshold = 0.80
    
    input_data = PolicyInput(
        transaction_id="TX3",
        ml_risk_score=0.40, # Not high enough
        graph_risk_score=0.50, # Not high enough
        graph_cluster_detected=False,
        agent_status="COMPLETED",
        agent_recommendation="BLOCK", # Agent wants to block!
        agent_confidence=0.99, # With high confidence!
        agent_evidence_count=5
    )
    
    res = engine.evaluate(input_data)
    # The policy should OVERRIDE the agent
    assert res.decision == "REVIEW"
    assert "POL-REVIEW-001:AGENT_OVERRIDE_WEAK_SIGNALS" in res.triggered_rules

def test_agent_degraded_fallback():
    engine = PolicyEngine()
    
    input_data = PolicyInput(
        transaction_id="TX4",
        ml_risk_score=0.90,
        graph_risk_score=0.90,
        graph_cluster_detected=True,
        agent_status="DEGRADED", # Agent failed
        agent_recommendation="REVIEW",
        agent_confidence=0.0,
        agent_evidence_count=0
    )
    
    res = engine.evaluate(input_data)
    # High risk signals but no valid agent verification -> safe review
    assert res.decision == "REVIEW"
    assert "POL-SAFE-AGENT-001:AGENT_DEGRADED" in res.triggered_rules
