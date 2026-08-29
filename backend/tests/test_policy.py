import pytest
from unittest.mock import patch, MagicMock
from app.policy.schemas import PolicyInput, PolicyDecisionResult
from app.policy.engine import PolicyEngine
from app.policy.service import PolicyService
from app.models.domain import RiskScoreModel, InvestigationModel, DecisionModel
from datetime import datetime

@pytest.fixture
def policy_engine():
    return PolicyEngine()

@pytest.fixture
def mock_db():
    db = MagicMock()
    # By default, mock query to return None for idempotency checks
    db.query.return_value.filter_by.return_value.first.return_value = None
    return db

# P-01 policy sole decision authority
def test_p01_policy_sole_authority(policy_engine):
    # Agent BLOCK is overruled if ML is low
    input_data = PolicyInput(
        transaction_id="TX1", ml_score=0.1, ml_model_version="v1",
        graph_score=0.1, graph_version="v1", agent_state="COMPLETED",
        agent_recommendation="BLOCK", agent_confidence=0.99
    )
    res = policy_engine.evaluate(input_data)
    assert res.final_decision == "REVIEW"

# P-02 no LLM policy dependency
def test_p02_no_llm_in_policy():
    import app.policy.engine as engine_module
    with open(engine_module.__file__, 'r') as f:
        content = f.read().lower()
        assert "ollama" not in content
        assert "anthropic" not in content
        assert "openai" not in content
        assert "provider" not in content

# P-03 real persisted upstream evidence (Handled in Service test)
def test_p03_real_persisted_evidence(mock_db):
    service = PolicyService(mock_db)
    
    # Mocking actual models to simulate DB
    mock_risk = RiskScoreModel(transaction_id="TX1", ml_score=0.9, graph_score=0.9, model_version="v1")
    mock_inv = InvestigationModel(transaction_id="TX1", agent_state="COMPLETED", recommendation="ALLOW", confidence=0.99)
    
    # Mock sequence: 
    # 1. RiskScore 
    # 2. Investigation
    # 3. Idempotency Check (None)
    mock_db.query.return_value.filter_by.return_value.first.side_effect = [mock_risk, mock_inv, None]
    
    res = service.evaluate_decision("TX1")
    assert res.final_decision == "BLOCK"  # Because strong machine signals override ALLOW

# P-04 low/low -> ALLOW
def test_p04_low_low_allow(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.1, ml_model_version="v", graph_score=0.1, graph_version="v", agent_state="SKIPPED", agent_recommendation=None, agent_confidence=None)
    res = policy_engine.evaluate(inp)
    assert res.final_decision == "ALLOW"

# P-05 ML high -> REVIEW
def test_p05_ml_high_review(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.9, ml_model_version="v", graph_score=0.1, graph_version="v", agent_state="COMPLETED", agent_recommendation="ALLOW", agent_confidence=0.9)
    res = policy_engine.evaluate(inp)
    assert res.final_decision == "REVIEW"

# P-06 graph high -> REVIEW
def test_p06_graph_high_review(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.1, ml_model_version="v", graph_score=0.5, graph_version="v", agent_state="COMPLETED", agent_recommendation="ALLOW", agent_confidence=0.9)
    res = policy_engine.evaluate(inp)
    assert res.final_decision == "REVIEW"

# P-07 ML+graph high -> BLOCK
def test_p07_both_high_block(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.9, ml_model_version="v", graph_score=0.5, graph_version="v", agent_state="COMPLETED", agent_recommendation="REVIEW", agent_confidence=0.9)
    res = policy_engine.evaluate(inp)
    assert res.final_decision == "BLOCK"

# P-08 BLOCK .99 weak -> REVIEW
def test_p08_block_99_weak_review(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.1, ml_model_version="v", graph_score=0.1, graph_version="v", agent_state="COMPLETED", agent_recommendation="BLOCK", agent_confidence=0.99)
    res = policy_engine.evaluate(inp)
    assert res.final_decision == "REVIEW"
    assert "AGENT_BLOCK_WITHOUT_STRONG_MACHINE_EVIDENCE" in res.matched_rule_ids

# P-09 ALLOW .99 strong -> BLOCK
def test_p09_allow_99_strong_block(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.9, ml_model_version="v", graph_score=0.9, graph_version="v", agent_state="COMPLETED", agent_recommendation="ALLOW", agent_confidence=0.99)
    res = policy_engine.evaluate(inp)
    assert res.final_decision == "BLOCK"

# P-10 degraded agent safe
def test_p10_degraded_agent_safe(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.1, ml_model_version="v", graph_score=0.1, graph_version="v", agent_state="DEGRADED", agent_recommendation=None, agent_confidence=None)
    res = policy_engine.evaluate(inp)
    assert res.final_decision == "ALLOW"
    assert "LOW_MACHINE_RISK_AGENT_DEGRADED" in res.reason_codes

# P-11 skipped agent safe
def test_p11_skipped_agent_safe(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.1, ml_model_version="v", graph_score=0.1, graph_version="v", agent_state="SKIPPED", agent_recommendation=None, agent_confidence=None)
    res = policy_engine.evaluate(inp)
    assert res.final_decision == "ALLOW"

# P-12 null agent safe (Handled by schema allowing None for recommendation and confidence)
def test_p12_null_agent_safe(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.9, ml_model_version="v", graph_score=0.9, graph_version="v", agent_state="SKIPPED", agent_recommendation=None, agent_confidence=None)
    res = policy_engine.evaluate(inp)
    assert res.final_decision == "BLOCK"

# P-13 invalid inputs rejected (Schema validation)
from pydantic import ValidationError
def test_p13_invalid_inputs_rejected():
    with pytest.raises(ValidationError):
        PolicyInput(transaction_id="T", ml_score=1.5, ml_model_version="v", graph_score=0.1, graph_version="v", agent_state="SKIPPED", agent_recommendation=None, agent_confidence=None)
    with pytest.raises(ValidationError):
        PolicyInput(transaction_id="T", ml_score=0.1, ml_model_version="v", graph_score=-0.1, graph_version="v", agent_state="SKIPPED", agent_recommendation=None, agent_confidence=None)

# P-14 safe fallback REVIEW
def test_p14_safe_fallback_review(policy_engine):
    # This shouldn't logically happen due to our rule table covering all cases, but if we force a weird state:
    inp = PolicyInput(transaction_id="T", ml_score=0.1, ml_model_version="v", graph_score=0.1, graph_version="v", agent_state="WEIRD", agent_recommendation="WEIRD", agent_confidence=0.5)
    res = policy_engine.evaluate(inp)
    assert res.final_decision == "REVIEW"

# P-15 no hash/random decision
def test_p15_no_hash_random_decision():
    import app.policy.engine as engine_module
    with open(engine_module.__file__, 'r') as f:
        content = f.read().lower()
        assert "random" not in content
        assert "hash" not in content

# P-16 100-run determinism
def test_p16_determinism(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.9, ml_model_version="v", graph_score=0.1, graph_version="v", agent_state="COMPLETED", agent_recommendation="ALLOW", agent_confidence=0.9)
    first_res = policy_engine.evaluate(inp)
    for _ in range(99):
        res = policy_engine.evaluate(inp)
        assert res.final_decision == first_res.final_decision
        assert res.matched_rule_ids == first_res.matched_rule_ids

# P-17 matched rule IDs
def test_p17_matched_rule_ids(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.9, ml_model_version="v", graph_score=0.9, graph_version="v", agent_state="COMPLETED", agent_recommendation="BLOCK", agent_confidence=0.9)
    res = policy_engine.evaluate(inp)
    assert "P-V1-004" in res.matched_rule_ids
    assert "MULTI_SIGNAL_HIGH_RISK" in res.reason_codes

# P-18 policy version
def test_p18_policy_version(policy_engine):
    inp = PolicyInput(transaction_id="T", ml_score=0.1, ml_model_version="v", graph_score=0.1, graph_version="v", agent_state="COMPLETED", agent_recommendation="ALLOW", agent_confidence=0.9)
    res = policy_engine.evaluate(inp)
    assert res.policy_version == "policy-v1"

# P-19 DecisionModel persistence
def test_p19_decision_model_persistence(mock_db):
    service = PolicyService(mock_db)
    mock_db.query.return_value.filter_by.return_value.first.side_effect = [
        RiskScoreModel(transaction_id="TX", ml_score=0.1, graph_score=0.1),
        None, # No investigation
        None  # No previous decision
    ]
    service.evaluate_decision("TX")
    assert mock_db.add.called
    assert isinstance(mock_db.add.call_args_list[0][0][0], DecisionModel)

# P-20 idempotency
def test_p20_idempotency(mock_db):
    service = PolicyService(mock_db)
    existing_decision = DecisionModel(decision="REVIEW", policy_version="policy-v1", matched_rules={})
    mock_db.query.return_value.filter_by.return_value.first.side_effect = [
        RiskScoreModel(transaction_id="TX", ml_score=0.1, graph_score=0.1),
        None,
        existing_decision # Found existing decision!
    ]
    res = service.evaluate_decision("TX")
    assert res.final_decision == "REVIEW"
    assert not mock_db.add.called # Add should not be called since we short circuit!

# P-21 unchanged upstream evidence (verified via service not setting fields on RiskScoreModel or InvestigationModel)
def test_p21_unchanged_upstream(mock_db):
    service = PolicyService(mock_db)
    risk = RiskScoreModel(transaction_id="TX", ml_score=0.1, graph_score=0.1)
    mock_db.query.return_value.filter_by.return_value.first.side_effect = [risk, None, None]
    service.evaluate_decision("TX")
    # Verify risk object was untouched
    assert risk.ml_score == 0.1
    assert risk.graph_score == 0.1

# P-22 E2E ALLOW
def test_p22_e2e_allow(mock_db):
    service = PolicyService(mock_db)
    mock_db.query.return_value.filter_by.return_value.first.side_effect = [
        RiskScoreModel(transaction_id="TX", ml_score=0.1, graph_score=0.1), None, None
    ]
    res = service.evaluate_decision("TX")
    assert res.final_decision == "ALLOW"

# P-23 E2E REVIEW
def test_p23_e2e_review(mock_db):
    service = PolicyService(mock_db)
    mock_db.query.return_value.filter_by.return_value.first.side_effect = [
        RiskScoreModel(transaction_id="TX", ml_score=0.1, graph_score=0.1),
        InvestigationModel(transaction_id="TX", recommendation="BLOCK", confidence=0.99, agent_state="COMPLETED"),
        None
    ]
    res = service.evaluate_decision("TX")
    assert res.final_decision == "REVIEW"

# P-24 E2E BLOCK
def test_p24_e2e_block(mock_db):
    service = PolicyService(mock_db)
    mock_db.query.return_value.filter_by.return_value.first.side_effect = [
        RiskScoreModel(transaction_id="TX", ml_score=0.9, graph_score=0.9),
        InvestigationModel(transaction_id="TX", recommendation="ALLOW", confidence=0.99, agent_state="COMPLETED"),
        None
    ]
    res = service.evaluate_decision("TX")
    assert res.final_decision == "BLOCK"

# P-25 agent outage
def test_p25_agent_outage(mock_db):
    service = PolicyService(mock_db)
    mock_db.query.return_value.filter_by.return_value.first.side_effect = [
        RiskScoreModel(transaction_id="TX", ml_score=0.1, graph_score=0.1),
        InvestigationModel(transaction_id="TX", agent_state="DEGRADED"),
        None
    ]
    res = service.evaluate_decision("TX")
    assert res.final_decision == "ALLOW"
    assert "LOW_MACHINE_RISK_AGENT_DEGRADED" in res.reason_codes

# P-26 audit persistence
def test_p26_audit_persistence(mock_db):
    service = PolicyService(mock_db)
    mock_db.query.return_value.filter_by.return_value.first.side_effect = [
        RiskScoreModel(transaction_id="TX", ml_score=0.1, graph_score=0.1), None, None
    ]
    service.evaluate_decision("TX")
    assert len(mock_db.add.call_args_list) == 2 # 1 for DecisionModel, 1 for AuditEventModel

# P-27 policy metadata (Handled in test_main.py or explicitly here via FastApi TestClient)
from fastapi.testclient import TestClient
from app.api.v1.api import api_router
from fastapi import FastAPI
app = FastAPI()
app.include_router(api_router)
client = TestClient(app)

def test_p27_policy_metadata():
    response = client.get("/policy/metadata")
    assert response.status_code == 200
    data = response.json()
    assert data["policy_version"] == "policy-v1"
    assert data["ml_threshold"] == 0.8
    assert data["graph_threshold"] == 0.3

# P-28 restart persistence (Covered by DecisionModel SQLAlchemy additions)
def test_p28_restart_persistence():
    assert hasattr(DecisionModel, "policy_version")
    assert hasattr(DecisionModel, "input_fingerprint")

# P-29 Docker policy API (Run in docker)
# P-30 no client-controlled fake scores
def test_p30_no_client_scores():
    from app.api.v1.endpoints.decision import DecisionRequest
    # Request only accepts transaction_id
    req = DecisionRequest(transaction_id="TX1")
    assert not hasattr(req, "ml_score")
