import requests
import json
import time
import concurrent.futures
import subprocess

API_URL = "http://localhost:8000/api/v1/transactions/process"
DB_URL = "postgresql://postgres.etvyleucuuzuuhkzwwgs:2005THEFLASH9ZZ%40a@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

TX_ID = "2987002"

base_payload = {
  "TransactionID": TX_ID,
  "TransactionDT": 86400,
  "TransactionAmt": 68.5,
  "ProductCD": "W",
  "card1": 13926,
  "card2": None,
  "card3": 150.0,
  "card4": "discover",
  "card5": 142.0,
  "card6": "credit",
  "addr1": 315.0,
  "addr2": 87.0,
  "P_emaildomain": None,
  "R_emaildomain": None,
  "DeviceType": None,
  "DeviceInfo": None,
  "dist1": 19.0,
  "dist2": None,
  "C1": 1.0,
  "C2": 1.0,
  "C3": 0.0,
  "C4": 0.0,
  "C5": 0.0,
  "C6": 1.0,
  "C7": 0.0,
  "C8": 0.0,
  "C9": 1.0,
  "C10": 0.0,
  "C11": 2.0,
  "C12": 0.0,
  "C13": 1.0,
  "C14": 1.0,
  "D1": 14.0,
  "D2": None,
  "D3": 13.0,
  "D4": None,
  "D5": None,
  "D10": 13.0,
  "D11": 13.0,
  "D15": 0.0,
  "customer_id": f"CUST_{TX_ID}",
  "entity_id": f"ENT_{TX_ID}"
}

def print_res(name, r):
    print(f"\n--- {name} ---")
    print("Status:", r.status_code)
    try:
        print("JSON:", json.dumps(r.json(), indent=2))
    except:
        print("Text:", r.text)

def check_db_counts(tx_id):
    queries = [
        f"SELECT count(*) FROM transactions WHERE transaction_id='{tx_id}'",
        f"SELECT count(*) FROM risk_scores WHERE transaction_id='{tx_id}'",
        f"SELECT count(*) FROM investigations WHERE transaction_id='{tx_id}'",
        f"SELECT count(*) FROM decisions WHERE transaction_id='{tx_id}'",
        f"SELECT count(*) FROM audit_events WHERE transaction_id='{tx_id}'",
    ]
    
    counts = []
    for q in queries:
        res = subprocess.run(["psql", DB_URL, "-t", "-c", q], capture_output=True, text=True)
        counts.append(res.stdout.strip())
        
    print(f"\nDB COUNTS for {tx_id}:")
    print(f"Transactions: {counts[0]}")
    print(f"Risk Scores: {counts[1]}")
    print(f"Investigations: {counts[2]}")
    print(f"Decisions: {counts[3]}")
    print(f"Audit Events: {counts[4]}")
    return counts

# CASE A: First Request
print("Running CASE A...")
rA = requests.post(API_URL, json=base_payload)
print_res("CASE A", rA)
check_db_counts(TX_ID)

# CASE B: Exact same request
print("Running CASE B...")
rB = requests.post(API_URL, json=base_payload)
print_res("CASE B", rB)
check_db_counts(TX_ID)

# CASE C: Same ID + changed payload
print("Running CASE C...")
pC = dict(base_payload)
pC["TransactionAmt"] = 999.99
rC = requests.post(API_URL, json=pC)
print_res("CASE C", rC)
check_db_counts(TX_ID)

# CASE D: Concurrent duplicate
print("Running CASE D (using new ID 2987003)...")
TX_ID_D = "2987003"
pD = dict(base_payload)
pD["TransactionID"] = TX_ID_D
pD["customer_id"] = f"CUST_{TX_ID_D}"
pD["entity_id"] = f"ENT_{TX_ID_D}"

def send_req():
    return requests.post(API_URL, json=pD)

with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
    futures = [executor.submit(send_req), executor.submit(send_req)]
    for i, f in enumerate(concurrent.futures.as_completed(futures)):
        rD = f.result()
        print_res(f"CASE D - Request {i+1}", rD)

check_db_counts(TX_ID_D)

