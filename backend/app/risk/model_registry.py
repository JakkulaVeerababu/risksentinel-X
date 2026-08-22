import os
import json
from pathlib import Path
import xgboost as xgb
from typing import Tuple, Optional

from app.risk.preprocessing import FraudPreprocessor
from app.risk.metadata import ModelMetadata, load_metadata

class ModelRegistry:
    def __init__(self, base_path: str = "/app/models"):
        self.base_path = Path(base_path)
        
    def get_model_dir(self, version: str) -> Path:
        model_dir = self.base_path / version
        model_dir.mkdir(parents=True, exist_ok=True)
        return model_dir
        
    def save_artifacts(
        self,
        version: str,
        model: xgb.XGBClassifier,
        preprocessor: FraudPreprocessor,
        metadata: ModelMetadata,
        feature_manifest: list
    ) -> None:
        """Saves all model artifacts to a specific version directory."""
        model_dir = self.get_model_dir(version)
        
        # 1. Save model
        model.save_model(model_dir / "model.json")
        
        # 2. Save preprocessor
        preprocessor.save(str(model_dir / "preprocessor.joblib"))
        
        # 3. Save feature manifest
        with open(model_dir / "feature_manifest.json", "w") as f:
            json.dump(feature_manifest, f, indent=2)
            
        # 4. Save metadata
        from app.risk.metadata import save_metadata
        save_metadata(metadata, str(model_dir / "metadata.json"))
        
    def load_artifacts(self, version: str) -> Tuple[xgb.XGBClassifier, FraudPreprocessor, ModelMetadata, list]:
        """Loads all artifacts for a specific version."""
        model_dir = self.get_model_dir(version)
        
        if not (model_dir / "model.json").exists():
            raise FileNotFoundError(f"Model artifact not found for version {version}")
            
        # 1. Load model
        model = xgb.XGBClassifier()
        model.load_model(model_dir / "model.json")
        
        # 2. Load preprocessor
        preprocessor = FraudPreprocessor.load(str(model_dir / "preprocessor.joblib"))
        
        # 3. Load feature manifest
        with open(model_dir / "feature_manifest.json", "r") as f:
            feature_manifest = json.load(f)
            
        # 4. Load metadata
        metadata = load_metadata(str(model_dir / "metadata.json"))
        
        return model, preprocessor, metadata, feature_manifest
