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
        fp_count = 1722
        fn_count = 1654
    else:
        with open(metrics_path, 'r') as f:
            data = json.load(f)
            fp_count = data.get("fp", 1722)
            fn_count = data.get("fn", 1654)

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

@router.get("/model-performance")
async def get_model_performance(threshold: float = Query(0.80)):
    # FROZEN_HELDOUT_EVALUATION
    return {
        "metrics": {
            "precision": 0.4535,
            "recall": 0.4635,
            "f1": 0.4585,
            "pr_auc": 0.4810,
            "tp_count": 1429,
            "fp_count": 1722,
            "tn_count": 83776,
            "fn_count": 1654,
            "threshold_used": 0.80
        },
        "graph_metrics": {
            "precision": 0.9040,
            "recall": 0.9912,
            "f1": 0.9456,
            "threshold_used": 0.30
        },
        "model_info": {
            "model_name": "FraudXGBoost",
            "model_version": "v1.2.4",
            "training_samples": 0,
            "validation_samples": 0,
            "test_samples": 88581,
            "feature_count": 42,
            "training_date": "2026-08-28T12:00:00Z"
        },
        "chart_data": {
            "pr_curve": [],
            "risk_score_distribution": [],
            "threshold_vs_fpr": [],
            "fraud_over_time": [],
            "feature_importance": []
        }
    }
