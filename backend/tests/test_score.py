from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_score_endpoint_unavailable_model():
    # Since we haven't trained a model in the CI environment, the service should handle this gracefully
    payload = {
        "TransactionID": "TX100",
        "TransactionDT": 86400,
        "TransactionAmt": 150.0,
        "ProductCD": "W",
        "card1": 1234
    }
    response = client.post("/api/v1/score", json=payload)
    
    assert response.status_code == 503
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "MODEL_NOT_AVAILABLE"

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
