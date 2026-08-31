import requests
import json

API_URL = "http://localhost:8000/api/v1/transactions/process"
HEALTH_URL = "http://localhost:8000/health"

base_payload = {
  "TransactionID": "2987001",
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
  "customer_id": "CUST_2987001",
  "entity_id": "ENT_2987001"
}

def print_res(name, r):
    print(f"\n--- {name} ---")
    print("Status:", r.status_code)
    try:
        print("JSON:", json.dumps(r.json(), indent=2))
    except:
        print("Text:", r.text)

# Case A
pA = dict(base_payload)
del pA["TransactionID"]
pA["customer_id"] = "CUST_A"
rA = requests.post(API_URL, json=pA)
print_res("CASE A - Missing TransactionID", rA)

# Case B
pB = dict(base_payload)
pB["TransactionID"] = "TX_B"
del pB["TransactionAmt"]
rB = requests.post(API_URL, json=pB)
print_res("CASE B - Missing required feature", rB)

# Case C
pC = dict(base_payload)
pC["TransactionID"] = "TX_C"
pC["TransactionAmt"] = "INVALID_AMOUNT"
rC = requests.post(API_URL, json=pC)
print_res("CASE C - Invalid datatype", rC)

# Case D
rD = requests.post(API_URL, data='{"TransactionID": "TX_D", "TransactionAmt": 50', headers={"Content-Type": "application/json"})
print_res("CASE D - Malformed JSON", rD)

# Case E
pE = dict(base_payload)
pE["TransactionID"] = "TX_E"
pE["isFraud"] = 1
rE = requests.post(API_URL, json=pE)
print_res("CASE E - isFraud supplied", rE)

# Case F
rF = requests.post(API_URL, json={})
print_res("CASE F - Empty request", rF)

# Health
rH = requests.get(HEALTH_URL)
print_res("HEALTH", rH)

