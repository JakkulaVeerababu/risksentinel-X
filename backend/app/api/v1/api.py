from fastapi import APIRouter
from app.api.v1.endpoints import health, score, graph, investigate, decision, stream, dashboard, simulation, audit, evaluation

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(score.router, tags=["score"])
api_router.include_router(graph.router, tags=["graph"])
api_router.include_router(investigate.router, tags=["investigate"])
api_router.include_router(decision.router, tags=["decision"])
api_router.include_router(stream.router, tags=["stream"], prefix="/stream")
api_router.include_router(dashboard.router, tags=["dashboard"], prefix="/dashboard")
api_router.include_router(simulation.router, tags=["simulation"], prefix="/simulations")
api_router.include_router(audit.router, tags=["audit"], prefix="/audit")
api_router.include_router(evaluation.router, tags=["evaluation"], prefix="/evaluation")
