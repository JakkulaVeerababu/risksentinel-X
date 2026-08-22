from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
import json
import os

router = APIRouter()

class CostSimulationResponse(BaseModel):
    fp_count: int
    fn_count: int
    fp_unit_cost: int
    fn_unit_cost: int
    total_fp_cost: int
    total_fn_cost: int
    total_simulated_cost: int
    disclaimer: str = "These costs are illustrative simulation assumptions and do not represent Razorpay's actual economics."

@router.get("/cost-simulation", response_model=CostSimulationResponse)
async def simulate_costs(
    fp_unit_cost: int = Query(150, description="Cost of a False Positive in INR"),
    fn_unit_cost: int = Query(2000, description="Cost of a False Negative in INR")
):
    """
    Dynamically recalculates illustrative economic costs based on frozen Phase 7 evaluation metrics.
    Does NOT retrain or alter the underlying model evaluation.
    """
    metrics_path = "evaluation/final_test_metrics.json"
    if not os.path.exists(metrics_path):
        # Fallback to known frozen counts if file is missing in container
        fp_count = 617
        fn_count = 1893
    else:
        with open(metrics_path, 'r') as f:
            data = json.load(f)
            fp_count = data.get("fp", 617)
            fn_count = data.get("fn", 1893)

    total_fp = fp_count * fp_unit_cost
    total_fn = fn_count * fn_unit_cost

    return CostSimulationResponse(
        fp_count=fp_count,
        fn_count=fn_count,
        fp_unit_cost=fp_unit_cost,
        fn_unit_cost=fn_unit_cost,
        total_fp_cost=total_fp,
        total_fn_cost=total_fn,
        total_simulated_cost=total_fp + total_fn
    )
