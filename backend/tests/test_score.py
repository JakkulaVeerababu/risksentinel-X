from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_score_endpoint_success():
    payload = {
        "TransactionID": "TX100",
        "TransactionDT": 86400,
        "TransactionAmt": 150.0,
        "ProductCD": "W",
        "card1": 1234
    }
    response = client.post("/api/v1/score", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    # Check that model returns something close to 0.54426
    assert 0.54 <= data["risk_score"] <= 0.55

def test_score_validation_error():
    payload = {
        "TransactionID": "TX100",
        "TransactionDT": "NOT_A_FLOAT",
        "TransactionAmt": 150.0,
        "ProductCD": "W"
    }
    response = client.post("/api/v1/score", json=payload)
    
    assert response.status_code == 422
    data = response.json()
    assert data["error"]["code"] == "VALIDATION_ERROR"
