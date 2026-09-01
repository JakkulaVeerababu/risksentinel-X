import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from app.audit.schemas import AuditEvent
from app.models.domain import AuditEventModel

class AuditService:
    """
    Append-only audit trail service.
    Writes to the `audit_events` Postgres/SQLite table using SQLAlchemy.
    """
    
    @classmethod
    def record_event(cls, db: Session, event: AuditEvent):
        """Append an event to the persisted audit trail."""
        try:
            # Ensure no chain-of-thought is passed in the payload
            if "chain_of_thought" in event.input_summary or "internal_reasoning" in event.input_summary:
                raise ValueError("Security violation: LLM chain-of-thought cannot be committed to audit.")
            if "chain_of_thought" in event.output_summary or "internal_reasoning" in event.output_summary:
                raise ValueError("Security violation: LLM chain-of-thought cannot be committed to audit.")
                
            payload = {
                "event_id": event.event_id,
                "actor": event.actor,
                "input_summary": event.input_summary,
                "output_summary": event.output_summary,
                "model_version": event.model_version,
                "policy_version": event.policy_version,
                "latency": event.latency,
                "status": event.status
            }
            
            db_event = AuditEventModel(
                transaction_id=event.resource_id,
                timestamp=event.timestamp,
                event_type=event.event_type,
                component=event.service,
                payload=payload
            )
            db.add(db_event)
            db.commit()
            logging.info(f"AUDIT [{event.event_type}]: TX {event.resource_id} by {event.service}")
        except Exception as e:
            # Audit failure behavior: Do not fabricate success
            db.rollback()
            logging.error(f"CRITICAL: Failed to persist audit event for {event.resource_id}: {str(e)}")
            
    @classmethod
    def _map_to_schema(cls, e: AuditEventModel) -> AuditEvent:
        from datetime import timezone
        payload = e.payload or e.details or {}
        # Ensure timestamp is timezone-aware so it serializes with +00:00/Z
        aware_timestamp = e.timestamp.replace(tzinfo=timezone.utc) if e.timestamp else None
        
        return AuditEvent(
            event_id=payload.get("event_id", f"migrated-{e.id}"),
            timestamp=aware_timestamp,
            actor=payload.get("actor", "SYSTEM"),
            service=e.component or "SYSTEM",
            event_type=e.event_type,
            resource_id=e.transaction_id,
            input_summary=payload.get("input_summary", payload), # Fallback to full payload for legacy events
            output_summary=payload.get("output_summary", payload if not e.payload else {}),
            model_version=payload.get("model_version"),
            policy_version=payload.get("policy_version"),
            latency=payload.get("latency"),
            status=payload.get("status", "SUCCESS")
        )
            
    @classmethod
    def get_transaction_timeline(cls, db: Session, transaction_id: str) -> List[AuditEvent]:
        """Retrieve chronological events for a specific transaction."""
        db_events = db.query(AuditEventModel).filter(AuditEventModel.transaction_id == transaction_id).order_by(AuditEventModel.timestamp.asc()).all()
        return [cls._map_to_schema(e) for e in db_events]

    @classmethod
    def query_events(
        cls, 
        db: Session,
        transaction_id: Optional[str] = None, 
        decision: Optional[str] = None,
        reason_code: Optional[str] = None,
        is_synthetic: Optional[bool] = None,
        limit: int = 50, 
        offset: int = 0
    ) -> List[AuditEvent]:
        """Audit Explorer search with filtering and pagination."""
        query = db.query(AuditEventModel).order_by(AuditEventModel.timestamp.desc())
        
        if transaction_id:
            query = query.filter(AuditEventModel.transaction_id == transaction_id)
            
        db_events = query.all()
        
        filtered = []
        for e in db_events:
            ev = cls._map_to_schema(e)
            
            # Application-level filtering for JSON payloads for cross-database compatibility (SQLite/Postgres)
            if decision:
                if ev.event_type != "FINAL_DECISION_CREATED":
                    continue
                if ev.output_summary.get("decision") != decision and e.payload.get("decision") != decision:
                    continue
                    
            if reason_code:
                if ev.event_type not in ["AGENT_RECOMMENDATION_CREATED", "FINAL_DECISION_CREATED"]:
                    continue
                rcs = ev.output_summary.get("reason_codes", []) + ev.output_summary.get("triggered_rules", [])
                legacy_rcs = e.payload.get("reason_codes", []) + e.payload.get("triggered_rules", [])
                if reason_code not in rcs and reason_code not in legacy_rcs:
                    continue
                    
            if is_synthetic is not None:
                if ev.event_type != "TRANSACTION_RECEIVED":
                    continue
                is_syn = ev.input_summary.get("is_synthetic", False)
                if not is_syn and "is_synthetic" in e.payload:
                    is_syn = e.payload.get("is_synthetic", False)
                if is_syn != is_synthetic:
                    continue
                    
            filtered.append(ev)
            
        return filtered[offset : offset + limit]
