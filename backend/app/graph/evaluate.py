import json
import logging
from pathlib import Path
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix

from app.graph.service import GraphRiskService
from app.graph.risk import GraphRiskCalculator

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def evaluate_graph():
    logging.info("Starting Graph Intelligence Evaluation against ground truth...")
    
    # 1. Load ground truth
    ground_truth_path = Path("data/synthetic/ground_truth.json")
    if not ground_truth_path.exists():
        ground_truth_path = Path("../../data/synthetic/ground_truth.json")
        
    with open(ground_truth_path, 'r') as f:
        ground_truth = json.load(f)
        
    suspicious_entities = set()
    for cluster_data in ground_truth.values():
        for key in ["customers", "devices", "ips", "payment_instruments"]:
            if key in cluster_data:
                suspicious_entities.update(cluster_data[key])
                
    logging.info(f"Loaded {len(suspicious_entities)} planted suspicious entities from ground truth.")
    
    # 2. Start Service (which loads graph)
    service = GraphRiskService.get_instance()
    if not service.is_loaded:
        logging.error("Failed to load Graph service.")
        return
        
    # 3. Evaluate every entity
    y_true = []
    y_pred = []
    
    threshold = GraphRiskCalculator.GRAPH_SUSPICIOUS_THRESHOLD
    
    for entity in service.graph.nodes():
        # Ground truth label
        is_suspicious_true = 1 if entity in suspicious_entities else 0
        y_true.append(is_suspicious_true)
        
        # Predicted label
        result = service.check_entity(entity)
        is_suspicious_pred = 1 if result["graph_risk"] >= threshold else 0
        y_pred.append(is_suspicious_pred)
        
    # 4. Calculate metrics
    precision = precision_score(y_true, y_pred, zero_division=0)
    recall = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    
    logging.info("SYNTHETIC GRAPH BENCHMARK RESULTS")
    logging.info(f"Threshold: {threshold}")
    logging.info(f"TP: {tp}, FP: {fp}, TN: {tn}, FN: {fn}")
    logging.info(f"Precision: {precision:.4f}")
    logging.info(f"Recall: {recall:.4f}")
    logging.info(f"F1 Score: {f1:.4f}")
    
    # 5. Save report
    report = {
        "threshold": threshold,
        "TP": int(tp),
        "FP": int(fp),
        "TN": int(tn),
        "FN": int(fn),
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1)
    }
    
    eval_dir = Path("evaluation")
    eval_dir.mkdir(exist_ok=True)
    with open(eval_dir / "phase2_graph_metrics.json", "w") as f:
        json.dump(report, f, indent=2)
        
    logging.info("Evaluation report saved to evaluation/phase2_graph_metrics.json")

if __name__ == "__main__":
    evaluate_graph()
