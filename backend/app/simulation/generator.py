import random
import time
from typing import List, Dict, Any

class ScenarioGenerator:
    def __init__(self, seed: int = 42):
        self.seed = seed
        random.seed(self.seed)
        
    def generate_collusion_pattern(self, count: int) -> List[Dict[str, Any]]:
        """
        Generates linked synthetic transactions simulating a collusion ring.
        Customers share a single device and IP pool.
        """
        transactions = []
        
        device_id = "D-SIM-999"
        ip_pool = ["IP-SIM-001", "IP-SIM-002"]
        
        base_time = int(time.time())
        
        for i in range(count):
            tx_id = f"SIM-TX-{random.randint(10000, 99999)}"
            customer_id = f"C-SIM-{i+1:03d}"
            
            transactions.append({
                "transaction_id": tx_id,
                "customer_id": customer_id,
                "amount": random.uniform(1000.0, 50000.0),
                "device_id": device_id,
                "ip_address": random.choice(ip_pool),
                "timestamp": base_time + (i * 120),  # Spread by 2 minutes
                "is_synthetic": True
            })
            
        return transactions
