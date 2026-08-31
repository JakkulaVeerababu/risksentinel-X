import os
import json
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db.session import SessionLocal

client = TestClient(app)
db = SessionLocal()

print("===== TEST 11: DETERMINISTIC POLICY REVIEW FIXTURE =====")

# Step 5: Direct Policy Determinism
from app.policy.engine import PolicyEngine
from app.policy.schemas import PolicyInput
policy_engine = PolicyEngine()

# Test 11 requires a fixture that yields REVIEW.
# We will test the P-V1-003 rule: low ML + high graph
input_data = PolicyInput(
    transaction_id="9300000",
    ml_score=0.557,
    ml_model_version="xgb-ieeecis-v1",
    graph_score=1.0,
    graph_version="v2",
    agent_state="COMPLETED",
    agent_recommendation="ALLOW",  # Agent recommends ALLOW, but policy will force REVIEW
    agent_confidence=0.9
)
res1 = policy_engine.evaluate(input_data)
res2 = policy_engine.evaluate(input_data)
print("\n--- Direct Policy Determinism ---")
print(f"Policy run 1: {res1.final_decision}, matched: {res1.matched_rule_ids}, version: {res1.policy_version}")
print(f"Policy run 2: {res2.final_decision}, matched: {res2.matched_rule_ids}, version: {res2.policy_version}")

print("\n--- E2E Transaction API ---")
tx_id = "9300001"
payload = {
    "TransactionID": tx_id,
    "TransactionDT": 86400,
    "TransactionAmt": 9999.0, # High amount, keeps ML slightly elevated but below 0.8
    "ProductCD": "W",
    "card1": 13926,
    "customer_id": "CUST_11",
    "entity_id": "C8000" # High risk cluster, graph_risk = 1.0
}

resp = client.post("/api/v1/transactions/process", json=payload)
print("API Status:", resp.status_code)
print("API Response:", json.dumps(resp.json(), indent=2))

print("\n--- DB VERIFICATION ---")
from sqlalchemy import text
print("Transactions:", db.execute(text(f"SELECT COUNT(*) FROM transactions WHERE transaction_id='{tx_id}'")).fetchone()[0])
print("Risk Scores:", db.execute(text(f"SELECT COUNT(*) FROM risk_scores WHERE transaction_id='{tx_id}'")).fetchone()[0])
print("Investigations:", db.execute(text(f"SELECT COUNT(*) FROM investigations WHERE transaction_id='{tx_id}'")).fetchone()[0])
print("Decisions:", db.execute(text(f"SELECT COUNT(*) FROM decisions WHERE transaction_id='{tx_id}'")).fetchone()[0])

d = db.execute(text(f"SELECT decision, policy_version, matched_rules FROM decisions WHERE transaction_id='{tx_id}'")).fetchone()
if d:
    print(f"Decision Row: {d[0]}, {d[1]}, {d[2]}")

# Contradictory check
print("Contradictory ALLOW decisions:", db.execute(text(f"SELECT COUNT(*) FROM decisions WHERE transaction_id='{tx_id}' AND decision='ALLOW'")).fetchone()[0])
print("Contradictory BLOCK decisions:", db.execute(text(f"SELECT COUNT(*) FROM decisions WHERE transaction_id='{tx_id}' AND decision='BLOCK'")).fetchone()[0])

print("\n--- AUDIT VERIFICATION ---")
audit = db.execute(text(f"SELECT event_type FROM audit_events WHERE transaction_id='{tx_id}' ORDER BY timestamp ASC")).fetchall()
for a in audit:
    print(" -", a[0])
