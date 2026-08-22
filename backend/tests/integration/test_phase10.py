import pytest
import os
from fastapi.testclient import TestClient
from app.main import app
from app.audit.service import AuditService
from app.audit.schemas import AuditEvent
import time

client = TestClient(app)

def test_cost_simulation_api():
    """Test the FP/FN Cost Explorer API with custom assumptions."""
    # Using defaults
    response = client.get("/api/v1/evaluation/cost-simulation")
    assert response.status_code == 200
    data = response.json()
    assert data["fp_unit_cost"] == 150
    assert data["fn_unit_cost"] == 2000
    assert "fp_count" in data
    assert "fn_count" in data
    
    # Using custom
    response = client.get("/api/v1/evaluation/cost-simulation?fp_unit_cost=100&fn_unit_cost=5000")
    assert response.status_code == 200
    data = response.json()
    assert data["fp_unit_cost"] == 100
    assert data["fn_unit_cost"] == 5000
    assert data["total_simulated_cost"] == (data["fp_count"] * 100) + (data["fn_count"] * 5000)

def test_audit_explorer_pagination_and_filters():
    """Test Audit Explorer API filters."""
    # Inject some mock audit data
    AuditService._store.clear()
    
    evt1 = AuditEvent(
        transaction_id="TX-111",
        event_type="FINAL_DECISION_CREATED",
        payload={"decision": "BLOCK", "reason_codes": ["GRAPH_CLUSTER_RISK"]},
        timestamp=time.time() - 100
    )
    evt2 = AuditEvent(
        transaction_id="TX-222",
        event_type="FINAL_DECISION_CREATED",
        payload={"decision": "REVIEW", "reason_codes": ["AGENT_UNAVAILABLE"]},
        timestamp=time.time() - 50
    )
    
    AuditService.log_event("TX-111", evt1.event_type, evt1.payload)
    AuditService.log_event("TX-222", evt2.event_type, evt2.payload)
    
    # 1. Filter by decision
    res_block = client.get("/api/v1/audit/?decision=BLOCK")
    assert res_block.status_code == 200
    assert len(res_block.json()) == 1
    assert res_block.json()[0]["transaction_id"] == "TX-111"
    
    # 2. Filter by reason code
    res_reason = client.get("/api/v1/audit/?reason_code=AGENT_UNAVAILABLE")
    assert res_reason.status_code == 200
    assert len(res_reason.json()) == 1
    assert res_reason.json()[0]["transaction_id"] == "TX-222"

def test_agent_failure_simulation():
    """Test that simulating an LLM outage gracefully degrades to REVIEW."""
    os.environ["SIMULATE_AGENT_FAILURE"] = "true"
    try:
        response = client.post("/api/v1/score", json={
            "transaction_id": "TX-FAIL-TEST",
            "customer_id": "C-FAIL",
            "amount": 5000,
            "currency": "INR",
            "timestamp": "2023-01-01T12:00:00Z",
            "merchant_id": "M-1",
            "payment_method": "upi",
            "device_id": "DEV-1",
            "ip_address": "192.168.1.1"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["agent_status"] == "DEGRADED"
        assert data["policy_decision"] == "REVIEW"
        
        # Verify Audit Log captures the failure
        audit_res = client.get("/api/v1/audit/TX-FAIL-TEST")
        events = audit_res.json()["events"]
        decision_event = [e for e in events if e["event_type"] == "FINAL_DECISION_CREATED"][0]
        assert "AGENT_UNAVAILABLE" in decision_event["payload"]["reason_codes"]

    finally:
        del os.environ["SIMULATE_AGENT_FAILURE"]
