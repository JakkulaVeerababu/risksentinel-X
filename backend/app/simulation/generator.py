import random
import time
import uuid
from typing import List, Dict, Any

class ScenarioGenerator:
    def __init__(self, seed: int = None):
        if seed:
            random.seed(seed)
            
    def generate_scenario(self, scenario_type: str, count: int = 5) -> List[Dict[str, Any]]:
        transactions = []
        base_time = int(time.time())
        
        if scenario_type == "Normal Customer":
            for i in range(count):
                offset = (count - 1 - i) * 3600 + random.randint(60, 1800)
                transactions.append(self._create_tx(base_time - offset, amount=random.uniform(10.0, 100.0), is_synthetic=False))
                
        elif scenario_type == "High-Value Anomaly":
            for i in range(count - 1):
                offset = (count - 1 - i) * 7200 + random.randint(60, 1800)
                transactions.append(self._create_tx(base_time - offset, amount=random.uniform(10.0, 50.0)))
            transactions.append(self._create_tx(base_time, amount=random.uniform(10000.0, 50000.0)))
            
        elif scenario_type == "Device Velocity Attack":
            device_id = f"D-ATK-{uuid.uuid4().hex[:6]}"
            for i in range(count):
                offset = (count - 1 - i) * 45
                tx = self._create_tx(base_time - offset)
                tx["device_id"] = device_id
                tx["velocity_5m"] = count
                transactions.append(tx)
                
        elif scenario_type == "Shared Device Attack":
            device_id = f"D-ATK-{uuid.uuid4().hex[:6]}"
            for i in range(count):
                offset = (count - 1 - i) * 3600
                tx = self._create_tx(base_time - offset)
                tx["device_id"] = device_id
                transactions.append(tx)
                
        elif scenario_type == "Shared IP Attack":
            ip_addr = f"192.168.1.{random.randint(1,255)}"
            for i in range(count):
                offset = (count - 1 - i) * 3600
                tx = self._create_tx(base_time - offset)
                tx["ip_address"] = ip_addr
                transactions.append(tx)
                
        elif scenario_type == "Coordinated Fraud Ring":
            device_pool = [f"D-RING-{i}" for i in range(3)]
            ip_pool = [f"10.0.0.{i}" for i in range(2)]
            for i in range(count):
                offset = (count - 1 - i) * 1800
                tx = self._create_tx(base_time - offset, amount=random.uniform(1000.0, 5000.0))
                tx["device_id"] = random.choice(device_pool)
                tx["ip_address"] = random.choice(ip_pool)
                transactions.append(tx)
                
        elif scenario_type == "New Account Burst":
            for i in range(count):
                offset = (count - 1 - i) * 120
                tx = self._create_tx(base_time - offset, amount=random.uniform(500.0, 2000.0))
                tx["customer_age_days"] = 0
                transactions.append(tx)
                
        elif scenario_type == "Merchant Anomaly":
            merchant_id = f"M-ATK-{uuid.uuid4().hex[:6]}"
            for i in range(count):
                offset = (count - 1 - i) * 3600
                tx = self._create_tx(base_time - offset, amount=random.uniform(200.0, 400.0))
                tx["merchant_id"] = merchant_id
                transactions.append(tx)
        
        else:
            # Default fallback
            for i in range(count):
                offset = (count - 1 - i) * 3600
                transactions.append(self._create_tx(base_time - offset))
                
        return transactions
        
    def _create_tx(self, timestamp: int, amount: float = None, is_synthetic: bool = True) -> Dict[str, Any]:
        return {
            "transaction_id": f"SIM-TX-{uuid.uuid4().hex[:8].upper()}",
            "customer_id": f"C-SIM-{random.randint(1000, 9999)}",
            "amount": amount or random.uniform(20.0, 500.0),
            "currency": "USD",
            "merchant_id": f"M-SIM-{random.randint(100, 999)}",
            "merchant_name": f"Simulated Merchant {random.randint(1, 10)}",
            "device_id": f"D-SIM-{uuid.uuid4().hex[:8]}",
            "ip_address": f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
            "country": "US",
            "city": "SimCity",
            "customer_age_days": random.randint(10, 1000),
            "payment_method": "CREDIT_CARD",
            "velocity_5m": random.randint(0, 2),
            "timestamp": timestamp,
            "is_synthetic": is_synthetic
        }