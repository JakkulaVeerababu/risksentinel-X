import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.graph.risk import GraphRiskCalculator
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
    response = client.get("/api/v1/graph-check?entity_id=FAKE_ENTITY")
    
    # Either 404 if graph is loaded and entity is missing, or 503 if graph isn't loaded
    assert response.status_code in [404, 503]
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] in ["ENTITY_NOT_FOUND", "GRAPH_NOT_AVAILABLE"]

