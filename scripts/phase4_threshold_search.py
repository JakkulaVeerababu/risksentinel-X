import pandas as pd
import numpy as np
import json
from pathlib import Path
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix

def simulate_threshold_search():
    print("Simulating ML threshold search on Phase 1 validation set...")
    
    # In a real environment, we would load the true y_val and val_probs
    # val_df = pd.read_csv("data/processed/validation_predictions.csv")
    # For this MVP, we simulate a realistic probability distribution
    
    np.random.seed(42)
    n_samples = 10000
    
    # 95% legitimate, 5% fraud
    y_true = np.random.choice([0, 1], size=n_samples, p=[0.95, 0.05])
    
    # Generate mock probabilities (Fraud tends to have higher scores)
    y_prob = np.where(
        y_true == 1,
        np.random.beta(a=5, b=2, size=n_samples),  # Skewed right
        np.random.beta(a=1, b=8, size=n_samples)   # Skewed left
    )
    
    thresholds = np.arange(0.05, 1.0, 0.05)
    results = []
    
    FP_COST = 10.0   # Cost of investigating a false positive
    FN_COST = 500.0  # Cost of missing fraud
    
    for t in thresholds:
        y_pred = (y_prob >= t).astype(int)
        
        tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
        precision = precision_score(y_true, y_pred, zero_division=0)
        recall = recall_score(y_true, y_pred, zero_division=0)
        f1 = f1_score(y_true, y_pred, zero_division=0)
        
        est_cost = (fp * FP_COST) + (fn * FN_COST)
        
        results.append({
            "threshold": round(t, 2),
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "F1": round(f1, 4),
            "TP": tp,
            "FP": fp,
            "TN": tn,
            "FN": fn,
            "estimated_cost": est_cost
        })
        
    df = pd.DataFrame(results)
    
    # Select LOW threshold (e.g., recall > 0.95, capture almost everything suspicious for REVIEW)
    # Select HIGH threshold (e.g., precision > 0.90, only BLOCK if highly certain)
    
    low_candidates = df[df["recall"] > 0.95]
    high_candidates = df[df["precision"] > 0.90]
    
    low_thresh = low_candidates.iloc[-1]["threshold"] if not low_candidates.empty else 0.15
    high_thresh = high_candidates.iloc[0]["threshold"] if not high_candidates.empty else 0.85
    
    eval_dir = Path("evaluation")
    eval_dir.mkdir(exist_ok=True)
    
    df.to_csv(eval_dir / "policy_threshold_search.csv", index=False)
    
    selection = {
        "policy_version": "policy-v1",
        "low_threshold": float(low_thresh),
        "high_threshold": float(high_thresh),
        "graph_high_threshold": 0.80, # From Phase 2
        "min_block_evidence_count": 2,
        "selection_method": "Heuristic on validation set (Mocked Phase 4)",
        "notes": "Cost values are illustrative assumptions and do not represent actual economics."
    }
    
    with open(eval_dir / "policy_threshold_selection.json", "w") as f:
        json.dump(selection, f, indent=2)
        
    print(f"Selected LOW: {low_thresh}, HIGH: {high_thresh}")

if __name__ == "__main__":
    simulate_threshold_search()
