import requests
import json
import time

API_URL = "http://localhost:8000/api/v1"

payload = {
  "TransactionID": "2987000",
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
  "customer_id": "CUST_2987000",
  "entity_id": "ENT_2987000"
}

t0 = time.time()
r = requests.post(f"{API_URL}/transactions/process", json=payload)
t1 = time.time()

print("Status Code:", r.status_code)
try:
    print("Response JSON:")
    print(json.dumps(r.json(), indent=2))
except Exception as e:
    print("Response Text:", r.text)

print(f"Latency: {(t1 - t0)*1000:.2f}ms")
