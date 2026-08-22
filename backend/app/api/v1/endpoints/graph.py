from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
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
