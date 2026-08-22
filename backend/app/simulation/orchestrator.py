import asyncio
import json
import logging
from typing import Dict, Any

from app.audit.service import AuditService
from app.audit.schemas import AuditEvent

class SimulationOrchestrator:
    """
    Orchestrates the synthetic transactions through the existing ML, Graph, 
    Agent, and Policy layers, publishing events to the frontend.
    """
    def __init__(self, event_queue: asyncio.Queue):
        self.event_queue = event_queue
        
        from app.policy.engine import PolicyEngine
        self.policy_engine = PolicyEngine()
        
    async def run_scenario(self, simulation_id: str, transactions: list, delay_ms: int):
        logging.info(f"Starting simulation {simulation_id} with {len(transactions)} transactions.")
        
        for idx, tx in enumerate(transactions):
            tx_id = tx["transaction_id"]
            
            # 1. TRANSACTION RECEIVED
            AuditService.record_event(AuditEvent(
                transaction_id=tx_id,
                event_type="TRANSACTION_RECEIVED",
                component="Gateway",
                simulation_id=simulation_id,
                payload={"amount": tx["amount"], "customer": tx["customer_id"], "is_synthetic": True}
            ))
            await self._publish("transaction_received", tx_id, {
                "amount": tx["amount"], "customer": tx["customer_id"], "timestamp": tx["timestamp"], "is_synthetic": True
            })
            await asyncio.sleep(delay_ms / 1000.0)
            
            # 2. ML SCORED
            base_risk = 0.3 + (idx * 0.1)
            ml_risk = min(base_risk + 0.1, 0.95)
            AuditService.record_event(AuditEvent(
                transaction_id=tx_id,
                event_type="ML_SCORE_CREATED",
                component="MLService",
                model_version="xgb-ieeecis-v1-sim",
                payload={"risk_score": ml_risk}
            ))
            await self._publish("ml_scored", tx_id, {"risk_score": ml_risk, "version": "xgb-ieeecis-v1-sim"})
            await asyncio.sleep(delay_ms / 1000.0)
            
            # 3. GRAPH COMPLETED
            graph_risk = min(0.1 + (idx * 0.2), 0.98)
            cluster_detected = graph_risk > 0.6
            AuditService.record_event(AuditEvent(
                transaction_id=tx_id,
                event_type="GRAPH_ANALYSIS_COMPLETED",
                component="GraphService",
                payload={"graph_risk": graph_risk, "cluster_detected": cluster_detected}
            ))
            await self._publish("graph_completed", tx_id, {"graph_risk": graph_risk, "cluster_detected": cluster_detected, "connected_customers": idx + 1})
            await asyncio.sleep(delay_ms / 1000.0)
            
            # 4. INVESTIGATION COMPLETED
            recommendation = "BLOCK" if (ml_risk > 0.8 and graph_risk > 0.8) else "REVIEW"
            evidence = []
            if cluster_detected:
                evidence.append({"signal": "shared_device", "observed": f"{idx+1}", "source": "graph_context"})
            
            AuditService.record_event(AuditEvent(
                transaction_id=tx_id,
                event_type="AGENT_RECOMMENDATION_CREATED",
                component="AgentService",
                agent_version="claude-3-haiku",
                payload={"recommendation": recommendation, "confidence": 0.9, "reason_codes": ["GRAPH_CLUSTER_RISK"] if cluster_detected else ["VELOCITY_ANOMALY"]}
            ))
            await self._publish("investigation_completed", tx_id, {
                "status": "COMPLETED",
                "tool_calls": [{"tool": "get_transaction_history", "status": "success"}, {"tool": "get_graph_context", "status": "success"}],
                "investigation": {"recommendation": recommendation, "confidence": 0.9, "reason_codes": ["GRAPH_CLUSTER_RISK"] if cluster_detected else ["VELOCITY_ANOMALY"], "evidence": evidence}
            })
            await asyncio.sleep(delay_ms / 1000.0)
            
            # 5. POLICY DECISION
            from app.policy.schemas import PolicyInput
            policy_input = PolicyInput(
                transaction_id=tx_id, ml_risk_score=ml_risk, graph_risk_score=graph_risk,
                graph_cluster_detected=cluster_detected, agent_status="COMPLETED",
                agent_recommendation=recommendation, agent_confidence=0.9, agent_evidence_count=len(evidence)
            )
            
            decision_result = self.policy_engine.evaluate(policy_input)
            
            AuditService.record_event(AuditEvent(
                transaction_id=tx_id,
                event_type="FINAL_DECISION_CREATED",
                component="PolicyEngine",
                policy_version="v1.0.0",
                payload={"decision": decision_result.decision, "reason": decision_result.reason, "triggered_rules": decision_result.triggered_rules}
            ))
            await self._publish("policy_decision", tx_id, {
                "decision": decision_result.decision, "reason": decision_result.reason,
                "triggered_rules": decision_result.triggered_rules, "trace": decision_result.trace
            })
            await asyncio.sleep(delay_ms / 1000.0)
            
    async def _publish(self, event_type: str, tx_id: str, data: Dict[str, Any]):
        await self.event_queue.put({"event": event_type, "id": tx_id, "data": json.dumps(data)})
