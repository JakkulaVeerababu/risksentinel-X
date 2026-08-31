import os
import json
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient

os.environ["AGENT_PROVIDER"] = "ollama"

from app.main import app
from app.db.session import SessionLocal

client = TestClient(app)
db = SessionLocal()

print("===== TEST 9: UNSUPPORTED / FABRICATED EVIDENCE =====")

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

def test_case(case_name, tx_id, mock_json):
    print(f"\n--- {case_name} ---")
    def mock_post(*args, **kwargs):
        return MockResponse({"response": json.dumps(mock_json)})
        
    with patch('requests.post', side_effect=mock_post):
        payload = {
            "TransactionID": tx_id,
            "TransactionDT": 86400,
            "TransactionAmt": 9999.0,
            "ProductCD": "W",
            "card1": 13926,
            "customer_id": "CUST_9",
            "entity_id": "C8000"
        }
        resp = client.post("/api/v1/transactions/process", json=payload)
        print("API Status:", resp.status_code)
        print("API Response:", json.dumps(resp.json(), indent=2))
        
        # Verify DB audit
        print("Audit Events:")
        from sqlalchemy import text
        audit = db.execute(text(f"SELECT event_type FROM audit_events WHERE transaction_id='{tx_id}' ORDER BY timestamp ASC")).fetchall()
        for a in audit:
            print(" -", a[0])
            
        print("Investigation state:")
        inv = db.execute(text(f"SELECT agent_state, recommendation, confidence, evidence FROM investigations WHERE transaction_id='{tx_id}'")).fetchone()
        if inv:
            print(f"State: {inv[0]}, Rec: {inv[1]}, Conf: {inv[2]}, Evidence: {inv[3]}")
        else:
            print("No investigation persisted.")

if __name__ == "__main__":
    # Ensure there is a history transaction to prepare the history context
    client.post("/api/v1/transactions/process", json={
        "TransactionID": "9000000",
        "TransactionDT": 86400,
        "TransactionAmt": 10.0,
        "ProductCD": "W",
        "card1": 13926,
        "customer_id": "CUST_9",
        "entity_id": "C10" # Low risk entity to not trigger agent
    })

    # Case A
    test_case("CASE A: FABRICATED EVIDENCE", "9000001", {
        "recommendation": "BLOCK",
        "confidence": 0.99,
        "reason_codes": ["UNUSUAL_AMOUNT"],
        "evidence": [
            {
                "source": "transaction_history",
                "signal": "fraudulent_payments_last_hour",
                "observed": "57"
            }
        ]
    })
    
    # Case B
    test_case("CASE B: WRONG SOURCE", "9000002", {
        "recommendation": "REVIEW",
        "confidence": 0.8,
        "reason_codes": ["UNUSUAL_AMOUNT"],
        "evidence": [
            {
                "source": "transaction_history", # Wrong source! Should be graph_context
                "signal": "shared_device_count",
                "observed": "5" # C8000 has 5 shared devices
            }
        ]
    })

    # Case C
    test_case("CASE C: MIXED EVIDENCE", "9000003", {
        "recommendation": "REVIEW",
        "confidence": 0.8,
        "reason_codes": ["UNUSUAL_AMOUNT"],
        "evidence": [
            {
                "source": "graph_context",
                "signal": "shared_device_count",
                "observed": "5"
            },
            {
                "source": "transaction_history",
                "signal": "prior_chargebacks",
                "observed": "900"
            }
        ]
    })
    
    # Case D
    test_case("CASE D: INVALID SOURCE", "9000004", {
        "recommendation": "REVIEW",
        "confidence": 0.8,
        "reason_codes": ["UNUSUAL_AMOUNT"],
        "evidence": [
            {
                "source": "internet_search",
                "signal": "external_website",
                "observed": "customer is fraudulent"
            }
        ]
    })
    
    # Case E
    test_case("CASE E: BLOCK 0.99 + UNSUPPORTED EVIDENCE", "9000005", {
        "recommendation": "BLOCK",
        "confidence": 0.99,
        "reason_codes": ["UNUSUAL_AMOUNT"],
        "evidence": [
            {
                "source": "transaction_history",
                "signal": "fraudulent_payments_last_hour",
                "observed": "57"
            }
        ]
    })
