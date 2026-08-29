import os
import sys
import json
import joblib
import logging
import numpy as np
from pathlib import Path
from datetime import datetime, timezone
import xgboost as xgb
from sklearn.metrics import average_precision_score, precision_score, recall_score, f1_score, confusion_matrix

from evaluation.data_loader import load_ieee_cis_dataset
from evaluation.split import chronological_split
from evaluation.preprocess import build_preprocessor, get_feature_columns

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    logger.info("Starting Phase 1 ML Pipeline (IEEE-CIS)...")
    
    project_root = Path(__file__).resolve().parent.parent
    raw_dir = project_root / "data" / "raw"
    models_dir = project_root / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. Load Dataset
    try:
        df = load_ieee_cis_dataset(raw_dir)
    except FileNotFoundError:
        logger.error("Phase 1 Implementation blocked only by IEEE-CIS dataset.")
        logger.error("Please place train_transaction.csv and train_identity.csv in data/raw/")
        sys.exit(1)
        
    logger.info(f"Loaded {len(df)} records. Fraud rate: {df['isFraud'].mean():.4f}")
    
    # 2. Chronological Split
    logger.info("Performing 70/15/15 chronological split...")
    train, val, heldout = chronological_split(df)
    
    logger.info(f"Train size: {len(train)}, Validation size: {len(val)}, Heldout size: {len(heldout)}")
    
    # 3. Features & Preprocessor
    numeric_cols, categorical_cols = get_feature_columns(train)
    preprocessor = build_preprocessor(numeric_cols, categorical_cols)
    
    X_train_raw = train.drop(columns=['isFraud', 'TransactionID'])
    y_train = train['isFraud']
    
    X_val_raw = val.drop(columns=['isFraud', 'TransactionID'])
    y_val = val['isFraud']
    
    # We do NOT use heldout for anything here except maybe persisting its shape in metadata
    
    logger.info("Fitting preprocessor on TRAIN only...")
    X_train = preprocessor.fit_transform(X_train_raw)
    
    logger.info("Transforming VALIDATION...")
    X_val = preprocessor.transform(X_val_raw)
    
    # 4. Imbalance handling
    pos_train = y_train.sum()
    neg_train = len(y_train) - pos_train
    scale_pos_weight = float(neg_train / pos_train)
    logger.info(f"Computed scale_pos_weight: {scale_pos_weight:.2f}")
    
    # 5. XGBoost Training
    logger.info("Training XGBoost Classifier...")
    model = xgb.XGBClassifier(
        objective="binary:logistic",
        eval_metric="aucpr",
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5
    )
    
    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        early_stopping_rounds=10,
        verbose=10
    )
    
    # 6. Validation Metrics & Threshold Tuning
    logger.info("Evaluating on Validation set...")
    val_probs = model.predict_proba(X_val)[:, 1]
    
    best_threshold = 0.5
    best_f1 = 0.0
    
    # Grid search for threshold on VALIDATION only
    thresholds = np.arange(0.05, 0.96, 0.05)
    for t in thresholds:
        preds = (val_probs >= t).astype(int)
        f1 = f1_score(y_val, preds, zero_division=0)
        if f1 > best_f1:
            best_f1 = f1
            best_threshold = float(t)
            
    logger.info(f"Selected Threshold: {best_threshold:.2f} (Val F1: {best_f1:.4f})")
    
    val_preds = (val_probs >= best_threshold).astype(int)
    ap = average_precision_score(y_val, val_probs)
    precision = precision_score(y_val, val_preds, zero_division=0)
    recall = recall_score(y_val, val_preds, zero_division=0)
    
    logger.info(f"Validation AP: {ap:.4f}")
    logger.info(f"Validation Precision: {precision:.4f}")
    logger.info(f"Validation Recall: {recall:.4f}")
    
    # 7. Persist Artifacts
    logger.info("Persisting artifacts to models/ directory...")
    
    version = "xgb-ieeecis-v1"
    
    # Model
    model_path = models_dir / f"{version}.json"
    model.save_model(str(model_path))
    
    # Preprocessor
    preprocessor_path = models_dir / "preprocessor-v1.joblib"
    joblib.dump(preprocessor, preprocessor_path)
    
    # Feature Manifest
    feature_names = numeric_cols + categorical_cols
    manifest = {
        "model_version": version,
        "target": "isFraud",
        "identifier_columns": ["TransactionID"],
        "numeric_columns": numeric_cols,
        "categorical_columns": categorical_cols,
        "feature_order": feature_names,
        "preprocessing_version": "v1"
    }
    manifest_path = models_dir / "feature_manifest-v1.json"
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
        
    # Threshold
    threshold_data = {
        "model_version": version,
        "threshold": best_threshold,
        "selection_dataset": "validation",
        "selection_metric": "F1",
        "metric_value": best_f1
    }
    threshold_path = models_dir / "threshold-v1.json"
    with open(threshold_path, "w") as f:
        json.dump(threshold_data, f, indent=2)
        
    # Metadata
    metadata = {
        "model_version": version,
        "dataset": "IEEE-CIS Fraud Detection",
        "target": "isFraud",
        "training_timestamp": datetime.now(timezone.utc).isoformat(),
        "train_rows": len(train),
        "validation_rows": len(val),
        "heldout_rows": len(heldout),
        "feature_count": len(feature_names),
        "seed": 42,
        "scale_pos_weight": scale_pos_weight,
        "xgboost_parameters": model.get_params(),
        "validation_metrics": {
            "average_precision": float(ap),
            "precision": float(precision),
            "recall": float(recall),
            "f1": float(best_f1)
        },
        "threshold_artifact_reference": "threshold-v1.json"
    }
    metadata_path = models_dir / "model_metadata-v1.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
        
    logger.info("Phase 1 ML Pipeline completed successfully.")

if __name__ == "__main__":
    main()
