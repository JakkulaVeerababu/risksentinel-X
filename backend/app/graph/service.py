import logging
from pathlib import Path

from app.graph.builder import GraphBuilder
from app.graph.community import CommunityDetector
from app.graph.features import GraphFeatureExtractor
from app.graph.risk import GraphRiskCalculator

class GraphRiskService:
    _instance = None
    
    def __init__(self, entities_path: str = "data/synthetic/entities.csv", relationships_path: str = "data/synthetic/relationships.csv"):
        self.entities_path = entities_path
        self.relationships_path = relationships_path
        self.graph = None
        self.extractor = None
        self.is_loaded = False
        
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            # Assume paths relative to backend root
            entities = str(Path("data/synthetic/entities.csv").resolve())
            if not Path(entities).exists():
                # Fallback if running from root
                entities = str(Path("../data/synthetic/entities.csv").resolve())
            
            rels = str(Path("data/synthetic/relationships.csv").resolve())
            if not Path(rels).exists():
                rels = str(Path("../data/synthetic/relationships.csv").resolve())
                
            cls._instance = cls(entities, rels)
            try:
                cls._instance.load_graph()
            except Exception as e:
                logging.warning(f"Failed to load synthetic graph: {e}")
        return cls._instance
        
    def load_graph(self):
        logging.info("Initializing GraphRiskService...")
        builder = GraphBuilder(self.entities_path, self.relationships_path)
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
            raise ValueError(f"Entity '{entity_id}' not found.")
            
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
