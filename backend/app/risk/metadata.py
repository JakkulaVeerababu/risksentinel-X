import json
from pathlib import Path
from pydantic import BaseModel
from typing import Dict, Any, Optional

class ModelMetadata(BaseModel):
    model_version: str
    training_timestamp: str
    dataset_name: str
    num_training_rows: int
    num_validation_rows: int
    feature_count: int
    target_name: str
    xgboost_parameters: Dict[str, Any]
    best_iteration: Optional[int]
    validation_metrics: Dict[str, float]

def save_metadata(metadata: ModelMetadata, filepath: str) -> None:
    with open(filepath, 'w') as f:
        json.dump(metadata.model_dump(), f, indent=2)

def load_metadata(filepath: str) -> ModelMetadata:
    with open(filepath, 'r') as f:
        data = json.load(f)
    return ModelMetadata(**data)
