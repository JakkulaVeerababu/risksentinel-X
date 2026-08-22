import pandas as pd
from typing import Dict, Any
import logging
from pathlib import Path

from app.graph.service import GraphRiskService
from app.graph.schemas import GraphCheckResponse

class AgentTools:
    
    @staticmethod
    def get_transaction_history(customer_id: str) -> Dict[str, Any]:
        """
        Tool 1: Retrieve bounded transaction history and velocity metrics.
        In a real system, this queries the PostgreSQL database.
        For Phase 3 MVP, we simulate reading from the raw dataset or return controlled synthetic data.
        """
        logging.info(f"Tool Execute: get_transaction_history for {customer_id}")
        
        # Simulate deterministic retrieval
        # If we were querying DB: SELECT count(*), avg(amount) WHERE customer = customer_id
        
        # We will return deterministic mock history based on customer_id hash for demo reproducibility
        # This keeps the tool functional without requiring live postgres connection for the demo test
        cid_hash = hash(customer_id) % 100
        
        # Base logic:
        tx_count = (cid_hash % 10) + 1
        recent_tx = min(tx_count, (cid_hash % 3) + 1)
        avg_amt = float(500 + (cid_hash * 10))
        max_amt = float(avg_amt + (cid_hash * 5))
        prev_flags = 1 if cid_hash > 80 else 0
        
        return {
            "customer_id": customer_id,
            "transaction_count": tx_count,
            "recent_transaction_count": recent_tx,
            "average_amount": avg_amt,
            "max_amount": max_amt,
            "previous_flagged_events": prev_flags
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
