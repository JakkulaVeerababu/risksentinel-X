import pytest
from app.agent.schemas import InvestigationResult, ReasonCodeEnum, EvidenceItem
from app.agent.validators import DeterministicValidator

def test_hallucination_rejection():
    # Context provided by tools
    context = {
        "graph_context": {
            "shared_device_count": "2",
            "cluster_detected": "True"
        }
    }
    
    # Fake LLM output trying to hallucinate 20 shared devices
    fake_llm_result = InvestigationResult(
        recommendation="BLOCK",
        confidence=0.99,
        reason_codes=[ReasonCodeEnum.DEVICE_REUSE],
        evidence=[
            EvidenceItem(signal="shared_device_count", observed="20", source="graph_context")
        ]
    )
    
    # Validate
    validated = DeterministicValidator.validate_and_filter(fake_llm_result, context)
    
    # Evidence should be stripped because "20" != "2"
    assert len(validated.evidence) == 0
    # Because all evidence was stripped, the fallback triggers
    assert validated.recommendation == "REVIEW"
    assert validated.confidence == 0.0
    assert ReasonCodeEnum.INSUFFICIENT_EVIDENCE in validated.reason_codes

def test_unsupported_reason_code():
    context = {
        "graph_context": {
            "shared_device_count": "1", # Not reused
        }
    }
    
    fake_llm_result = InvestigationResult(
        recommendation="REVIEW",
        confidence=0.8,
        reason_codes=[ReasonCodeEnum.DEVICE_REUSE], # Trying to claim reuse
        evidence=[
            EvidenceItem(signal="shared_device_count", observed="1", source="graph_context")
        ]
    )
    
    validated = DeterministicValidator.validate_and_filter(fake_llm_result, context)
    
    # Evidence remains because it matches (1 == 1)
    assert len(validated.evidence) == 1
    # But Reason Code is stripped because DEVICE_REUSE requires count > 1
    assert ReasonCodeEnum.DEVICE_REUSE not in validated.reason_codes

def test_provider_timeout_fallback():
    from app.agent.providers.mock import MockProvider
    from app.agent.service import InvestigationService
    from app.agent.schemas import InvestigationRequest
    
    service = InvestigationService()
    # Force timeout
    service.provider = MockProvider(simulate_failure=True)
    
    req = InvestigationRequest(
        transaction_id="TX123",
        customer_id="C123",
        graph_entity_id="D123"
    )
    
    res = service.investigate(req)
    
    assert res.status == "DEGRADED"
    assert res.investigation.recommendation == "REVIEW"
    assert ReasonCodeEnum.AGENT_UNAVAILABLE in res.investigation.reason_codes
