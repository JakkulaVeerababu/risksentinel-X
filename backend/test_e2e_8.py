import json
import subprocess
from unittest.mock import patch

from app.db.session import SessionLocal
from app.agent.service import InvestigationService
from app.agent.schemas import InvestigationRequest
from app.agent.providers.ollama import OllamaProvider

DB_URL = "postgresql://postgres.etvyleucuuzuuhkzwwgs:2005THEFLASH9ZZ%40a@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

db = SessionLocal()

print("===== TEST 8: INVALID AGENT JSON =====")

service = InvestigationService()

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

def run_case_a():
    print("\n--- CASE A: INVALID THEN VALID (Testing Retry Logic) ---")
    call_count = 0
    def mock_post(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        if call_count == 1:
            return MockResponse({"response": "THIS IS NOT JSON"})
        else:
            return MockResponse({"response": json.dumps({
                "recommendation": "REVIEW",
                "confidence": 0.5,
                "reason_codes": ["UNUSUAL_AMOUNT"],
                "evidence": []
            })})
            
    with patch('requests.post', side_effect=mock_post):
        req = InvestigationRequest(
            transaction_id="8000001",
            customer_id="CUST_8",
            graph_entity_id="C8000",
            ml_risk_score=0.9,
            graph_risk_score=1.0
        )
        res = service.investigate(req, db)
        print("Provider calls made:", call_count)
        print("Agent State:", res.investigation.recommendation, res.investigation.confidence)
        print("Status:", res.status)

def run_case_b():
    print("\n--- CASE B: ALL RESPONSES INVALID ---")
    call_count = 0
    def mock_post(*args, **kwargs):
        nonlocal call_count
        call_count += 1
        return MockResponse({"response": "NOT JSON AT ALL"})
        
    with patch('requests.post', side_effect=mock_post):
        req = InvestigationRequest(
            transaction_id="8000002",
            customer_id="CUST_8",
            graph_entity_id="C8000",
            ml_risk_score=0.9,
            graph_risk_score=1.0
        )
        res = service.investigate(req, db)
        print("Provider calls made:", call_count)
        print("Agent State:", res.investigation.recommendation, res.investigation.confidence)
        print("Status:", res.status)

def run_case_c():
    print("\n--- CASE C: SCHEMA-INVALID JSON ---")
    def mock_post(*args, **kwargs):
        return MockResponse({"response": json.dumps({
            "recommendation": "DESTROY_TRANSACTION",
            "confidence": 8.5,
            "reason_codes": "random-string",
            "evidence": "not-an-array"
        })})
        
    with patch('requests.post', side_effect=mock_post):
        req = InvestigationRequest(
            transaction_id="8000003",
            customer_id="CUST_8",
            graph_entity_id="C8000",
            ml_risk_score=0.9,
            graph_risk_score=1.0
        )
        res = service.investigate(req, db)
        print("Agent State:", res.investigation.recommendation, res.investigation.confidence)
        print("Status:", res.status)

if __name__ == "__main__":
    run_case_a()
    run_case_b()
    run_case_c()
