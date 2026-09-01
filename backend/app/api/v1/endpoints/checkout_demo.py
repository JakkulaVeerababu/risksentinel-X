import random
import uuid
import time
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.orchestration.schemas import ProcessTransactionRequest
from app.orchestration.service import RiskOrchestrator

router = APIRouter()

class CheckoutTelemetryRequest(BaseModel):
    amount: float
    currency: str = "usd"
    ip_address: str
    device_fingerprint: str
    user_agent: str

@router.post("/process")
def process_live_checkout(
    payload: CheckoutTelemetryRequest,
    db: Session = Depends(get_db)
):
    """
    Accepts live telemetry from the frontend checkout demo, merges it with 
    a standard transaction schema, and runs the full RiskSentinel pipeline.
    """
    transaction_id = f"LIVE-TX-{str(uuid.uuid4())[:8].upper()}"
    # Create a deterministic customer ID based on their IP to show graph linking 
    # if they hit it multiple times!
    customer_id = f"LIVE-CUST-{payload.ip_address.replace('.', '')[:6]}"
    
    request = ProcessTransactionRequest(
        TransactionID=transaction_id,
        TransactionDT=int(time.time()),
        TransactionAmt=payload.amount,
        ProductCD="W",
        card1=random.randint(1000, 19999),
        card2=random.randint(100, 999),
        card3=150.0,
        card4="visa",
        card5=226.0,
        card6="credit",
        addr1=315.0,
        addr2=87.0,
        dist1=None,
        P_emaildomain="gmail.com",
        DeviceType="mobile" if "Mobile" in payload.user_agent else "desktop",
        DeviceInfo=payload.device_fingerprint,
        is_fraud=0,
        customer_id=customer_id,
        ip_address=payload.ip_address
    )
    
    orchestrator = RiskOrchestrator(db)
    # The orchestrator is synchronous and returns the final decision in real-time
    result = orchestrator.process_transaction(request)
    return result
