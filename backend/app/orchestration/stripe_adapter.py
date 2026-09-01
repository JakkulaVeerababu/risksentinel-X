import time
import logging
from typing import Dict, Any, Optional

from app.orchestration.schemas import ProcessTransactionRequest

class StripeAdapter:
    """
    Adapter to map raw Stripe Webhook Events into RiskSentinel's ProcessTransactionRequest.
    """
    
    @staticmethod
    def map_stripe_event(event: Dict[str, Any]) -> ProcessTransactionRequest:
        """
        Extracts relevant fields from a Stripe event (e.g., payment_intent.succeeded)
        and builds a RiskSentinel request. It explicitly sets skip_ml=True since
        Stripe does not provide the hundreds of features required by the IEEE-CIS model.
        """
        event_type = event.get("type")
        data = event.get("data", {}).get("object", {})
        
        # Depending on event type, extract amount and customer differently
        amount = 0.0
        customer_id = "unknown"
        tx_id = data.get("id", f"stripe_{int(time.time())}")
        
        if event_type == "payment_intent.succeeded":
            amount = data.get("amount", 0) / 100.0  # Stripe amounts are in cents
            customer_id = data.get("customer") or data.get("receipt_email") or "stripe_anon"
        elif event_type == "charge.succeeded":
            amount = data.get("amount", 0) / 100.0
            customer_id = data.get("customer") or data.get("receipt_email") or "stripe_anon"
        else:
            logging.warning(f"Unhandled Stripe event type for mapping: {event_type}")
            
        # We must populate mandatory ScoreRequest fields with defaults even if skipping ML
        # because the Pydantic schema requires them.
        return ProcessTransactionRequest(
            TransactionID=tx_id,
            TransactionDT=time.time(),
            TransactionAmt=amount,
            ProductCD="W", # Web
            customer_id=customer_id,
            entity_id=customer_id, # For graph mapping
            skip_ml=True  # CRITICAL: Do not invent IEEE-CIS features!
        )
