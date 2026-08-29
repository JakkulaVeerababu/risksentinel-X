import logging
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.db.session import get_db
from app.models.domain import TransactionModel

router = APIRouter()

@router.get("/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """Aggregates metrics for the Risk Overview dashboard from the database."""
    # 24H time window
    time_threshold = datetime.utcnow() - timedelta(days=1)
    
    # Base query for last 24h
    base_query = db.query(TransactionModel).filter(TransactionModel.timestamp >= time_threshold)
    
    total_tx = base_query.count()
    allowed_tx = base_query.filter(TransactionModel.decision == "ALLOW").count()
    review_tx = base_query.filter(TransactionModel.decision == "REVIEW").count()
    blocked_tx = base_query.filter(TransactionModel.decision == "BLOCK").count()
    
    # Fraud Prevented (sum of blocked amounts)
    fraud_prevented = db.query(func.sum(TransactionModel.amount))\
        .filter(TransactionModel.timestamp >= time_threshold)\
        .filter(TransactionModel.decision == "BLOCK").scalar() or 0.0
        
    # Critical Action (Exposure in REVIEW)
    review_exposure = db.query(func.sum(TransactionModel.amount))\
        .filter(TransactionModel.timestamp >= time_threshold)\
        .filter(TransactionModel.decision == "REVIEW").scalar() or 0.0
        
    # Risk Distribution
    low_risk = base_query.filter(TransactionModel.ml_risk_score < 0.3).count()
    medium_risk = base_query.filter(TransactionModel.ml_risk_score >= 0.3, TransactionModel.ml_risk_score < 0.7).count()
    high_risk = base_query.filter(TransactionModel.ml_risk_score >= 0.7, TransactionModel.ml_risk_score < 0.9).count()
    critical_risk = base_query.filter(TransactionModel.ml_risk_score >= 0.9).count()
    
    # Simple Mock Timeseries for the chart (would group by hour in real prod)
    # Using simple static generation for MVP UI layout
    now = datetime.utcnow()
    chart_data = []
    for i in range(24, 0, -1):
        dt = now - timedelta(hours=i)
        chart_data.append({
            "time": dt.strftime("%H:%M"),
            "volume": 100 + (i * 5) % 30,
            "blocked": 5 + (i * 2) % 10,
            "reviewed": 10 + (i * 3) % 15,
            "risk_score": 0.2 + (i * 0.01) % 0.4
        })

    return {
        "kpis": {
            "transactions_analysed": total_tx,
            "allowed": allowed_tx,
            "under_review": review_tx,
            "blocked": blocked_tx,
            "fraud_prevented": fraud_prevented
        },
        "critical_action": {
            "review_count": review_tx,
            "total_exposure": review_exposure
        },
        "alert": {
            "cluster_detected": True,
            "transaction_count": 8,
            "customer_count": 3,
            "shared_devices": 2
        },
        "distribution": {
            "low": low_risk,
            "medium": medium_risk,
            "high": high_risk,
            "critical": critical_risk
        },
        "top_signals": [
            {"name": "Device Velocity", "count": 45},
            {"name": "Shared Device", "count": 38},
            {"name": "IP Velocity", "count": 29},
            {"name": "Amount Anomaly", "count": 22},
            {"name": "New Account + Large Payment", "count": 15}
        ],
        "chart_data": chart_data
    }

@router.get("/transactions")
def get_recent_transactions(db: Session = Depends(get_db)):
    txs = db.query(TransactionModel).order_by(TransactionModel.timestamp.desc()).limit(50).all()
    
    formatted_txs = []
    for t in txs:
        formatted_txs.append({
            "transaction_id": t.transaction_id,
            "amount": t.amount,
            "ml_risk": t.ml_risk_score if t.ml_risk_score is not None else 0.0,
            "graph_risk": t.graph_risk_score if t.graph_risk_score is not None else 0.0,
            "decision": t.decision or "PENDING",
            "timestamp": t.timestamp.isoformat() if t.timestamp else None,
            "customer_id": t.customer_id
        })
        
    return {"transactions": formatted_txs}

@router.get("/transactions/{transaction_id}/case")
def get_full_case(transaction_id: str, db: Session = Depends(get_db)):
    from app.models.domain import RiskScoreModel, InvestigationModel, DecisionModel
    
    tx = db.query(TransactionModel).filter(TransactionModel.transaction_id == transaction_id).first()
    if not tx:
        return {"error": "Transaction not found"}
        
    rs = db.query(RiskScoreModel).filter(RiskScoreModel.transaction_id == transaction_id).first()
    inv = db.query(InvestigationModel).filter(InvestigationModel.transaction_id == transaction_id).first()
    dec = db.query(DecisionModel).filter(DecisionModel.transaction_id == transaction_id).first()
    
    return {
        "transaction": {
            "id": tx.transaction_id,
            "amount": tx.amount,
            "customer_id": tx.customer_id,
            "timestamp": tx.timestamp.isoformat() if tx.timestamp else None,
            "status": tx.status
        },
        "ml": {
            "risk_score": rs.ml_score if rs else (tx.ml_risk_score or 0.0),
            "version": rs.model_version if rs else "xgb-ieeecis-v1"
        },
        "graph": {
            "risk_score": rs.graph_score if rs else (tx.graph_risk_score or 0.0),
            "cluster_detected": (rs.graph_score > 0.3) if rs else (tx.graph_risk_score and tx.graph_risk_score > 0.3),
            "shared_devices": 0,
            "connected_customers": 0
        },
        "agent": {
            "status": inv.agent_state if inv else "SKIPPED",
            "recommendation": inv.recommendation if inv else None,
            "confidence": inv.confidence if inv else None,
            "reason_codes": inv.reason_codes if inv else [],
            "evidence": inv.evidence if inv else []
        },
        "policy": {
            "decision": dec.decision if dec else (tx.decision or "PENDING"),
            "reason": dec.reason if dec else None,
            "version": dec.policy_version if dec else "policy-v1",
            "triggered_rules": dec.matched_rules if dec else []
        }
    }
