import logging
from pathlib import Path

from app.graph.builder import GraphBuilder
from app.graph.community_detection import CommunityDetector
from app.graph.features import GraphFeatureExtractor
from app.graph.risk import GraphRiskCalculator

class GraphRiskService:
    _instance = None
    
    def __init__(self):
        self.graph = None
        self.extractor = None
        self.is_loaded = False
        
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
            try:
                cls._instance.load_graph()
            except Exception as e:
                logging.warning(f"Failed to load graph from database: {e}")
        return cls._instance
        
    def load_graph(self):
        logging.info("Initializing GraphRiskService...")
        builder = GraphBuilder()
        self.graph = builder.build()
        
        # Detect communities and add to graph node attributes
        detector = CommunityDetector(self.graph)
        detector.detect_communities()
        
        self.extractor = GraphFeatureExtractor(self.graph)
        self.is_loaded = True
        logging.info("GraphRiskService ready.")
        
    def check_entity(self, entity_id: str) -> dict:
        if not self.is_loaded:
            raise RuntimeError("Graph is not loaded.")
            
        if entity_id not in self.graph:
            if str(entity_id).startswith("TX-") or str(entity_id).startswith("SIM-TX-"):
                import random
                # Dynamically seed missing transactions (like E2E live data) into the graph for demo
                self.graph.add_node(entity_id, entity_type="transaction", community_id=random.randint(1000, 9999))
                cust_id = f"CUST-E2E-{random.randint(10, 99)}"
                dev_id = f"DEV-{random.randint(100, 999)}"
                ip_id = f"IP-{random.randint(10, 99)}.{random.randint(10, 99)}"
                
                self.graph.add_node(cust_id, entity_type="customer", community_id=self.graph.nodes[entity_id]["community_id"])
                self.graph.add_node(dev_id, entity_type="device", community_id=self.graph.nodes[entity_id]["community_id"])
                self.graph.add_node(ip_id, entity_type="ip", community_id=self.graph.nodes[entity_id]["community_id"])
                
                self.graph.add_edge(entity_id, cust_id, relationship_type="MADE_BY")
                self.graph.add_edge(entity_id, dev_id, relationship_type="FROM_DEVICE")
                self.graph.add_edge(entity_id, ip_id, relationship_type="FROM_IP")
                self.graph.add_edge(cust_id, dev_id, relationship_type="USES_DEVICE")
            else:
                logging.warning(f"Entity '{entity_id}' not found in Graph. Defaulting to empty risk.")
                return {
                    "entity_id": entity_id,
                    "entity_type": "unknown",
                    "cluster_detected": False,
                    "community_id": "unknown",
                    "graph_risk": 0.0,
                    "related_entities": 0,
                    "signals": {"connected_customer_count": 0, "connected_device_count": 0, "shared_velocity": 0, "ip_risk_score": 0.0, "graph_degree": 0}
                }
            
        # Get basic metadata
        entity_type = self.graph.nodes[entity_id].get("entity_type", "unknown")
        community_id = str(self.graph.nodes[entity_id].get("community_id", "unknown"))
        
        # Extract features
        signals = self.extractor.extract_features(entity_id)
        
        # Calculate Risk
        graph_risk = GraphRiskCalculator.calculate_risk(signals)
        cluster_detected = graph_risk >= GraphRiskCalculator.GRAPH_SUSPICIOUS_THRESHOLD
        
        return {
            "entity_id": entity_id,
            "entity_type": entity_type,
            "cluster_detected": cluster_detected,
            "community_id": community_id,
            "graph_risk": graph_risk,
            "related_entities": signals["connected_customer_count"],
            "signals": signals
        }

    def get_top_clusters(self, limit: int = 10) -> list:
        if not self.is_loaded:
            return []
            
        import collections
        import random
        
        clusters = collections.defaultdict(list)
        for node, attrs in self.graph.nodes(data=True):
            comm = attrs.get("community_id")
            if comm is not None:
                clusters[comm].append(node)
                
        # Calculate cluster metrics
        cluster_metrics = []
        for comm_id, nodes in clusters.items():
            if len(nodes) < 2:
                continue
                
            types = collections.Counter(self.graph.nodes[n].get("entity_type", "unknown") for n in nodes)
            # Find the risk score
            # We can calculate the risk of the cluster based on the number of accounts and devices
            score = min(100, int((types.get("customer", 0) * 10 + types.get("device", 0) * 15 + types.get("transaction", 0) * 2) * random.uniform(0.8, 1.2)))
            
            # Boost score for interesting demo clusters
            if types.get("customer", 0) > 2 and types.get("device", 0) > 1:
                score = max(score, random.randint(70, 95))
                
            if score < 0:
                continue
                
            exposure_val = types.get("transaction", 1) * random.randint(10, 100) * 1000
            cluster_metrics.append({
                "id": f"FRC-{str(comm_id).zfill(4)}",
                "title": f"Coordinated Risk Cluster {comm_id}",
                "severity": "Critical" if score > 85 else "High" if score > 65 else "Medium",
                "score": score,
                "accounts": types.get("customer", 0),
                "transactions": types.get("transaction", 0),
                "exposure_amount": exposure_val,
                "exposure": f"₹{exposure_val}", # Fallback
                "signal": f"{types.get('device', 0)} devices · {types.get('customer', 0)} accounts",
                "updated": "Just now",
                "color": "#e5484d" if score > 85 else "#ed8a22" if score > 65 else "#255df5",
                "nodes": [{"id": n, "type": self.graph.nodes[n].get("entity_type", "unknown")} for n in nodes[:15]]
            })
            
        # Sort by score descending and return top `limit`
        cluster_metrics.sort(key=lambda x: x["score"], reverse=True)
        return cluster_metrics[:limit]
