import os
import json
import random
import csv
from pathlib import Path

class SyntheticGraphGenerator:
    def __init__(self, seed: int = 42, base_path: str = "data/synthetic"):
        self.seed = seed
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        random.seed(self.seed)
        
        self.entities = []       # [(id, type)]
        self.relationships = []  # [(src, tgt, type)]
        self.ground_truth = {}
        
    def _create_entity(self, prefix: str, id_num: int) -> str:
        type_map = {"C": "customer", "D": "device", "I": "ip", "M": "merchant", "P": "payment_instrument", "T": "transaction"}
        type_str = type_map.get(prefix, "unknown")
        entity_id = f"{prefix}{id_num:04d}"
        self.entities.append((entity_id, type_str))
        return entity_id
        
    def generate_normal_population(self, num_customers: int = 1000):
        print("Generating normal population...")
        for i in range(1, num_customers + 1):
            c_id = self._create_entity("C", i)
            
            # Normal: 1-3 devices
            for d in range(random.randint(1, 3)):
                d_id = self._create_entity("D", i * 10 + d)
                self.relationships.append((c_id, d_id, "USES_DEVICE"))
                
            # Normal: 1-3 IPs (Simulate household by occasionally sharing an IP block)
            for ip in range(random.randint(1, 3)):
                # 10% chance to share a household IP (cluster of 5 customers)
                ip_id_num = (i // 5) if random.random() < 0.1 else (i * 10 + ip)
                ip_id = self._create_entity("I", ip_id_num)
                self.relationships.append((c_id, ip_id, "USES_IP"))
                
            # Normal: 1-2 Payment Instruments
            for pi in range(random.randint(1, 2)):
                pi_id = self._create_entity("P", i * 10 + pi)
                self.relationships.append((c_id, pi_id, "HAS_PAYMENT_INSTRUMENT"))
                
    def plant_suspicious_pattern_a(self, cluster_id: str, start_idx: int):
        # Pattern A: Device reuse (10 customers share 2 devices)
        print(f"Planting {cluster_id} (Pattern A: Device reuse)...")
        customers = [self._create_entity("C", start_idx + i) for i in range(10)]
        devices = [self._create_entity("D", start_idx + i) for i in range(2)]
        
        for c_id in customers:
            # Connect all customers to both devices
            for d_id in devices:
                self.relationships.append((c_id, d_id, "USES_DEVICE"))
                
        self.ground_truth[cluster_id] = {
            "label": "SUSPICIOUS_CLUSTER",
            "pattern": "A_DEVICE_REUSE",
            "customers": customers,
            "devices": devices
        }
        
    def plant_suspicious_pattern_b(self, cluster_id: str, start_idx: int):
        # Pattern B: IP Concentration (15 customers share 1 IP)
        print(f"Planting {cluster_id} (Pattern B: IP concentration)...")
        customers = [self._create_entity("C", start_idx + i) for i in range(15)]
        ip_id = self._create_entity("I", start_idx)
        
        for c_id in customers:
            self.relationships.append((c_id, ip_id, "USES_IP"))
            
        self.ground_truth[cluster_id] = {
            "label": "SUSPICIOUS_CLUSTER",
            "pattern": "B_IP_CONCENTRATION",
            "customers": customers,
            "ips": [ip_id]
        }

    def plant_suspicious_pattern_c(self, cluster_id: str, start_idx: int):
        # Pattern C: Payment Instrument Reuse (8 customers share 3 PIs)
        print(f"Planting {cluster_id} (Pattern C: PI reuse)...")
        customers = [self._create_entity("C", start_idx + i) for i in range(8)]
        pis = [self._create_entity("P", start_idx + i) for i in range(3)]
        
        for c_id in customers:
            for pi_id in pis:
                # 80% chance to link
                if random.random() < 0.8:
                    self.relationships.append((c_id, pi_id, "HAS_PAYMENT_INSTRUMENT"))
                    
        self.ground_truth[cluster_id] = {
            "label": "SUSPICIOUS_CLUSTER",
            "pattern": "C_PI_REUSE",
            "customers": customers,
            "payment_instruments": pis
        }

    def plant_suspicious_pattern_d(self, cluster_id: str, start_idx: int):
        # Pattern D: Dense multi-signal (5 customers share everything)
        print(f"Planting {cluster_id} (Pattern D: Dense)...")
        customers = [self._create_entity("C", start_idx + i) for i in range(5)]
        device = self._create_entity("D", start_idx)
        ip = self._create_entity("I", start_idx)
        pi = self._create_entity("P", start_idx)
        
        for c_id in customers:
            self.relationships.append((c_id, device, "USES_DEVICE"))
            self.relationships.append((c_id, ip, "USES_IP"))
            self.relationships.append((c_id, pi, "HAS_PAYMENT_INSTRUMENT"))
            
        self.ground_truth[cluster_id] = {
            "label": "SUSPICIOUS_CLUSTER",
            "pattern": "D_DENSE",
            "customers": customers,
            "devices": [device],
            "ips": [ip],
            "payment_instruments": [pi]
        }

    def export(self):
        print("Exporting synthetic dataset...")
        
        # Deduplicate entities
        unique_entities = list(set(self.entities))
        
        with open(self.base_path / "entities.csv", "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["entity_id", "entity_type"])
            writer.writerows(unique_entities)
            
        with open(self.base_path / "relationships.csv", "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["source", "target", "relationship_type"])
            writer.writerows(self.relationships)
            
        with open(self.base_path / "ground_truth.json", "w") as f:
            json.dump(self.ground_truth, f, indent=2)
            
        # Evaluation Meta
        stats = {
            "seed": self.seed,
            "total_entities": len(unique_entities),
            "total_relationships": len(self.relationships),
            "suspicious_clusters": len(self.ground_truth)
        }
        eval_path = Path("evaluation")
        eval_path.mkdir(exist_ok=True)
        with open(eval_path / "graph_benchmark.json", "w") as f:
            json.dump(stats, f, indent=2)
            
        print("Done exporting.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--base_path", type=str, default=None)
    args = parser.parse_args()
    
    # Update working dir if running from root
    if args.base_path:
        base_path = args.base_path
    else:
        base_path = "data/synthetic" if Path("data").exists() else "../../data/synthetic"
    
    generator = SyntheticGraphGenerator(seed=args.seed, base_path=base_path)
    generator.generate_normal_population(num_customers=1000)
    
    generator.plant_suspicious_pattern_a("SC-01", 5000)
    generator.plant_suspicious_pattern_b("SC-02", 6000)
    generator.plant_suspicious_pattern_c("SC-03", 7000)
    generator.plant_suspicious_pattern_d("SC-04", 8000)
    
    generator.export()
