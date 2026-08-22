import logging
from typing import List, Dict, Optional
from app.audit.schemas import AuditEvent

class AuditService:
    """
    Append-only audit trail service.
    In a real system, this writes to the `audit_events` Postgres table.
    For this prototype MVP execution environment, we mock an in-memory store.
    """
    
    _store: Dict[str, List[AuditEvent]] = {}

    @classmethod
    def record_event(cls, event: AuditEvent):
        """Append an event to the immutable audit log."""
        try:
            if event.transaction_id not in cls._store:
                cls._store[event.transaction_id] = []
            
            # Ensure no chain-of-thought is passed in the payload
            if "chain_of_thought" in event.payload or "internal_reasoning" in event.payload:
                raise ValueError("Security violation: LLM chain-of-thought cannot be committed to audit.")
                
            cls._store[event.transaction_id].append(event)
            logging.info(f"AUDIT [{event.event_type}]: TX {event.transaction_id} by {event.component}")
        except Exception as e:
            # Audit failure behavior: Do not fabricate success
            logging.error(f"CRITICAL: Failed to persist audit event for {event.transaction_id}: {str(e)}")
            # In a production system, this might push to a dead-letter queue or alert on-call
            
    @classmethod
    def get_transaction_timeline(cls, transaction_id: str) -> List[AuditEvent]:
        """Retrieve chronological events for a specific transaction."""
        events = cls._store.get(transaction_id, [])
        return sorted(events, key=lambda x: x.timestamp)

    @classmethod
    def query_events(
        cls, 
        transaction_id: Optional[str] = None, 
        decision: Optional[str] = None,
        reason_code: Optional[str] = None,
        is_synthetic: Optional[bool] = None,
        limit: int = 50, 
        offset: int = 0
    ) -> List[AuditEvent]:
        """Audit Explorer search with filtering and pagination."""
        all_events = []
        for tx_events in cls._store.values():
            all_events.extend(tx_events)
            
        # Sort chronologically descending for explorer
        all_events.sort(key=lambda x: x.timestamp, reverse=True)
        
        filtered = []
        for ev in all_events:
            # 1. Filter by transaction_id
            if transaction_id and transaction_id not in ev.transaction_id:
                continue
                
            # 2. Filter by Decision (FINAL_DECISION_CREATED event payload)
            if decision:
                if ev.event_type != "FINAL_DECISION_CREATED":
                    continue
                if ev.payload.get("decision") != decision:
                    continue
                    
            # 3. Filter by Reason Code
            if reason_code:
                if ev.event_type not in ["AGENT_RECOMMENDATION_CREATED", "FINAL_DECISION_CREATED"]:
                    continue
                if reason_code not in ev.payload.get("reason_codes", []) and reason_code not in ev.payload.get("triggered_rules", []):
                    continue
                    
            # 4. Filter by Synthetic (TRANSACTION_RECEIVED event)
            if is_synthetic is not None:
                if ev.event_type != "TRANSACTION_RECEIVED":
                    continue
                if ev.payload.get("is_synthetic", False) != is_synthetic:
                    continue
                    
            filtered.append(ev)
            
        return filtered[offset : offset + limit]
