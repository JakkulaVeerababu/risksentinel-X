import os
import json
import pytest
from fastapi.testclient import TestClient

os.environ["AGENT_PROVIDER"] = "ollama"

from app.main import app
from app.db.session import SessionLocal

client = TestClient(app)
db = SessionLocal()

print("===== TEST 12: DETERMINISTIC POLICY BLOCK FIXTURE =====")

from app.policy.engine import PolicyEngine
from app.policy.schemas import PolicyInput
policy_engine = PolicyEngine()

print("\n--- Negative Control 1: High ML + Low Graph ---")
# ML=0.919, Graph=0.088 (like C0025)
nc1 = policy_engine.evaluate(PolicyInput(
    transaction_id="NC1", ml_score=0.919, ml_model_version="xgb-v1", graph_score=0.088, graph_version="v2",
    agent_state="SKIPPED", agent_recommendation=None, agent_confidence=None
))
print(f"NC1 High ML/Low Graph -> Decision: {nc1.final_decision}, Rule: {nc1.matched_rule_ids}")

print("\n--- Negative Control 2: Low ML + High Graph ---")
# ML=0.557, Graph=1.0 (like C8000)
nc2 = policy_engine.evaluate(PolicyInput(
    transaction_id="NC2", ml_score=0.557, ml_model_version="xgb-v1", graph_score=1.0, graph_version="v2",
    agent_state="SKIPPED", agent_recommendation=None, agent_confidence=None
))
print(f"NC2 Low ML/High Graph -> Decision: {nc2.final_decision}, Rule: {nc2.matched_rule_ids}")

print("\n--- Negative Control 3: AI BLOCK ALONE ---")
# ML=0.321, Graph=0.088, Agent=BLOCK
nc3 = policy_engine.evaluate(PolicyInput(
    transaction_id="NC3", ml_score=0.321, ml_model_version="xgb-v1", graph_score=0.088, graph_version="v2",
    agent_state="COMPLETED", agent_recommendation="BLOCK", agent_confidence=0.9
))
print(f"NC3 Low ML/Low Graph/Agent BLOCK -> Decision: {nc3.final_decision}, Rule: {nc3.matched_rule_ids}")

print("\n--- Determinism (Direct Policy) ---")
# ML=0.919, Graph=1.0
block_input = PolicyInput(
    transaction_id="BLOCK1", ml_score=0.919, ml_model_version="xgb-v1", graph_score=1.0, graph_version="v2",
    agent_state="COMPLETED", agent_recommendation="ALLOW", agent_confidence=0.9 # Agent allow should be ignored
)
res1 = policy_engine.evaluate(block_input)
res2 = policy_engine.evaluate(block_input)
print(f"Run 1 -> Decision: {res1.final_decision}, Rule: {res1.matched_rule_ids}, Version: {res1.policy_version}")
print(f"Run 2 -> Decision: {res2.final_decision}, Rule: {res2.matched_rule_ids}, Version: {res2.policy_version}")

print("\n--- Boundaries ---")
b_ml_below = policy_engine.evaluate(PolicyInput(transaction_id="B_ML_L", ml_score=0.799, ml_model_version="v1", graph_score=1.0, graph_version="v2", agent_state="COMPLETED", agent_recommendation=None, agent_confidence=None))
b_ml_at    = policy_engine.evaluate(PolicyInput(transaction_id="B_ML_A", ml_score=0.800, ml_model_version="v1", graph_score=1.0, graph_version="v2", agent_state="COMPLETED", agent_recommendation=None, agent_confidence=None))
b_ml_above = policy_engine.evaluate(PolicyInput(transaction_id="B_ML_H", ml_score=0.801, ml_model_version="v1", graph_score=1.0, graph_version="v2", agent_state="COMPLETED", agent_recommendation=None, agent_confidence=None))
print(f"ML just below (0.799): {b_ml_below.final_decision}")
print(f"ML exactly at (0.800): {b_ml_at.final_decision}")
print(f"ML just above (0.801): {b_ml_above.final_decision}")

b_g_below = policy_engine.evaluate(PolicyInput(transaction_id="B_G_L", ml_score=0.919, ml_model_version="v1", graph_score=0.299, graph_version="v2", agent_state="COMPLETED", agent_recommendation=None, agent_confidence=None))
b_g_at    = policy_engine.evaluate(PolicyInput(transaction_id="B_G_A", ml_score=0.919, ml_model_version="v1", graph_score=0.300, graph_version="v2", agent_state="COMPLETED", agent_recommendation=None, agent_confidence=None))
b_g_above = policy_engine.evaluate(PolicyInput(transaction_id="B_G_H", ml_score=0.919, ml_model_version="v1", graph_score=0.301, graph_version="v2", agent_state="COMPLETED", agent_recommendation=None, agent_confidence=None))
print(f"Graph just below (0.299): {b_g_below.final_decision}")
print(f"Graph exactly at (0.300): {b_g_at.final_decision}")
print(f"Graph just above (0.301): {b_g_above.final_decision}")


print("\n--- E2E Transaction API ---")
tx_id = "9400001"
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
    "customer_id": "CUST_12",
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

print("Contradictory ALLOW decisions:", db.execute(text(f"SELECT COUNT(*) FROM decisions WHERE transaction_id='{tx_id}' AND decision='ALLOW'")).fetchone()[0])
print("Contradictory REVIEW decisions:", db.execute(text(f"SELECT COUNT(*) FROM decisions WHERE transaction_id='{tx_id}' AND decision='REVIEW'")).fetchone()[0])

print("\n--- AUDIT VERIFICATION ---")
audit = db.execute(text(f"SELECT event_type FROM audit_events WHERE transaction_id='{tx_id}' ORDER BY timestamp ASC")).fetchall()
for a in audit:
    print(" -", a[0])
