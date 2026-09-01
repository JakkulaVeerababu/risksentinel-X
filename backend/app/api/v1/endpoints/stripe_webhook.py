import os
import stripe
import logging
from fastapi import APIRouter, Header, Request, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.models.domain import StripeEventModel
from app.orchestration.stripe_adapter import StripeAdapter
from app.orchestration.service import RiskOrchestrator

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_API_KEY", "sk_test_dummy")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

def process_stripe_event_async(event: dict, db: Session):
    """
    Background task to process the Stripe event through the RiskOrchestrator.
    """
    event_id = event.get("id")
    try:
        # Update status to PROCESSING
        db_event = db.query(StripeEventModel).filter_by(stripe_event_id=event_id).first()
        if db_event:
            db_event.status = "PROCESSING"
            db.commit()

        # Map to RiskSentinel Schema
        request = StripeAdapter.map_stripe_event(event)
        
        # Process through orchestrator
        orchestrator = RiskOrchestrator(db)
        orchestrator.process_transaction(request)
        
        # Mark COMPLETED
        if db_event:
            db_event.status = "COMPLETED"
            db.commit()
            
    except Exception as e:
        logging.error(f"Failed to process Stripe event {event_id}: {e}")
        db_event = db.query(StripeEventModel).filter_by(stripe_event_id=event_id).first()
        if db_event:
            db_event.status = "FAILED"
            db.commit()

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    stripe_signature: str = Header(None),
    db: Session = Depends(get_db)
):
    if not WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="STRIPE_WEBHOOK_SECRET is not configured.")

    payload = await request.body()

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_id = event.get("id")
    
    # Idempotency check: Have we seen this event?
    try:
        db_event = StripeEventModel(
            stripe_event_id=event_id,
            payload=event,
            status="RECEIVED"
        )
        db.add(db_event)
        db.commit()
    except IntegrityError:
        db.rollback()
        # Event already exists (Stripe retry or duplicate delivery)
        # We just acknowledge it so Stripe stops retrying.
        logging.info(f"Stripe event {event_id} already exists. Ignoring duplicate.")
        return {"status": "success", "message": "Duplicate ignored"}

    # Dispatch to background task to process asynchronously
    background_tasks.add_task(process_stripe_event_async, event, db)

    # Return 200 immediately to Stripe
    return {"status": "success"}
