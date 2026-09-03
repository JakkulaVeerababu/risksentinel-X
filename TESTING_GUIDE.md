# RiskSentinel X - Live Testing Guide

Welcome to RiskSentinel X! If you are evaluating or testing this project, follow these steps to simulate real-time transactions and see our Agentic AI Pipeline in action.

You do **NOT** need to run the project locally to test it. You can send test data directly to our live production backend and watch it appear on the live dashboard.

---

## Step 1: Open the Live Dashboard

Before you start testing, open the live dashboard so you can watch your transactions appear in real-time:
**[Open RiskSentinel X Dashboard](https://risksentinel-x.vercel.app/dashboard)**

---

## Step 2: Send a Test Transaction

You can send a transaction using either **cURL** (Mac/Linux) or **PowerShell** (Windows). Open your terminal and copy-paste one of the commands below.

> **Note:** The Render free-tier backend may take 30–60 seconds to cold-start on the first request. If it times out, wait a moment and retry.

---

### Scenario A: Legitimate Transaction (Expected: ALLOW)
This simulates a normal, low-risk transaction with a trusted device footprint and a small amount.
The ML score will be LOW, the Investigation Agent will be **skipped** to avoid unnecessary LLM cost, and the Policy Engine will issue an **ALLOW** decision.

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "https://risksentinel-backend.onrender.com/api/v1/transactions/process" -Method Post -ContentType "application/json" -Body '{
    "TransactionID": "TX-LEGIT-100",
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
    "TransactionID": "TX-LEGIT-100",
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

### Scenario B: High-Risk Fraudulent Transaction (Expected: BLOCK or REVIEW)
This simulates a suspicious transaction — high amount, anonymous email domain, shared VPN IP, and unknown device.
The ML score will be HIGH, Graph Intelligence will detect suspicious connections, the **Gemini AI Agent will activate** and perform a Structured RAG investigation, and the Policy Engine will issue a **BLOCK or REVIEW** decision.

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "https://risksentinel-backend.onrender.com/api/v1/transactions/process" -Method Post -ContentType "application/json" -Body '{
    "TransactionID": "TX-FRAUD-101",
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
    "TransactionID": "TX-FRAUD-101",
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

## Step 3: Verify the Results

1. Refresh the Live Dashboard.
2. Click on the **"24H"** dropdown and change it to **"All Time"** if needed.
3. You will instantly see the metrics update — analysed count, blocked count, and financial exposure.
4. Scroll down to the **Recent Transactions** table.
5. Click on the `TransactionID` you just sent (e.g., `TX-FRAUD-101`) to open the **Investigation AI Case**.
6. Witness the **Gemini AI Agent** provide a detailed, evidence-backed explanation of exactly *why* it allowed or blocked your transaction, including reason codes, confidence score, and a full audit timeline.

Happy Testing!
