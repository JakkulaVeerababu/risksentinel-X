import os
import sys
import datetime
from pathlib import Path
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.metrics import precision_recall_curve, auc, f1_score, confusion_matrix, accuracy_score
import logging

# Ensure absolute imports work when run as script
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from app.risk.dataset import load_and_merge_data
from app.risk.preprocessing import FraudPreprocessor
from app.risk.features import TARGET_COL, TIME_COL, ID_COL, ALL_TRAINING_FEATURES
from app.risk.model_registry import ModelRegistry
from app.risk.metadata import ModelMetadata

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def perform_chronological_split(df: pd.DataFrame):
    """Splits dataframe chronologically: 70% Train, 15% Validation, 15% Test."""
    # Ensure sorted by time
    df = df.sort_values(by=TIME_COL).reset_index(drop=True)
    
    n = len(df)
    train_end = int(n * 0.70)
    val_end = int(n * 0.85)
    
    train_df = df.iloc[:train_end].copy()
    val_df = df.iloc[train_end:val_end].copy()
    test_df = df.iloc[val_end:].copy()
    
    return train_df, val_df, test_df

def run_training_pipeline(tx_path: str, id_path: str, model_version: str = "xgb-ieeecis-v1"):
    logging.info("Starting training pipeline...")
    
    if not os.path.exists(tx_path) or not os.path.exists(id_path):
        logging.error(f"Missing training data at {tx_path} or {id_path}")
        return
        
    # 1. Load data
    logging.info("Loading and merging data...")
    df = load_and_merge_data(tx_path, id_path)
    
    # Check target
    if TARGET_COL not in df.columns:
        raise ValueError(f"Target column '{TARGET_COL}' not found in training data.")
        
    # 2. Chronological Split
    logging.info("Performing time-aware chronological split (70/15/15)...")
    train_df, val_df, test_df = perform_chronological_split(df)
    
    logging.info(f"Train size: {len(train_df)} | Val size: {len(val_df)} | Test size: {len(test_df)}")
    
    # Security / Leakage Check
    train_ids = set(train_df[ID_COL])
    val_ids = set(val_df[ID_COL])
    test_ids = set(test_df[ID_COL])
    assert train_ids.isdisjoint(val_ids), "Leakage Error: Train and Val IDs overlap!"
    assert train_ids.isdisjoint(test_ids), "Leakage Error: Train and Test IDs overlap!"
    assert val_ids.isdisjoint(test_ids), "Leakage Error: Val and Test IDs overlap!"

    # Split targets
    y_train = train_df[TARGET_COL]
    y_val = val_df[TARGET_COL]
    y_test = test_df[TARGET_COL]
    
    # 3. Preprocessing
    logging.info("Fitting preprocessor on training data...")
    preprocessor = FraudPreprocessor()
    preprocessor.fit(train_df)
    
    logging.info("Transforming datasets...")
    X_train = preprocessor.transform(train_df)
    X_val = preprocessor.transform(val_df)
    X_test = preprocessor.transform(test_df)
    
    # 4. Handle Imbalance
    fraud_rate = y_train.mean()
    scale_pos = (len(y_train) - y_train.sum()) / y_train.sum() if y_train.sum() > 0 else 1.0
    logging.info(f"Training Fraud Rate: {fraud_rate:.4%}. Setting scale_pos_weight={scale_pos:.2f}")

    # 5. Train XGBoost
    xgb_params = {
        'n_estimators': 150,
        'max_depth': 6,
        'learning_rate': 0.05,
        'scale_pos_weight': scale_pos,
        'random_state': 42,
        'eval_metric': 'aucpr',
        'early_stopping_rounds': 15
    }
    
    logging.info(f"Training XGBoost with params: {xgb_params}")
    model = xgb.XGBClassifier(**xgb_params)
    
    eval_set = [(X_train, y_train), (X_val, y_val)]
    model.fit(X_train, y_train, eval_set=eval_set, verbose=10)
    
    best_iter = model.best_iteration
    logging.info(f"Training completed. Best iteration: {best_iter}")
    
    # 6. Evaluate on Validation (DO NOT OPTIMIZE ON TEST!)
    logging.info("Evaluating on VALIDATION split...")
    val_preds = model.predict_proba(X_val)[:, 1]
    
    # Calculate PR-AUC
    precision, recall, _ = precision_recall_curve(y_val, val_preds)
    pr_auc = auc(recall, precision)
    
    # Default 0.5 threshold for F1 (Threshold optimization belongs to Policy phase)
    val_preds_bin = (val_preds >= 0.5).astype(int)
    val_f1 = f1_score(y_val, val_preds_bin)
    
    logging.info(f"VALIDATION RESULTS: PR-AUC={pr_auc:.4f}, F1={val_f1:.4f}")
    
    metrics = {
        "pr_auc": float(pr_auc),
        "f1_score": float(val_f1)
    }

    # 7. Persist Artifacts
    logging.info("Saving model and artifacts...")
    # Safe fallback path relative to the script location
    default_model_dir = str(Path(__file__).resolve().parent.parent.parent.parent / "models")
    # Check if we are running in docker or local
    base_path = "/app/models" if os.path.exists("/app/models") else default_model_dir
    
    registry = ModelRegistry(base_path=base_path)
    
    metadata = ModelMetadata(
        model_version=model_version,
        training_timestamp=datetime.datetime.utcnow().isoformat(),
        dataset_name="IEEE-CIS Fraud Detection",
        num_training_rows=len(train_df),
        num_validation_rows=len(val_df),
        feature_count=len(ALL_TRAINING_FEATURES),
        target_name=TARGET_COL,
        xgboost_parameters=xgb_params,
        best_iteration=best_iter,
        validation_metrics=metrics
    )
    
    registry.save_artifacts(model_version, model, preprocessor, metadata, ALL_TRAINING_FEATURES)
    logging.info(f"Pipeline complete! Artifacts saved for {model_version}.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--tx-path", type=str, default="data/raw/train_transaction.csv")
    parser.add_argument("--id-path", type=str, default="data/raw/train_identity.csv")
    parser.add_argument("--version", type=str, default="xgb-ieeecis-v1")
    
    args = parser.parse_args()
    run_training_pipeline(args.tx_path, args.id_path, args.version)
