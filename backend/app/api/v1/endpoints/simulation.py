import uuid
import logging
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Optional
from pydantic import BaseModel
from app.db.session import get_db
from app.models.domain import TransactionModel, InvestigationModel, RiskScoreModel
from app.simulation.generator import ScenarioGenerator
from app.policy.service import PolicyService

router = APIRouter()

class RunScenarioRequest(BaseModel):
    scenario_type: str
    transaction_count: int = 5

class RunScenarioResponse(BaseModel):
    scenario: str
    transactions_generated: int
    customers: int
    devices: int
    ips: int
    decisions: Dict[str, int]
    investigation_id: Optional[str] = None
    ml_risk_avg: float
    graph_risk_avg: float

@router.post("/run_scenario", response_model=RunScenarioResponse)
def run_scenario(request: RunScenarioRequest, db: Session = Depends(get_db)):
    generator = ScenarioGenerator()
    tx_data_list = generator.generate_scenario(request.scenario_type, count=request.transaction_count)
    
    policy_service = PolicyService(db)
    
    customers = set()
    devices = set()
    ips = set()
    
    ml_risks = []
    graph_risks = []
    decisions_count = {"ALLOW": 0, "REVIEW": 0, "BLOCK": 0}
    last_tx_id = None
    
    for tx_data in tx_data_list:
        customers.add(tx_data["customer_id"])
        devices.add(tx_data["device_id"])
        ips.add(tx_data["ip_address"])
        
        # Determine pseudo-realistic ML & Graph risk for this simulation transaction
        if request.scenario_type == "Normal Customer":
            ml_risk = 0.05
            graph_risk = 0.1
        elif request.scenario_type == "High-Value Anomaly":
            ml_risk = 0.85 if tx_data["amount"] > 10000 else 0.1
            graph_risk = 0.2
        elif request.scenario_type in ["Device Velocity Attack", "Shared Device Attack"]:
            ml_risk = 0.7
            graph_risk = 0.85
        elif request.scenario_type == "Shared IP Attack":
            ml_risk = 0.6
            graph_risk = 0.8
        elif request.scenario_type == "Coordinated Fraud Ring":
            ml_risk = 0.8
            graph_risk = 0.95
        elif request.scenario_type == "New Account Burst":
            ml_risk = 0.65
            graph_risk = 0.4
        else:
            ml_risk = 0.3
            graph_risk = 0.3
            
        ml_risks.append(ml_risk)
        graph_risks.append(graph_risk)
        
        # Save to DB
        tx_model = TransactionModel(
            transaction_id=tx_data["transaction_id"],
            timestamp=datetime.fromtimestamp(tx_data["timestamp"], tz=__import__("datetime").timezone.utc),
            amount=tx_data["amount"],
            customer_id=tx_data["customer_id"],
            ml_risk_score=ml_risk,
            graph_risk_score=graph_risk
        )
        db.add(tx_model)
        db.commit()
        
        # Save RiskScoreModel so PolicyService can read it
        risk_model = RiskScoreModel(
            transaction_id=tx_data["transaction_id"],
            ml_score=ml_risk,
            graph_score=graph_risk,
            model_version="xgb-ieeecis-v1"
        )
        db.add(risk_model)
        
        # Save mock Graph data for the Network Graph view
        from app.models.domain import GraphEntityModel, GraphRelationshipModel
        
        db.merge(GraphEntityModel(entity_id=tx_data["transaction_id"], entity_type="transaction"))
        db.merge(GraphEntityModel(entity_id=tx_data["customer_id"], entity_type="customer"))
        db.merge(GraphEntityModel(entity_id=tx_data["device_id"], entity_type="device"))
        db.merge(GraphEntityModel(entity_id=tx_data["ip_address"], entity_type="ip"))
        
        db.add(GraphRelationshipModel(source=tx_data["transaction_id"], target=tx_data["customer_id"], relationship_type="HAS_CUSTOMER"))
        db.add(GraphRelationshipModel(source=tx_data["transaction_id"], target=tx_data["device_id"], relationship_type="USED_DEVICE"))
        db.add(GraphRelationshipModel(source=tx_data["transaction_id"], target=tx_data["ip_address"], relationship_type="FROM_IP"))
        
        db.commit()
        
        # To ensure the Policy Engine correctly evaluates the transaction WITH the AI agent's evidence,
        # we first determine if we should generate a mock AI investigation for this simulated scenario.
        mock_decision = "ALLOW"
        if ml_risk > 0.8 or graph_risk > 0.8:
            mock_decision = "BLOCK"
        elif ml_risk > 0.6 or graph_risk > 0.6:
            mock_decision = "REVIEW"
            
        if mock_decision == "BLOCK":
            # Generate a mock AI report for the simulator so the policy engine and UI have something to read
            fake_inv = InvestigationModel(
                transaction_id=tx_data["transaction_id"],
                agent_state="COMPLETED",
                recommendation="BLOCK",
                confidence=0.95,
                reason_codes=["SIMULATED_FRAUD_RING"],
                evidence=[{"type": "graph", "desc": "Shared device anomaly detected across 8 accounts."}],
                provider="gpt-4o",
                tool_calls=[]
            )
            db.add(fake_inv)
            db.commit()

        # Now evaluate the policy using the actual engine so the audit trail matches the decision
        try:
            result = policy_service.evaluate_decision(tx_data["transaction_id"])
            final_decision = result.final_decision
        except ValueError:
            final_decision = mock_decision
        
        # Apply the ACTUAL policy decision to the transaction model
        tx_model.decision = final_decision
        tx_model.status = "COMPLETED"
        db.commit()
        
        decisions_count[final_decision] = decisions_count.get(final_decision, 0) + 1
        last_tx_id = tx_data["transaction_id"]
        
    # Look up the investigation created for the last transaction in the simulation
    inv = db.query(InvestigationModel).filter(InvestigationModel.transaction_id == last_tx_id).first()

    # Reload the in-memory graph so the newly simulated transactions show up instantly
    from app.graph.service import GraphRiskService
    try:
        GraphRiskService.get_instance().load_graph()
    except Exception as e:
        logging.error(f"Failed to reload graph after simulation: {e}")

    return RunScenarioResponse(
        scenario=request.scenario_type,
        transactions_generated=len(tx_data_list),
        customers=len(customers),
        devices=len(devices),
        ips=len(ips),
        decisions=decisions_count,
        investigation_id=inv.transaction_id if inv else None,
        ml_risk_avg=sum(ml_risks) / len(ml_risks) if ml_risks else 0,
        graph_risk_avg=sum(graph_risks) / len(graph_risks) if graph_risks else 0
    )
