import sys
sys.path.insert(0, '/app')
from app.risk.inference import RiskModelService

service = RiskModelService.get_instance()
print("RiskModelService loaded.")

# Try some predefined high-risk patterns or loop over some values
import pandas as pd
payload = {
    "TransactionAmt": 5000.0,
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
}

for i in range(1, 10):
    payload["TransactionAmt"] = i * 1000.0
    res = service.score(payload)
    print(f"Amt {payload['TransactionAmt']}: {res}")
