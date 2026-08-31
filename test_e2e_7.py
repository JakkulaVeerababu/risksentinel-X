import requests
import json
import subprocess
import time

API_URL = "http://localhost:8000/api/v1/transactions/process"
DB_URL = "postgresql://postgres.etvyleucuuzuuhkzwwgs:2005THEFLASH9ZZ%40a@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

CUST_ID = "CUST_7"
TX_ID_1 = "7000001"
ENTITY_ID_1 = "C0025" # Benign, to ensure it doesn't do much

# Send Transaction 1 to populate history
payload_1 = {
  "TransactionID": TX_ID_1,
  "TransactionDT": 86400,
  "TransactionAmt": 100.0,
  "ProductCD": "W",
  "card1": 13926,
  "customer_id": CUST_ID,
  "entity_id": ENTITY_ID_1
}

print(f"Sending TX 1 to prepare history: {TX_ID_1}")
r1 = requests.post(API_URL, json=payload_1)
print("TX 1 Status:", r1.status_code)
print(json.dumps(r1.json(), indent=2))

# Wait a sec
time.sleep(1)

# Check DB count before TX 2
print("\nChecking DB for history...")
res = subprocess.run(["psql", DB_URL, "-t", "-c", f"SELECT count(*) FROM transactions WHERE customer_id='{CUST_ID}'"], capture_output=True, text=True)
count = res.stdout.strip()
print(f"Customer {CUST_ID} has {count} transactions persisted.")

# Send Transaction 2 to trigger RUN_AGENT
TX_ID_2 = "7000002"
ENTITY_ID_2 = "C8000" # Suspicious, to trigger RUN_AGENT

payload_2 = {
  "TransactionID": TX_ID_2,
  "TransactionDT": 86400,
  "TransactionAmt": 9999.0, # High amount
  "ProductCD": "W",
  "card1": 13926,
  "customer_id": CUST_ID,
  "entity_id": ENTITY_ID_2
}

print(f"\nSending TX 2 to trigger RUN_AGENT: {TX_ID_2}")
r2 = requests.post(API_URL, json=payload_2)
print("TX 2 Status:", r2.status_code)
print("JSON:", json.dumps(r2.json(), indent=2))

print("\n--- DB AUDIT TRACE for TX 2 ---")
queries = [
    f"SELECT state, agent_recommendation FROM investigations WHERE transaction_id='{TX_ID_2}'",
    f"SELECT tool_calls FROM investigations WHERE transaction_id='{TX_ID_2}'",
    f"SELECT reason_codes FROM investigations WHERE transaction_id='{TX_ID_2}'",
    f"SELECT evidence FROM investigations WHERE transaction_id='{TX_ID_2}'",
]
for q in queries:
    res = subprocess.run(["psql", DB_URL, "-t", "-c", q], capture_output=True, text=True)
    print(res.stdout.strip())
