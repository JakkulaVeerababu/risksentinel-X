import logging
import hashlib
import json
from sqlalchemy.orm import Session
from app.policy.schemas import PolicyInput, PolicyDecisionResult
from app.policy.engine import PolicyEngine
from app.policy.config import POLICY_VERSION
from app.models.domain import InvestigationModel, RiskScoreModel, DecisionModel, AuditEventModel

class PolicyService:
    def __init__(self, db: Session):
        self.db = db
        self.engine = PolicyEngine()
        
    def _compute_fingerprint(self, inputs: PolicyInput) -> str:
        # Canonical representation
        data = inputs.model_dump()
        data["POLICY_VERSION"] = POLICY_VERSION
        canon = json.dumps(data, sort_keys=True)
        return hashlib.sha256(canon.encode("utf-8")).hexdigest()
        
    def evaluate_decision(self, transaction_id: str) -> PolicyDecisionResult:
        logging.info(f"PolicyService: Building context for {transaction_id}")
        
        # 1. Fetch Upstream Data
        risk_score = self.db.query(RiskScoreModel).filter_by(transaction_id=transaction_id).first()
        if not risk_score:
            raise ValueError("RISK_EVIDENCE_NOT_AVAILABLE")
            
        investigation = self.db.query(InvestigationModel).filter_by(transaction_id=transaction_id).first()
        
        # Determine Agent State
        if not investigation:
            agent_state = "SKIPPED"
            agent_rec = None
            agent_conf = None
            agent_reasons = None
            agent_evidence = None
        else:
            agent_state = investigation.agent_state
            agent_rec = investigation.recommendation
            agent_conf = investigation.confidence
            agent_reasons = investigation.reason_codes
            agent_evidence = investigation.evidence
            
        # 2. Build Policy Input
        inputs = PolicyInput(
            transaction_id=transaction_id,
            ml_score=risk_score.ml_score,
            ml_model_version=risk_score.model_version,
            graph_score=risk_score.graph_score,
            graph_version=None,
            agent_state=agent_state,
            agent_recommendation=agent_rec,
            agent_confidence=agent_conf,
            agent_reason_codes=agent_reasons,
            validated_agent_evidence=agent_evidence
        )
        
        # 3. Idempotency Check
        fingerprint = self._compute_fingerprint(inputs)
        existing_decision = self.db.query(DecisionModel).filter_by(
            transaction_id=transaction_id,
            input_fingerprint=fingerprint
        ).first()
        
        if existing_decision:
            logging.info(f"PolicyService: Returning idempotent decision for {transaction_id}")
            return PolicyDecisionResult(
                final_decision=existing_decision.decision,
                policy_version=existing_decision.policy_version,
                matched_rule_ids=existing_decision.matched_rules.get("matched_rule_ids", []),
                reason_codes=existing_decision.matched_rules.get("reason_codes", []),
                ml_score=inputs.ml_score,
                graph_score=inputs.graph_score,
                agent_state=inputs.agent_state,
                agent_recommendation=inputs.agent_recommendation,
                agent_confidence=inputs.agent_confidence,
                timestamp=existing_decision.timestamp.isoformat() if existing_decision.timestamp else ""
            )
            
        # 4. Evaluate
        decision_result = self.engine.evaluate(inputs)
        
        # 5. Persist DecisionModel
        new_decision = DecisionModel(
            transaction_id=transaction_id,
            decision=decision_result.final_decision,
            reason=",".join(decision_result.reason_codes),
            policy_version=POLICY_VERSION,
            input_fingerprint=fingerprint,
            matched_rules={
                "matched_rule_ids": decision_result.matched_rule_ids,
                "reason_codes": decision_result.reason_codes
            }
        )
        self.db.add(new_decision)
        
        # 6. Audit Logging
        audit_details = decision_result.model_dump()
        audit_details["ml_model_version"] = inputs.ml_model_version
        audit_event = AuditEventModel(
            transaction_id=transaction_id,
            event_type="POLICY_DECISION",
            details=audit_details,
            component="PolicyService"
        )
        self.db.add(audit_event)
        
        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            logging.error(f"Failed to persist DecisionModel: {e}")
            raise RuntimeError("DATABASE_FAILURE")
            
        return decision_result
