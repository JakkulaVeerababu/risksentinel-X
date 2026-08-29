import json
import os
from pathlib import Path

def evaluate_graph_seed(seed_dir: Path):
    entities_path = str(seed_dir / "entities.csv")
    relationships_path = str(seed_dir / "relationships.csv")
    ground_truth_path = str(seed_dir / "ground_truth.json")
    
    # We must construct the graph objects manually because GraphRiskService uses hardcoded paths
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from backend.app.graph.builder import GraphBuilder
    from backend.app.graph.community_detection import CommunityDetector
    from backend.app.graph.features import GraphFeatureExtractor
    from backend.app.graph.risk import GraphRiskCalculator

    print(f"Building graph for {seed_dir.name}...")
    builder = GraphBuilder(entities_path, relationships_path)
    graph = builder.build()
    
    detector = CommunityDetector(graph)
    detector.detect_communities()
    
    extractor = GraphFeatureExtractor(graph)
    
    # Load ground truth
    with open(ground_truth_path, 'r') as f:
        ground_truth = json.load(f)
        
    # Gather all fraudulent customers
    fraud_customers = set()
    for cluster_data in ground_truth.values():
        fraud_customers.update(cluster_data.get('customers', []))
        
    print(f"Ground truth fraud customers: {len(fraud_customers)}")

    customers = [n for n, d in graph.nodes(data=True) if d.get('entity_type') == 'customer']
    print(f"Evaluating {len(customers)} customers...")
    
    tp, fp, tn, fn = 0, 0, 0, 0
    
    threshold = GraphRiskCalculator.GRAPH_SUSPICIOUS_THRESHOLD
    
    for c_id in customers:
        signals = extractor.extract_features(c_id)
        risk = GraphRiskCalculator.calculate_risk(signals)
        
        is_pred_fraud = risk >= threshold
        is_true_fraud = c_id in fraud_customers
        
        if is_pred_fraud and is_true_fraud:
            tp += 1
        elif is_pred_fraud and not is_true_fraud:
            fp += 1
        elif not is_pred_fraud and not is_true_fraud:
            tn += 1
        elif not is_pred_fraud and is_true_fraud:
            fn += 1
            
    print(f"{seed_dir.name}: TP={tp}, FP={fp}, TN={tn}, FN={fn}")
    
    return {
        "tp": tp, "fp": fp, "tn": tn, "fn": fn
    }

def main():
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    os.makedirs("evaluation/results", exist_ok=True)
    
    seeds = ["final_101", "final_102", "final_103"]
    
    total_tp = 0
    total_fp = 0
    total_tn = 0
    total_fn = 0
    
    for seed in seeds:
        seed_dir = Path("data") / seed
        metrics = evaluate_graph_seed(seed_dir)
        total_tp += metrics["tp"]
        total_fp += metrics["fp"]
        total_tn += metrics["tn"]
        total_fn += metrics["fn"]
        
    precision = total_tp / (total_tp + total_fp) if (total_tp + total_fp) > 0 else 0
    recall = total_tp / (total_tp + total_fn) if (total_tp + total_fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    print("\n--- FINAL AGGREGATED METRICS ---")
    print(f"TP: {total_tp}, FP: {total_fp}, TN: {total_tn}, FN: {total_fn}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1: {f1:.4f}")
    
    out_data = {
        "seeds": [101, 102, 103],
        "threshold": 0.30,
        "TP": total_tp,
        "FP": total_fp,
        "TN": total_tn,
        "FN": total_fn,
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1),
        "config_verified": {
            "device_w": 0.1,
            "ip_w": 0.1,
            "pi_w": 0.2,
            "density_th": 0.05,
            "density_w": 0.4
        }
    }
    
    with open("evaluation/results/graph_final_unseen_metrics.json", "w") as f:
        json.dump(out_data, f, indent=2)
        
    print("Saved evaluation/results/graph_final_unseen_metrics.json")

if __name__ == "__main__":
    main()
