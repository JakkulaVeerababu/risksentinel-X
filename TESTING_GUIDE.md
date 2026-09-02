# 🧪 RiskSentinel X - Live Testing Guide

Welcome to RiskSentinel X! If you are evaluating or testing this project for the hackathon, follow these steps to simulate real-time transactions and see our 4-Stage AI Pipeline in action.

You do **NOT** need to run the project locally to test it. You can send test data directly to our live production backend and watch it appear on the live dashboard.

---

## 🖥️ Step 1: Open the Live Dashboard

Before you start testing, open the live dashboard so you can watch your transactions appear in real-time:
👉 **[Open RiskSentinel X Dashboard](https://risksentinel-x.vercel.app/dashboard)**

---

## 🚀 Step 2: Send a Test Transaction

You can send a transaction using either **cURL** (Mac/Linux) or **PowerShell** (Windows). Open your terminal and copy-paste one of the commands below.

### 🟢 Scenario A: Legitimate Transaction (Should be ALLOWED)
This simulates a normal transaction with a low amount and trusted device footprint.

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "https://risksentinel-backend.onrender.com/api/v1/transactions/process" -Method Post -ContentType "application/json" -Body '{
    "TransactionID": "tx_legit_001",
    "TransactionDT": 86400,
    "TransactionAmt": 25.50,
    "ProductCD": "W",
    "customer_id": "CUST-SAFE-01",
    "entity_id": "IP-HOME",
    "DeviceType": "desktop",
    "DeviceInfo": "Windows",
    "P_emaildomain": "gmail.com",
    "card4": "visa",
    "card6": "debit",
    "dist1": 5.0,
    "C1": 1.0,
    "C2": 1.0
}'
```

**Mac/Linux (cURL):**
```bash
curl --request POST \
  --url "https://risksentinel-backend.onrender.com/api/v1/transactions/process" \
  --header "Content-Type: application/json" \
  --data '{
    "TransactionID": "tx_legit_001",
    "TransactionDT": 86400,
    "TransactionAmt": 25.50,
    "ProductCD": "W",
    "customer_id": "CUST-SAFE-01",
    "entity_id": "IP-HOME",
    "DeviceType": "desktop",
    "DeviceInfo": "Windows",
    "P_emaildomain": "gmail.com",
    "card4": "visa",
    "card6": "debit",
    "dist1": 5.0,
    "C1": 1.0,
    "C2": 1.0
}'
```

---

### 🔴 Scenario B: High-Risk Fraudulent Transaction (Should be BLOCKED or REVIEWED)
This simulates a suspicious transaction with a high amount, an anonymous email domain, and a shared suspicious IP address.

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "https://risksentinel-backend.onrender.com/api/v1/transactions/process" -Method Post -ContentType "application/json" -Body '{
    "TransactionID": "tx_fraud_001",
    "TransactionDT": 86400,
    "TransactionAmt": 8500.00,
    "ProductCD": "C",
    "customer_id": "CUST-SUS-99",
    "entity_id": "IP-SHARED-VPN",
    "DeviceType": "mobile",
    "DeviceInfo": "Unknown Device",
    "P_emaildomain": "anonymous.com",
    "card4": "mastercard",
    "card6": "credit",
    "dist1": 500.0,
    "C1": 15.0,
    "C2": 25.0
}'
```

**Mac/Linux (cURL):**
```bash
curl --request POST \
  --url "https://risksentinel-backend.onrender.com/api/v1/transactions/process" \
  --header "Content-Type: application/json" \
  --data '{
    "TransactionID": "tx_fraud_001",
    "TransactionDT": 86400,
    "TransactionAmt": 8500.00,
    "ProductCD": "C",
    "customer_id": "CUST-SUS-99",
    "entity_id": "IP-SHARED-VPN",
    "DeviceType": "mobile",
    "DeviceInfo": "Unknown Device",
    "P_emaildomain": "anonymous.com",
    "card4": "mastercard",
    "card6": "credit",
    "dist1": 500.0,
    "C1": 15.0,
    "C2": 25.0
}'
```

---

## 📊 Step 3: Verify the Results
1. Refresh the Live Dashboard.
2. Click on the **"24H"** dropdown and change it to **"All Time"** if needed.
3. You will instantly see the metrics update.
4. Scroll down to the **Recent Transactions** table.
5. Click on the `TransactionID` you just sent (e.g., `tx_fraud_001`) to open the **Investigation AI Case**.
6. Witness the **Gemini AI Agent** provide a detailed explanation of exactly *why* it allowed or blocked your transaction!

Happy Testing! 🛡️
