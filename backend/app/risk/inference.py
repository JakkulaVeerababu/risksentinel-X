import pandas as pd
import logging
import os
from pathlib import Path
from app.risk.model_registry import ModelRegistry

class RiskModelService:
    _instance = None
    
    def __init__(self, version: str = "xgb-ieeecis-v1"):
        default_model_dir = str(Path(__file__).resolve().parent.parent.parent.parent / "models")
        base_path = "/app/models" if os.path.exists("/app/models") else default_model_dir
        
        self.registry = ModelRegistry(base_path=base_path)
        self.version = version
        self.model = None
        self.preprocessor = None
        self.metadata = None
        self.feature_manifest = None
        self.is_loaded = False
        
    @classmethod
    def get_instance(cls, version: str = "xgb-ieeecis-v1"):
        if cls._instance is None:
            cls._instance = cls(version)
            try:
                cls._instance.load_model()
            except FileNotFoundError:
                logging.warning(f"Model version {version} not found. Cannot score.")
        return cls._instance

    def load_model(self):
        logging.info(f"Loading RiskModelService artifacts for version: {self.version}")
        self.model, self.preprocessor, self.metadata, self.feature_manifest = self.registry.load_artifacts(self.version)
        self.is_loaded = True

    def score(self, payload: dict) -> float:
        if not self.is_loaded:
            raise RuntimeError("Model is not loaded.")
            
        # 1. Convert to DataFrame
        df = pd.DataFrame([payload])
        
        # 2. Transform using exact training pipeline
        X_trans = self.preprocessor.transform(df)
        
        # 3. Ensure columns exactly match feature manifest
        X_trans = X_trans[self.feature_manifest]
        
        # 4. Predict
        proba = self.model.predict_proba(X_trans)[0, 1]
        
        # 5. Guarantee [0,1] bounding
        return float(max(0.0, min(1.0, proba)))
