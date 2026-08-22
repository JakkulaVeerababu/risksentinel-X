import logging
from typing import List, Dict, Any
from fastapi import APIRouter

router = APIRouter()

# Mock storage for Phase 5 frontend layout
MOCK_TRANSACTIONS = [
    {
        "transaction_id": "TX9000",
        "amount": 25000,
        "ml_risk": 0.88,
        "graph_risk": 0.95,
        "decision": "BLOCK",
        "timestamp": "2026-08-21T09:55:00Z"
    },
    {
        "transaction_id": "TX9001",
        "amount": 4200,
        "ml_risk": 0.12,
        "graph_risk": 0.05,
        "decision": "ALLOW",
        "timestamp": "2026-08-21T09:56:00Z"
    }
]

@router.get("/transactions")
def get_recent_transactions():
    """Returns recent transactions to populate the dashboard stream on initial load."""
    return {"transactions": MOCK_TRANSACTIONS}

@router.get("/transactions/{transaction_id}/case")
def get_full_case(transaction_id: str):
    """
    Aggregates ML, Graph, Agent, and Policy data for a single transaction.
    This prevents the frontend from needing to stitch together multiple API calls.
    """
    # Return a mocked assembled case for Phase 5 UI development
    return {
        "transaction": {
            "id": transaction_id,
            "amount": 25000,
            "customer_id": "C9000",
            "timestamp": "2026-08-21T09:55:00Z"
        },
        "ml": {
            "risk_score": 0.88,
            "version": "xgb-ieeecis-v1"
        },
        "graph": {
            "risk_score": 0.95,
            "cluster_detected": True,
            "shared_devices": 4,
            "connected_customers": 5
        },
        "agent": {
            "status": "COMPLETED",
            "tool_calls": [
                {"tool": "get_transaction_history", "status": "success", "duration_ms": 12},
                {"tool": "get_graph_context", "status": "success", "duration_ms": 15}
            ],
            "recommendation": "BLOCK",
            "confidence": 0.92,
            "reason_codes": ["GRAPH_CLUSTER_RISK", "DEVICE_REUSE"],
            "evidence": [
                {"signal": "shared_device_count", "observed": "4", "source": "graph_context"}
            ]
        },
        "policy": {
            "decision": "BLOCK",
            "reason": "CRITICAL_RISK_VERIFIED",
            "version": "policy-v1",
            "triggered_rules": ["POL-BLOCK-001:MULTI_SIGNAL_CONFIRMED"],
            "trace": {
                "ml_high": True,
                "graph_strong": True,
                "agent_valid": True,
                "agent_block": True,
                "sufficient_evidence": True
            }
        }
    }
