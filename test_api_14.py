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

print("===== TEST 14: AGENT PROVIDER OUTAGE (DEGRADED PIPELINE) =====")

tx_id = "9500003"
payload = {
    "TransactionID": tx_id,
    "TransactionDT": 86400,
    "TransactionAmt": 1000.0,
    "ProductCD": "C",
    "card1": 15000,
    "card2": 500,
    "card3": 150,
    "card4": "visa",
    "card5": 226,
    "card6": "credit",
    "addr1": 299,
    "addr2": 87,
    "dist1": 1000,
    "dist2": 1000,
    "P_emaildomain": "anonymous.com",
    "R_emaildomain": "anonymous.com",
    "C1": 10, "C2": 10, "C3": 10, "C4": 10, "C5": 10, "C6": 10, "C7": 10, "C8": 10, "C9": 10, "C10": 10, "C11": 10, "C12": 10, "C13": 10, "C14": 10,
    "D1": 0, "D2": 0, "D3": 0, "D4": 0, "D5": 0, "D10": 0, "D11": 0, "D15": 0,
    "M1": "F", "M2": "F", "M3": "F", "M4": "M0", "M5": "F", "M6": "F", "M7": "F", "M8": "F", "M9": "F",
    "V1": 1, "V3": 1, "V4": 1, "V5": 1, "V6": 1, "V7": 1, "V8": 1, "V9": 1, "V10": 1, "V11": 1,
    "V12": 1, "V13": 1, "V14": 1, "V15": 1, "V16": 1, "V17": 1, "V18": 1, "V19": 1, "V20": 1, "V21": 1,
    "V22": 1, "V23": 1, "V24": 1, "V25": 1, "V26": 1, "V27": 1, "V28": 1, "V29": 1, "V30": 1, "V31": 1, "V32": 1, "V33": 1, "V34": 1,
    "customer_id": "CUST_14",
    "entity_id": "C0025" # Low graph risk, high ML risk => RUN_AGENT
}

from app.agent.providers.ollama import OllamaProvider
from app.agent.providers.mock import MockProvider

def mock_timeout_investigation(*args, **kwargs):
    print(">>> MOCK PROVIDER TIMEOUT CALLED <<<")
    raise TimeoutError("Provider unreachable: Connection timed out after 30s")

original_ollama = OllamaProvider.generate_structured_investigation
OllamaProvider.generate_structured_investigation = mock_timeout_investigation

original_mock = MockProvider.generate_structured_investigation
MockProvider.generate_structured_investigation = mock_timeout_investigation

try:
    resp = client.post("/api/v1/transactions/process", json=payload)
    print("API Status:", resp.status_code)
    print("API Response:", json.dumps(resp.json(), indent=2))
finally:
    OllamaProvider.generate_structured_investigation = original_ollama
    MockProvider.generate_structured_investigation = original_mock

print("\n--- DB VERIFICATION ---")
from sqlalchemy import text
print("Transactions:", db.execute(text(f"SELECT COUNT(*) FROM transactions WHERE transaction_id='{tx_id}'")).fetchone()[0])
print("Risk Scores:", db.execute(text(f"SELECT COUNT(*) FROM risk_scores WHERE transaction_id='{tx_id}'")).fetchone()[0])
print("Investigations:", db.execute(text(f"SELECT COUNT(*) FROM investigations WHERE transaction_id='{tx_id}'")).fetchone()[0])
print("Decisions:", db.execute(text(f"SELECT COUNT(*) FROM decisions WHERE transaction_id='{tx_id}'")).fetchone()[0])

d = db.execute(text(f"SELECT decision, policy_version, matched_rules FROM decisions WHERE transaction_id='{tx_id}'")).fetchone()
if d:
    print(f"Decision Row: {d[0]}, {d[1]}, {d[2]}")

print("\n--- AUDIT VERIFICATION ---")
audit = db.execute(text(f"SELECT event_type FROM audit_events WHERE transaction_id='{tx_id}' ORDER BY timestamp ASC")).fetchall()
for a in audit:
    print(" -", a[0])
