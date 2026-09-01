import pandas as pd
import logging
import os
import json
import joblib
from pathlib import Path
import xgboost as xgb

logger = logging.getLogger(__name__)

class ModelArtifactError(Exception):
    pass

class RiskModelService:
    _instance = None
    
    def __init__(self, version: str = "xgb-ieeecis-v1"):
        default_model_dir = Path(__file__).resolve().parent.parent.parent / "models"
        self.base_path = Path("/app/models") if os.path.exists("/app/models") else default_model_dir
        
        self.version = version
        self.model = None
        self.preprocessor = None
        self.metadata = None
        self.feature_manifest = None
        self.threshold = 0.5
        self.is_loaded = False
        
    @classmethod
    def get_instance(cls, version: str = "xgb-ieeecis-v1"):
        if cls._instance is None:
            cls._instance = cls(version)
            try:
                cls._instance.load_model()
            except ModelArtifactError as e:
                logger.warning(f"Model version {version} not loaded: {e}")
        return cls._instance

    def load_model(self):
        logger.info(f"Loading RiskModelService artifacts for version: {self.version} from {self.base_path}")
        
        model_path = self.base_path / f"{self.version}.json"
        preprocessor_path = self.base_path / "preprocessor-v1.joblib"
        manifest_path = self.base_path / "feature_manifest-v1.json"
        threshold_path = self.base_path / "threshold-v1.json"
        metadata_path = self.base_path / "model_metadata-v1.json"
        
        if not model_path.exists():
            raise ModelArtifactError("Model JSON artifact missing.")
        if not preprocessor_path.exists():
            raise ModelArtifactError("Preprocessor joblib artifact missing.")
        if not manifest_path.exists():
            raise ModelArtifactError("Feature manifest JSON artifact missing.")
            
        # Load Model
        self.model = xgb.XGBClassifier()
        self.model.load_model(model_path)
        
        # Load Preprocessor
        self.preprocessor = joblib.load(preprocessor_path)
        
        # Load Manifest
        with open(manifest_path, "r") as f:
            self.feature_manifest = json.load(f)
            
        # Load Threshold (optional fallback if missing)
        if threshold_path.exists():
            with open(threshold_path, "r") as f:
                th_data = json.load(f)
                self.threshold = th_data.get("threshold", 0.5)
                
        # Load Metadata (optional)
        if metadata_path.exists():
            with open(metadata_path, "r") as f:
                self.metadata = json.load(f)
                
        self.is_loaded = True
        logger.info("RiskModelService loaded successfully.")

    def score(self, payload: dict) -> float:
        if not self.is_loaded:
            raise ModelArtifactError("Model is not loaded.")
            
        # 1. Convert to DataFrame
        df = pd.DataFrame([payload])
        
        # 2. Add missing columns with None to fulfill manifest
        feature_order = self.feature_manifest.get("feature_order", [])
        for col in feature_order:
            if col not in df.columns:
                df[col] = None
                
        # 3. Transform using preprocessor
        X_trans = self.preprocessor.transform(df)
        
        # 4. Predict
        proba = self.model.predict_proba(X_trans)[0, 1]
        
        # 5. Guarantee [0,1] bounding
        return float(max(0.0, min(1.0, proba)))
