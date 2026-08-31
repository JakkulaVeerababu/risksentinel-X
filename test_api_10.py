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

print("===== TEST 10: DETERMINISTIC POLICY ALLOW FIXTURE =====")

# Step 4: Policy Harness Check
from app.policy.engine import PolicyEngine
from app.policy.schemas import PolicyInput
policy_engine = PolicyEngine()
input_data = PolicyInput(
    transaction_id="9200000",
    ml_score=0.321,
    ml_model_version="xgb-ieeecis-v1",
    graph_score=0.088,
    graph_version="v2",
    agent_state="SKIPPED",
    agent_recommendation=None,
    agent_confidence=None
)
res1 = policy_engine.evaluate(input_data)
res2 = policy_engine.evaluate(input_data)
print(f"Policy run 1: {res1.final_decision}, matched: {res1.matched_rule_ids}, version: {res1.policy_version}")
print(f"Policy run 2: {res2.final_decision}, matched: {res2.matched_rule_ids}, version: {res2.policy_version}")

# Step 5: Boundary Sanity Check
# ML threshold is 0.80, Graph is 0.30
print("\n--- Boundary Sanity Check ---")
b_below = policy_engine.evaluate(PolicyInput(transaction_id="B1", ml_score=0.799, ml_model_version="v1", graph_score=0.299, graph_version="v2", agent_state="SKIPPED", agent_recommendation=None, agent_confidence=None))
b_at = policy_engine.evaluate(PolicyInput(transaction_id="B2", ml_score=0.800, ml_model_version="v1", graph_score=0.300, graph_version="v2", agent_state="SKIPPED", agent_recommendation=None, agent_confidence=None))
b_above = policy_engine.evaluate(PolicyInput(transaction_id="B3", ml_score=0.801, ml_model_version="v1", graph_score=0.301, graph_version="v2", agent_state="SKIPPED", agent_recommendation=None, agent_confidence=None))
print(f"Below thresholds (0.799, 0.299): {b_below.final_decision}")
print(f"At thresholds (0.800, 0.300): {b_at.final_decision}")
print(f"Above thresholds (0.801, 0.301): {b_above.final_decision}")

print("\n--- E2E Transaction API ---")
tx_id = "9200001"
payload = {
    "TransactionID": tx_id,
    "TransactionDT": 86400,
    "TransactionAmt": 10.0,
    "ProductCD": "W",
    "card1": 13926,
    "customer_id": "CUST_10",
    "entity_id": "C0025"
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

print("\n--- AUDIT VERIFICATION ---")
audit = db.execute(text(f"SELECT event_type FROM audit_events WHERE transaction_id='{tx_id}' ORDER BY timestamp ASC")).fetchall()
for a in audit:
    print(" -", a[0])
