from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.domain import RiskScoreModel
from app.graph.schemas import GraphCheckResponse
from app.graph.service import GraphRiskService
import logging

router = APIRouter()

@router.get("/graph-check", response_model=GraphCheckResponse)
def check_graph(entity_id: str = Query(..., description="The ID of the entity to check in the graph")):
    service = GraphRiskService.get_instance()
    
    if not service.is_loaded:
        return JSONResponse(
            status_code=503,
            content={
                "error": {
                    "code": "GRAPH_NOT_AVAILABLE",
                    "message": "Graph data is not available or not loaded."
                }
            }
        )
        
    try:
        result = service.check_entity(entity_id)
        return GraphCheckResponse(**result)
    except ValueError as e:
        # Entity not found
        return JSONResponse(
            status_code=404,
            content={
                "error": {
                    "code": "ENTITY_NOT_FOUND",
                    "message": str(e)
                }
            }
        )
    except Exception as e:
        logging.error(f"Graph check failed for {entity_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during graph check.")

@router.get("/context/{entity_id}")
def get_graph_context(entity_id: str, db: Session = Depends(get_db)):
    service = GraphRiskService.get_instance()
    if not service.is_loaded:
        raise HTTPException(status_code=503, detail="Graph data is not available")
        
    try:
        result = service.check_entity(entity_id)
        
        # Override graph_score if RiskScoreModel exists (crucial for simulations where the graph is mocked)
        if entity_id.startswith("SIM-TX-") or entity_id.startswith("TX-"):
            risk_model = db.query(RiskScoreModel).filter(RiskScoreModel.transaction_id == entity_id).first()
            if risk_model and risk_model.graph_score is not None:
                result["graph_risk"] = risk_model.graph_score

        try:
            neighbors = list(service.graph.neighbors(entity_id))[:10]
        except Exception:
            neighbors = []
            
        nodes = [{"id": entity_id, "group": result["entity_type"]}]
        links = []
        for n in neighbors:
            nodes.append({"id": n, "group": service.graph.nodes[n].get("entity_type", "unknown")})
            links.append({"source": entity_id, "target": n})
            
        return {
            "entity_id": entity_id,
            "graph_score": result["graph_risk"],
            "community_id": result["community_id"],
            "signals": result["signals"],
            "related_entities": result["related_entities"],
            "nodes": nodes,
            "links": links
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logging.error(f"Graph context failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")

@router.get("/check/{entity_id}", response_model=GraphCheckResponse)
def check_node_details(entity_id: str):
    """Alias for /graph-check for path-based access."""
    return check_graph(entity_id)

@router.get("/clusters")
def get_clusters():
    service = GraphRiskService.get_instance()
    if not service.is_loaded:
        raise HTTPException(status_code=503, detail="Graph data is not available")
        
    try:
        clusters = service.get_top_clusters(limit=12)
        return {"clusters": clusters}
    except Exception as e:
        logging.error(f"Failed to get clusters: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")

@router.get("/cluster/{cluster_id}")
def get_cluster_details(cluster_id: str):
    # This is a stub for real cluster-level aggregation, 
    # but it shouldn't return hardcoded fake risk.
    return {
        "details": {
            "cluster_id": cluster_id,
            "message": "Cluster-level queries require full graph scanning, currently not implemented dynamically."
        }
    }

