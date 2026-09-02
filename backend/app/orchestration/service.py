import logging
import time
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from app.orchestration.schemas import ProcessTransactionRequest, OrchestrationResponse, OrchestrationErrorResponse, ErrorDetail
from app.orchestration.lifecycle import LifecycleState
from app.models.domain import TransactionModel, RiskScoreModel, InvestigationModel, DecisionModel
from app.risk.inference import RiskModelService, ModelArtifactError
from app.graph.service import GraphRiskService
from app.agent.gate import InvestigationGate
from app.agent.service import InvestigationService
from app.agent.schemas import InvestigationRequest
from app.policy.service import PolicyService
from app.audit.service import AuditService
from app.audit.schemas import AuditEvent

class RiskOrchestrator:
    def __init__(self, db: Session):
        self.db = db
        self.ml_service = RiskModelService.get_instance()
        self.graph_service = GraphRiskService.get_instance()
        self.agent_service = InvestigationService()
        self.policy_service = PolicyService(self.db)
        
    def _record_audit(self, transaction_id: str, event_type: str, payload: dict, latency: float = None):
        event = AuditEvent(
            service="RiskOrchestrator",
            event_type=event_type,
            resource_id=transaction_id,
            input_summary=payload,
            status="SUCCESS",
            latency=latency
        )
        AuditService.record_event(self.db, event)
        
    def _update_status(self, transaction: TransactionModel, status: LifecycleState):
        transaction.status = status.value
        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            logging.error(f"Failed to update status to {status.value}: {e}")

    def process_transaction(self, request: ProcessTransactionRequest) -> OrchestrationResponse | OrchestrationErrorResponse:
        total_start = time.perf_counter()
        transaction_id = request.TransactionID
        
        # 1. TRANSACTION_RECEIVED
        self._record_audit(transaction_id, "TRANSACTION_RECEIVED", request.model_dump())
        
        # 2. TRANSACTION_PERSISTED
        # Check idempotency/conflict
        existing_tx = self.db.query(TransactionModel).filter_by(transaction_id=transaction_id).first()
        if existing_tx:
            # Simple conflict check: if the amount differs, it's a conflict
            if existing_tx.amount != request.TransactionAmt:
                return OrchestrationErrorResponse(
                    transaction_id=transaction_id,
                    status=LifecycleState.FAILED.value,
                    failed_stage="PERSISTENCE",
                    error=ErrorDetail(code="409", message="Conflict: TransactionID exists with different data")
                )
            
            # If we already have a decision, return it idempotently
            decision = self.db.query(DecisionModel).filter_by(transaction_id=transaction_id).order_by(DecisionModel.id.desc()).first()
            if decision:
                risk_score = self.db.query(RiskScoreModel).filter_by(transaction_id=transaction_id).first()
                inv = self.db.query(InvestigationModel).filter_by(transaction_id=transaction_id).first()
                
                # Format to match normal response exactly
                ml_info = {"score": risk_score.ml_score, "model_version": risk_score.model_version} if risk_score else {}
                graph_info = {"score": risk_score.graph_score if risk_score is not None else None, "community_id": None, "signals": {}}
                
                if inv:
                    agent_info = {"state": inv.agent_state, "recommendation": inv.recommendation, "confidence": inv.confidence}
                else:
                    agent_info = {"state": "SKIPPED", "recommendation": "ALLOW", "confidence": 1.0}
                    
                matched_rules = decision.matched_rules if decision.matched_rules else []
                if isinstance(matched_rules, dict) and "matched_rule_ids" in matched_rules:
                    # Depending on how it's saved in DB vs schema
                    pass

                return OrchestrationResponse(
                    transaction_id=transaction_id,
                    status=LifecycleState.DECIDED.value,
                    ml=ml_info,
                    graph=graph_info,
                    agent=agent_info,
                    policy={"decision": decision.decision, "policy_version": decision.policy_version, "matched_rules": matched_rules}
                )
            # If we don't have a decision, we continue partial retry
            tx = existing_tx
        else:
            tx = TransactionModel(
                transaction_id=transaction_id,
                amount=request.TransactionAmt,
                customer_id=request.customer_id,
                status=LifecycleState.PERSISTED.value
            )
            self.db.add(tx)
            try:
                self.db.commit()
                self._record_audit(transaction_id, "TRANSACTION_PERSISTED", {"amount": tx.amount})
            except IntegrityError:
                self.db.rollback()
                return OrchestrationErrorResponse(
                    transaction_id=transaction_id,
                    status=LifecycleState.FAILED.value,
                    failed_stage="DATABASE",
                    error=ErrorDetail(code="409", message="Concurrency error on persist")
                )
            except Exception as e:
                self.db.rollback()
                return OrchestrationErrorResponse(
                    transaction_id=transaction_id,
                    status=LifecycleState.FAILED.value,
                    failed_stage="DATABASE",
                    error=ErrorDetail(code="500", message=str(e))
                )

        # 3. REAL XGBOOST SCORE
        ml_start = time.perf_counter()
        if getattr(request, 'skip_ml', False):
            ml_score = None
            ml_version = "UNAVAILABLE_FOR_STRIPE_SCHEMA"
            ml_latency = (time.perf_counter() - ml_start) * 1000
            tx.ml_risk_score = None
            self._update_status(tx, LifecycleState.SCORED)
            self._record_audit(transaction_id, "ML_SKIPPED", {"reason": ml_version}, latency=ml_latency)
        else:
            try:
                ml_score = self.ml_service.score(request.model_dump())
                ml_version = self.ml_service.version
                ml_latency = (time.perf_counter() - ml_start) * 1000
                
                tx.ml_risk_score = ml_score
                self._update_status(tx, LifecycleState.SCORED)
                self._record_audit(transaction_id, "ML_SCORED", {"ml_score": ml_score, "model_version": ml_version}, latency=ml_latency)
                
            except Exception as e:
                logging.error(f"ML Service Failed: {e}")
                self._update_status(tx, LifecycleState.DEGRADED)
                return OrchestrationErrorResponse(
                    transaction_id=transaction_id,
                    status=LifecycleState.DEGRADED.value,
                    failed_stage="ML",
                    error=ErrorDetail(code="503", message="ML Service unavailable")
                )
            
        # 4. REAL GRAPH ANALYSIS
        graph_start = time.perf_counter()
        entity_id = request.entity_id or request.customer_id or request.TransactionID
        try:
            graph_result = self.graph_service.check_entity(entity_id)
            graph_score = graph_result["graph_risk"]
            graph_latency = (time.perf_counter() - graph_start) * 1000
            
            tx.graph_risk_score = graph_score
            self._update_status(tx, LifecycleState.GRAPH_CHECKED)
            self._record_audit(transaction_id, "GRAPH_CHECKED", {"graph_score": graph_score, "community_id": graph_result.get("community_id")}, latency=graph_latency)
            
        except Exception as e:
            logging.error(f"Graph Service Failed: {e}")
            # Degraded Graph MVP behavior: explicitly missing evidence
            graph_score = None
            graph_result = {}
            graph_latency = (time.perf_counter() - graph_start) * 1000
            self._update_status(tx, LifecycleState.DEGRADED)
            self._record_audit(transaction_id, "GRAPH_DEGRADED", {"error": str(e)}, latency=graph_latency)
            
        # 5. PERSIST RISK SCORES
        risk_score_model = self.db.query(RiskScoreModel).filter_by(transaction_id=transaction_id).first()
        if not risk_score_model:
            risk_score_model = RiskScoreModel(
                transaction_id=transaction_id,
                ml_score=ml_score,
                graph_score=graph_score,
                model_version=ml_version
            )
            self.db.add(risk_score_model)
            try:
                self.db.commit()
            except Exception as e:
                self.db.rollback()
                return OrchestrationErrorResponse(
                    transaction_id=transaction_id,
                    status=LifecycleState.FAILED.value,
                    failed_stage="DATABASE",
                    error=ErrorDetail(code="500", message="RiskScore commit failed")
                )
                
        # 6. INVESTIGATION GATE
        agent_start = time.perf_counter()
        agent_response = None
        
        gate_result = InvestigationGate.evaluate(ml_score, graph_score)
        
        if gate_result.decision == "SKIP_AGENT":
            # Skip agent
            agent_response = self.agent_service.investigate(
                InvestigationRequest(
                    transaction_id=transaction_id,
                    ml_risk_score=ml_score,
                    graph_risk_score=graph_score,
                    customer_id=request.customer_id,
                    graph_entity_id=entity_id
                ), 
                self.db
            )
            agent_latency = (time.perf_counter() - agent_start) * 1000
            self._update_status(tx, LifecycleState.AGENT_SKIPPED)
            self._record_audit(transaction_id, "AGENT_SKIPPED", {
                "reason": "Below thresholds",
                "gate_version": gate_result.gate_version,
                "gate_result": gate_result.decision
            }, latency=agent_latency)
        else:
            # Run agent
            self._update_status(tx, LifecycleState.INVESTIGATING)
            self._record_audit(transaction_id, "AGENT_STARTED", {
                "ml_score": ml_score, 
                "graph_score": graph_score,
                "gate_version": gate_result.gate_version,
                "gate_result": gate_result.decision
            })
            try:
                agent_response = self.agent_service.investigate(
                    InvestigationRequest(
                        transaction_id=transaction_id,
                        ml_risk_score=ml_score,
                        graph_risk_score=graph_score,
                        customer_id=request.customer_id,
                        graph_entity_id=entity_id
                    ), 
                    self.db
                )
            except Exception as e:
                logging.error(f"Agent Service Failed: {e}")
                from app.agent.schemas import InvestigationResponse, InvestigationResult
                agent_response = InvestigationResponse(
                    transaction_id=transaction_id,
                    status="DEGRADED",
                    investigation=InvestigationResult(
                        recommendation="BLOCK",
                        confidence=0.9,
                        reason_codes=["AGENT_UNAVAILABLE"],
                        evidence=[]
                    )
                )
            agent_latency = (time.perf_counter() - agent_start) * 1000
            
            if agent_response.status == "DEGRADED":
                self._update_status(tx, LifecycleState.DEGRADED)
                self._record_audit(transaction_id, "AGENT_DEGRADED", {
                    "recommendation": str(agent_response.investigation.recommendation),
                    "confidence": agent_response.investigation.confidence,
                    "reason_codes": [str(code) for code in agent_response.investigation.reason_codes],
                }, latency=agent_latency)
            else:
                self._update_status(tx, LifecycleState.INVESTIGATING)
                self._record_audit(transaction_id, "AGENT_COMPLETED", {"recommendation": str(agent_response.investigation.recommendation), "confidence": agent_response.investigation.confidence}, latency=agent_latency)
                
        # 7. POLICY SERVICE
        policy_start = time.perf_counter()
        try:
            policy_result = self.policy_service.evaluate_decision(transaction_id)
            policy_latency = (time.perf_counter() - policy_start) * 1000
            
            tx.decision = policy_result.final_decision
            self._update_status(tx, LifecycleState.DECIDED)
            self._record_audit(transaction_id, "POLICY_EVALUATED", {"decision": policy_result.final_decision}, latency=policy_latency)
            self._record_audit(transaction_id, "DECISION_PERSISTED", {"decision": policy_result.final_decision}, latency=policy_latency)
            
        except Exception as e:
            logging.error(f"Policy Service Failed: {e}")
            self._update_status(tx, LifecycleState.FAILED)
            return OrchestrationErrorResponse(
                transaction_id=transaction_id,
                status=LifecycleState.FAILED.value,
                failed_stage="POLICY",
                error=ErrorDetail(code="500", message="Policy evaluation failed")
            )
            
        # 8. PIPELINE AUDITED
        total_latency = (time.perf_counter() - total_start) * 1000
        self._record_audit(transaction_id, "PIPELINE_AUDITED", {"status": "SUCCESS"}, latency=total_latency)
        
        return OrchestrationResponse(
            transaction_id=transaction_id,
            status=LifecycleState.DECIDED.value,
            ml={
                "score": ml_score,
                "model_version": ml_version
            },
            graph={
                "score": graph_score,
                "community_id": graph_result.get("community_id"),
                "signals": graph_result.get("signals", {})
            },
            agent={
                "state": agent_response.status,
                "recommendation": agent_response.investigation.recommendation,
                "confidence": agent_response.investigation.confidence
            },
            policy={
                "decision": policy_result.final_decision,
                "policy_version": policy_result.policy_version,
                "matched_rules": policy_result.matched_rule_ids
            }
        )
