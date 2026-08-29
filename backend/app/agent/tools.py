import pandas as pd
from typing import Dict, Any
import logging
from pathlib import Path
from sqlalchemy.orm import Session

from app.graph.service import GraphRiskService
from app.graph.schemas import GraphCheckResponse

class AgentTools:
    
    @staticmethod
    def get_transaction_history(customer_id: str, db: Session) -> Dict[str, Any]:
        """
        Tool 1: Retrieve bounded transaction history and velocity metrics.
        Queries the real PostgreSQL database for the given customer's recent transactions.
        """
        logging.info(f"Tool Execute: get_transaction_history for {customer_id}")
        
        from app.models.domain import TransactionModel
        
        # Query recent transactions for this customer, ordered by newest first, limited to 20
        recent_txs = db.query(TransactionModel).filter(
            TransactionModel.customer_id == customer_id
        ).order_by(TransactionModel.timestamp.desc()).limit(20).all()
        
        tx_count = len(recent_txs)
        recent_tx_count = tx_count # Bounded by 20 anyway
        
        if tx_count > 0:
            avg_amt = sum(tx.amount for tx in recent_txs) / tx_count
            max_amt = max(tx.amount for tx in recent_txs)
        else:
            avg_amt = 0.0
            max_amt = 0.0
            
        previous_flagged_events = sum(1 for tx in recent_txs if tx.decision in ["BLOCK", "REVIEW"])
        
        transactions_list = []
        for tx in recent_txs:
            transactions_list.append({
                "transaction_id": tx.transaction_id,
                "amount": tx.amount,
                "timestamp": tx.timestamp.isoformat() if tx.timestamp else None,
                "decision": tx.decision
            })
        
        return {
            "customer_id": customer_id,
            "transaction_count": tx_count,
            "recent_transaction_count": recent_tx_count,
            "average_amount": avg_amt,
            "max_amount": max_amt,
            "previous_flagged_events": previous_flagged_events,
            "transactions": transactions_list
        }

    @staticmethod
    def get_graph_context(entity_id: str) -> Dict[str, Any]:
        """
        Tool 2: Retrieve graph context utilizing the Phase 2 Graph service.
        """
        logging.info(f"Tool Execute: get_graph_context for {entity_id}")
        
        service = GraphRiskService.get_instance()
        if not service.is_loaded:
            return {"error": "Graph service unavailable"}
            
        try:
            result = service.check_entity(entity_id)
            # Simplify for LLM (Drop complex nested arrays if any)
            return {
                "entity_id": result["entity_id"],
                "community_id": result["community_id"],
                "graph_risk": result["graph_risk"],
                "cluster_detected": result["cluster_detected"],
                "connected_customer_count": result["signals"]["connected_customer_count"],
                "shared_device_count": result["signals"]["shared_device_count"],
                "shared_ip_count": result["signals"]["shared_ip_count"],
                "payment_instrument_reuse": result["signals"]["payment_instrument_reuse"]
            }
        except ValueError:
            return {"error": "Entity not found in graph"}
        except Exception as e:
            return {"error": str(e)}
