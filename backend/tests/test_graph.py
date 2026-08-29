import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.graph.risk import GraphRiskCalculator
from app.graph.service import GraphRiskService
import networkx as nx

client = TestClient(app)

def test_graph_risk_bounds():
    # Test bounding logic
    signals = {
        "shared_device_count": 10,
        "shared_ip_count": 10,
        "payment_instrument_reuse": 10,
        "community_size": 10,
        "community_density": 0.9,
        "connected_customer_count": 50
    }
    risk = GraphRiskCalculator.calculate_risk(signals)
    assert 0.0 <= risk <= 1.0
    
    signals_low = {
        "shared_device_count": 0,
        "shared_ip_count": 0,
        "payment_instrument_reuse": 0,
        "community_size": 0,
        "community_density": 0.0,
        "connected_customer_count": 0
    }
    risk_low = GraphRiskCalculator.calculate_risk(signals_low)
    assert risk_low == 0.0

def test_api_graph_check_missing_entity():
    # G-T08 & G-19: Unknown entity handled
    response = client.get("/api/v1/graph/graph-check?entity_id=FAKE_ENTITY")
    
    # Either 404 if graph is loaded and entity is missing, or 503 if graph isn't loaded
    assert response.status_code in [404, 503]
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] in ["ENTITY_NOT_FOUND", "GRAPH_NOT_AVAILABLE"]

def test_benign_sharing():
    # G-T05: Benign sharing test
    service = GraphRiskService.get_instance()
    if not service.is_loaded:
        pytest.skip("Graph not loaded")
        
    # In our generator, customer C0001 is a normal household (shares 1-3 devices)
    res = service.check_entity("C0001")
    assert res["graph_risk"] < GraphRiskCalculator.GRAPH_SUSPICIOUS_THRESHOLD
    assert res["cluster_detected"] is False

def test_suspicious_collusion():
    # G-T06: Suspicious collusion test
    service = GraphRiskService.get_instance()
    if not service.is_loaded:
        pytest.skip("Graph not loaded")
        
    # SC-01 planted pattern A starts at C5000 (10 customers share 2 devices)
    res_suspicious = service.check_entity("C5000")
    res_benign = service.check_entity("C0001")
    
    # Meaningfully stronger structural risk than isolated/benign case
    assert res_suspicious["graph_risk"] > res_benign["graph_risk"]
    assert res_suspicious["signals"]["connected_customer_count"] > res_benign["signals"]["connected_customer_count"]

def test_isolated_entity():
    # G-T07: Isolated entity
    service = GraphRiskService.get_instance()
    if not service.is_loaded:
        pytest.skip("Graph not loaded")
    
    # Create a temporary isolated node in the graph for testing
    service.graph.add_node("ISOLATED_CUST", entity_type="customer", community_id=-1)
    res = service.check_entity("ISOLATED_CUST")
    assert res["graph_risk"] == 0.0
    
    # Cleanup
    service.graph.remove_node("ISOLATED_CUST")

def test_api_graph_context_real_service():
    # G-T12: Context uses real GraphService
    service = GraphRiskService.get_instance()
    if not service.is_loaded:
        pytest.skip("Graph not loaded")
        
    response = client.get("/api/v1/graph/context/C0001")
    assert response.status_code == 200
    data = response.json()
    assert data["entity_id"] == "C0001"
    assert "graph_score" in data
    assert "signals" in data
    assert "nodes" in data
    assert "links" in data

def test_api_graph_check_alias():
    # G-T13: Check endpoint uses real GraphService
    service = GraphRiskService.get_instance()
    if not service.is_loaded:
        pytest.skip("Graph not loaded")
        
    response1 = client.get("/api/v1/graph/graph-check?entity_id=C0001")
    response2 = client.get("/api/v1/graph/check/C0001")
    
    assert response1.status_code == 200
    assert response2.status_code == 200
    assert response1.json() == response2.json()
