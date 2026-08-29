import json
import os
import hashlib
import pandas as pd
import numpy as np
import subprocess
from datetime import datetime
from pathlib import Path
from sklearn.metrics import average_precision_score, precision_score, recall_score, f1_score, confusion_matrix

from split import chronological_split
from data_loader import load_ieee_cis_dataset
import joblib

def quarantine_invalid_results():
    target = Path("results/evaluation_summary.json")
    if target.exists():
        invalid_target = Path("results/INVALID_evaluation_summary.json")
        target.rename(invalid_target)
        
        with open(invalid_target, 'r') as f:
            data = json.load(f)
            
        data["valid"] = False
        data["reason"] = "Generated from mocked/hardcoded Phase-7 evaluation"
        
        with open(invalid_target, 'w') as f:
            json.dump(data, f, indent=2)
        print("Quarantined invalid results.")

def get_git_info():
    try:
        rev = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode("utf-8").strip()
        status = subprocess.check_output(["git", "status", "--short"]).decode("utf-8").strip()
        tree_state = "dirty" if status else "clean"
        return rev, tree_state
    except Exception as e:
        return "unknown", "unknown"

def main():
    # Setup working directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    os.makedirs("results", exist_ok=True)
    
    quarantine_invalid_results()
    
    git_rev, tree_state = get_git_info()
    
    print("Loading original dataset...")
    df = load_ieee_cis_dataset(Path("../data/raw"))
    
    print("Applying chronological split...")
    train, val, heldout = chronological_split(df)
    
    print(f"Split sizes: Train={len(train)}, Val={len(val)}, Heldout={len(heldout)}")
    assert len(train) == 413378, f"Expected 413378 train, got {len(train)}"
    assert len(val) == 88581, f"Expected 88581 val, got {len(val)}"
    assert len(heldout) == 88581, f"Expected 88581 heldout, got {len(heldout)}"
    
    print("Heldout partition verified. Creating manifest...")
    tx_ids = heldout['TransactionID'].tolist()
    tx_hash = hashlib.sha256(",".join(map(str, tx_ids)).encode()).hexdigest()
    
    manifest = {
        "row_count": len(heldout),
        "min_TransactionDT": int(heldout['TransactionDT'].min()),
        "max_TransactionDT": int(heldout['TransactionDT'].max()),
        "first_5_TransactionIDs": tx_ids[:5],
        "last_5_TransactionIDs": tx_ids[-5:],
        "sha256_hash": tx_hash
    }
    with open("results/heldout_manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
        
    print("Loading frozen ML artifacts...")
    preprocessor = joblib.load("../models/preprocessor-v1.joblib")
    import xgboost as xgb
    model = xgb.XGBClassifier()
    model.load_model("../models/xgb-ieeecis-v1.json")
    
    with open("../models/threshold-v1.json", "r") as f:
        threshold_config = json.load(f)
    
    assert threshold_config['model_version'] == "xgb-ieeecis-v1"
    assert threshold_config['threshold'] == 0.80
    
    frozen_threshold = 0.80
    
    print("Running TRUE held-out inference (no fitting)...")
    from preprocess import get_feature_columns
    num_cols, cat_cols = get_feature_columns(heldout)
    features = num_cols + cat_cols
    
    # Check feature alignment with manifest
    with open("../models/feature_manifest-v1.json", "r") as f:
        manifest = json.load(f)
        manifest_cols = manifest["feature_order"]
    
    if set(features) != set(manifest_cols):
        print("Missing in features:", set(manifest_cols) - set(features))
        print("Extra in features:", set(features) - set(manifest_cols))
        raise AssertionError("Feature mismatch!")
    
    # We must order features exactly as in manifest
    X_heldout = heldout[manifest_cols]
    y_true = heldout['isFraud'].values
    
    X_transformed = preprocessor.transform(X_heldout)
    
    y_prob = model.predict_proba(X_transformed)[:, 1]
    y_pred = (y_prob >= frozen_threshold).astype(int)
    
    print("Computing metrics...")
    ap = average_precision_score(y_true, y_prob)
    precision = precision_score(y_true, y_pred, zero_division=0)
    recall = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)
    
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    
    fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
    fnr = fn / (fn + tp) if (fn + tp) > 0 else 0
    
    metrics = {
        "dataset": "IEEE-CIS Fraud Detection",
        "split": "chronological held-out",
        "rows": len(heldout),
        "fraud_rows": int(y_true.sum()),
        "fraud_prevalence": float(y_true.mean()),
        "model_version": "xgb-ieeecis-v1",
        "threshold": frozen_threshold,
        "preprocessor_version": "preprocessor-v1.joblib",
        "evaluated_at": datetime.now().isoformat(),
        "git_revision": git_rev,
        "tree_state": tree_state,
        "metrics": {
            "AP": float(ap),
            "precision": float(precision),
            "recall": float(recall),
            "F1": float(f1),
            "TP": int(tp),
            "FP": int(fp),
            "TN": int(tn),
            "FN": int(fn),
            "FPR": float(fpr),
            "FNR": float(fnr)
        }
    }
    
    with open("results/ml_heldout_metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)
        
    print("Generating PR curve...")
    from sklearn.metrics import precision_recall_curve
    precisions, recalls, thresholds = precision_recall_curve(y_true, y_prob)
    
    pr_df = pd.DataFrame({
        "precision": precisions[:-1],
        "recall": recalls[:-1],
        "threshold": thresholds
    })
    pr_df.to_csv("results/ml_pr_curve.csv", index=False)
    
    print("Phase 7 ML True Evaluation complete!")

if __name__ == "__main__":
    main()
