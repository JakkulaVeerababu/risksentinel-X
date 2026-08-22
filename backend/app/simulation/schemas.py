from pydantic import BaseModel
from typing import List, Optional

class SimulationRequest(BaseModel):
    transaction_count: int = 5
    seed: Optional[int] = 42
    delay_ms: int = 1500

class SimulationStatusResponse(BaseModel):
    simulation_id: str
    status: str
    transaction_count: int
    completed_count: int
    failed_count: int
