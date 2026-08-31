import json
import logging
from sqlalchemy import text
from app.db.session import SessionLocal
from app.policy.service import PolicyService

db = SessionLocal()

print("===== TEST 15: COMPLETE AUDIT TRAIL + DETERMINISTIC REPLAY =====")

# Step 1: Select cases
cases = {
    "ALLOW": "9200001",
    "REVIEW": "9300001",
    "BLOCK": "9400001",
    "DEGRADED": "9500004"
}

for k, v in cases.items():
    print(f"{k} TransactionID: {v}")

print("\n--- CORE PERSISTENCE & CONSISTENCY & REPLAY ---")

policy_service = PolicyService(db)

for case_type, tx_id in cases.items():
    if not tx_id:
        continue
    
    # Core Persistence
    tx_count = db.execute(text(f"SELECT COUNT(*) FROM transactions WHERE transaction_id='{tx_id}'")).fetchone()[0]
    rs_count = db.execute(text(f"SELECT COUNT(*) FROM risk_scores WHERE transaction_id='{tx_id}'")).fetchone()[0]
    inv_count = db.execute(text(f"SELECT COUNT(*) FROM investigations WHERE transaction_id='{tx_id}'")).fetchone()[0]
    dec_count = db.execute(text(f"SELECT COUNT(*) FROM decisions WHERE transaction_id='{tx_id}'")).fetchone()[0]
    audit_count = db.execute(text(f"SELECT COUNT(*) FROM audit_events WHERE transaction_id='{tx_id}'")).fetchone()[0]
    
    assert tx_count >= 1
    assert rs_count >= 1
    if case_type != "ALLOW":
        assert inv_count >= 1
    assert dec_count == 1
    assert audit_count > 0
    
    dec_row = db.execute(text(f"SELECT decision, policy_version, matched_rules FROM decisions WHERE transaction_id='{tx_id}'")).fetchone()
    original_decision = dec_row[0]
    original_version = dec_row[1]
    original_rules = dec_row[2]
    
    print(f"\n[{case_type}] {tx_id}")
    print(f"Original: {original_decision}, Rule: {original_rules}")
    
    # Policy Replay
    replay_result = policy_service.evaluate_decision(tx_id)
    print(f"Replayed: {replay_result.final_decision}, Rule: {replay_result.matched_rule_ids}")
    
    assert original_decision == replay_result.final_decision
    
    # original_rules might be a dict or a string depending on DB backend
    orig_rules_dict = original_rules if isinstance(original_rules, dict) else json.loads(original_rules)
    assert set(orig_rules_dict["matched_rule_ids"]) == set(replay_result.matched_rule_ids)
    
    # Chronology & Field Check
    audits = db.execute(text(f"SELECT event_type, timestamp, payload FROM audit_events WHERE transaction_id='{tx_id}' ORDER BY timestamp ASC")).fetchall()
    events = [a[0] for a in audits]
    print(f"Chronology: {' -> '.join(events)}")
    
    # Ensure no decisions before graph
    ml_idx = events.index("ML_SCORED") if "ML_SCORED" in events else -1
    graph_idx = events.index("GRAPH_CHECKED") if "GRAPH_CHECKED" in events else -1
    policy_idx = events.index("POLICY_DECISION") if "POLICY_DECISION" in events else events.index("POLICY_EVALUATED") if "POLICY_EVALUATED" in events else -1
    
    if policy_idx != -1 and ml_idx != -1:
        assert policy_idx > ml_idx
    if policy_idx != -1 and graph_idx != -1:
        assert policy_idx > graph_idx
        
    print(f"Chronology OK for {case_type}")

print("\n--- GLOBAL DATABASE INTEGRITY ---")
total_tx = db.execute(text("SELECT COUNT(*) FROM transactions")).fetchone()[0]
total_rs = db.execute(text("SELECT COUNT(*) FROM risk_scores")).fetchone()[0]
total_inv = db.execute(text("SELECT COUNT(*) FROM investigations")).fetchone()[0]
total_dec = db.execute(text("SELECT COUNT(*) FROM decisions")).fetchone()[0]
total_audit = db.execute(text("SELECT COUNT(*) FROM audit_events")).fetchone()[0]

print(f"Total transactions: {total_tx}")
print(f"Total risk_scores: {total_rs}")
print(f"Total investigations: {total_inv}")
print(f"Total decisions: {total_dec}")
print(f"Total audit_events: {total_audit}")

dec_without_audit = db.execute(text("SELECT COUNT(*) FROM decisions d LEFT JOIN audit_events a ON d.transaction_id = a.transaction_id WHERE a.id IS NULL")).fetchone()[0]
print(f"Completed decisions without audit: {dec_without_audit}")
assert dec_without_audit == 0

decided_tx_no_dec = db.execute(text("SELECT COUNT(*) FROM transactions t LEFT JOIN decisions d ON t.transaction_id = d.transaction_id WHERE t.status = 'DECIDED' AND d.id IS NULL")).fetchone()[0]
print(f"DECIDED transactions without decision: {decided_tx_no_dec}")
assert decided_tx_no_dec == 0

print("\n--- SECURITY / PRIVACY ---")
secrets_found = False
ground_truth = False

# simple grep in DB
bad_words = ["DATABASE_URL", "postgresql://", "sk-", "secret=", "token=", "OPENAI_API_KEY", "ANTHROPIC_API_KEY"]
leak_words = ["ground_truth_label", "planted_cluster_id", "SC-", "is_suspicious", "benchmark_label"]

audits = db.execute(text("SELECT payload FROM audit_events")).fetchall()
invs = db.execute(text("SELECT evidence, tool_calls FROM investigations")).fetchall()

for row in audits + invs:
    text_data = str(row).lower()
    for w in bad_words:
        if w.lower() in text_data:
            secrets_found = True
    for w in leak_words:
        if w.lower() in text_data:
            ground_truth = True

print(f"Secrets found in audit: {secrets_found}")
print(f"Ground-truth leakage found: {ground_truth}")

assert not secrets_found
assert not ground_truth

print("\nTEST 15 PASSED")
