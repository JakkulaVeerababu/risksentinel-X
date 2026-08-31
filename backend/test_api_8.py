import os
import json
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

# Set env vars before importing app
os.environ["AGENT_PROVIDER"] = "ollama"

from app.main import app
from app.db.session import SessionLocal

client = TestClient(app)

print("===== TEST 8: API E2E WITH MONKEYPATCH =====")

class MockResponse:
    def __init__(self, json_data, status_code=200):
        self.json_data = json_data
        self.status_code = status_code
        self._text = json.dumps(json_data)
        
    def json(self):
        return self.json_data
        
    def raise_for_status(self):
        pass
    
    @property
    def text(self):
        return self._text

def test_case_b():
    print("\n--- CASE B: ALL RESPONSES INVALID ---")
    
    def mock_post(*args, **kwargs):
        return MockResponse({"response": "NOT JSON AT ALL"})
        
    with patch('requests.post', side_effect=mock_post):
        payload = {
            "TransactionID": "8000002",
            "TransactionDT": 86400,
            "TransactionAmt": 9999.0,
            "ProductCD": "W",
            "card1": 13926,
            "customer_id": "CUST_8",
            "entity_id": "C8000"
        }
        resp = client.post("/api/v1/transactions/process", json=payload)
        print("API Status:", resp.status_code)
        print("API Response:", json.dumps(resp.json(), indent=2))

def test_case_c():
    print("\n--- CASE C: SCHEMA-INVALID JSON ---")
    
    def mock_post(*args, **kwargs):
        return MockResponse({"response": json.dumps({
            "recommendation": "DESTROY_TRANSACTION",
            "confidence": 8.5,
            "reason_codes": "random-string",
            "evidence": "not-an-array"
        })})
        
    with patch('requests.post', side_effect=mock_post):
        payload = {
            "TransactionID": "8000003",
            "TransactionDT": 86400,
            "TransactionAmt": 9999.0,
            "ProductCD": "W",
            "card1": 13926,
            "customer_id": "CUST_8",
            "entity_id": "C8000"
        }
        resp = client.post("/api/v1/transactions/process", json=payload)
        print("API Status:", resp.status_code)
        print("API Response:", json.dumps(resp.json(), indent=2))

if __name__ == "__main__":
    test_case_b()
    test_case_c()
