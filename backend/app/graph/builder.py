import networkx as nx
import logging
from app.db.session import SessionLocal
from app.models.domain import GraphEntityModel, GraphRelationshipModel

class GraphBuilder:
    def __init__(self):
        # We use a standard undirected Graph for Louvain community detection support
        self.graph = nx.Graph()
        
    def build(self) -> nx.Graph:
        logging.info("Loading graph from database...")
        db = SessionLocal()
        try:
            entities = db.query(GraphEntityModel).all()
            if not entities:
                logging.warning("No graph entities found in database. Graph will be empty.")
            
            for entity in entities:
                self.graph.add_node(entity.entity_id, entity_type=entity.entity_type)
                
            relationships = db.query(GraphRelationshipModel).all()
            for rel in relationships:
                self.graph.add_edge(
                    rel.source, 
                    rel.target, 
                    relationship_type=rel.relationship_type
                )
                
            logging.info(f"Graph built with {self.graph.number_of_nodes()} nodes and {self.graph.number_of_edges()} edges.")
            return self.graph
        except Exception as e:
            logging.error(f"Error loading graph from database: {e}")
            raise
        finally:
            db.close()
