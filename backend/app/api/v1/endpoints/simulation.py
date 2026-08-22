import asyncio
import uuid
import logging
from fastapi import APIRouter, BackgroundTasks
from app.simulation.schemas import SimulationRequest, SimulationStatusResponse
from app.simulation.generator import ScenarioGenerator
from app.simulation.orchestrator import SimulationOrchestrator
from app.core.events import simulation_event_queue

router = APIRouter()

# In-memory tracking for MVP
simulations_db = {}

def background_simulation_task(sim_id: str, request: SimulationRequest):
    try:
        generator = ScenarioGenerator(seed=request.seed)
        transactions = generator.generate_collusion_pattern(count=request.transaction_count)
        
        # We need an event loop for the async orchestrator since BackgroundTasks runs synchronously here or in a thread
        # Because we're in FastAPI (ASGI), this background task might already be in an async context, but standard BackgroundTasks wraps sync functions.
        # We'll use an async background task wrapper.
        pass
    except Exception as e:
        logging.error(f"Simulation failed: {e}")
        simulations_db[sim_id]["status"] = "FAILED"

async def async_background_simulation_task(sim_id: str, request: SimulationRequest):
    try:
        generator = ScenarioGenerator(seed=request.seed)
        transactions = generator.generate_collusion_pattern(count=request.transaction_count)
        
        simulations_db[sim_id]["transaction_count"] = len(transactions)
        
        orchestrator = SimulationOrchestrator(event_queue=simulation_event_queue)
        await orchestrator.run_scenario(sim_id, transactions, delay_ms=request.delay_ms)
        
        simulations_db[sim_id]["status"] = "COMPLETED"
    except Exception as e:
        logging.error(f"Simulation failed: {e}")
        simulations_db[sim_id]["status"] = "FAILED"


@router.post("/collusion", response_model=SimulationStatusResponse)
async def start_collusion_simulation(request: SimulationRequest, background_tasks: BackgroundTasks):
    sim_id = f"SIM-{uuid.uuid4().hex[:8].upper()}"
    
    simulations_db[sim_id] = {
        "status": "RUNNING",
        "transaction_count": request.transaction_count,
        "completed_count": 0,
        "failed_count": 0
    }
    
    background_tasks.add_task(async_background_simulation_task, sim_id, request)
    
    return SimulationStatusResponse(
        simulation_id=sim_id,
        status="RUNNING",
        transaction_count=request.transaction_count,
        completed_count=0,
        failed_count=0
    )
