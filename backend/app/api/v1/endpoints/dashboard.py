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

    # Group actual persisted transactions by hour for the chart
    now = datetime.utcnow()
    transactions_24h = base_query.all()

    # Initialize 24-hour buckets
    buckets = {i: {"time": (now - timedelta(hours=i)).strftime("%H:00"), "volume": 0, "blocked": 0, "reviewed": 0, "risk_sum": 0.0} for i in range(23, -1, -1)}

    for t in transactions_24h:
        if not t.timestamp:
            continue
        # Calculate hours ago
        delta = now - t.timestamp
        hours_ago = int(delta.total_seconds() // 3600)
        if 0 <= hours_ago <= 23:
            bucket = buckets[hours_ago]
            bucket["volume"] += 1
            if t.decision == "BLOCK":
                bucket["blocked"] += 1
            elif t.decision == "REVIEW":
                bucket["reviewed"] += 1
            bucket["risk_sum"] += t.ml_risk_score if t.ml_risk_score else 0.0

    chart_data = []
    for i in range(23, -1, -1):
        b = buckets[i]
        vol = b["volume"]
        avg_risk = b["risk_sum"] / vol if vol > 0 else 0.0
        chart_data.append({
            "time": b["time"],
            "volume": vol,
            "blocked": b["blocked"],
            "reviewed": b["reviewed"],
            "risk_score": round(avg_risk, 2)
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
        "alert": None,
        "distribution": {
            "low": low_risk,
            "medium": medium_risk,
            "high": high_risk,
            "critical": critical_risk
        },
        "top_signals": [],
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
            "graph_risk": t.graph_risk_score,
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
            "risk_score": rs.graph_score if rs else tx.graph_risk_score,
            "cluster_detected": (rs.graph_score > 0.3) if rs and rs.graph_score is not None else (tx.graph_risk_score is not None and tx.graph_risk_score > 0.3),
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
