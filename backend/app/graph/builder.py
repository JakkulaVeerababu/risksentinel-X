import pandas as pd
import networkx as nx
import os
import logging
from pathlib import Path

class GraphBuilder:
    def __init__(self, entities_path: str, relationships_path: str):
        self.entities_path = Path(entities_path)
        self.relationships_path = Path(relationships_path)
        
        # We use a standard undirected Graph for Louvain community detection support
        self.graph = nx.Graph()
        
    def build(self) -> nx.Graph:
        if not self.entities_path.exists() or not self.relationships_path.exists():
            raise FileNotFoundError("Graph dataset files missing.")
            
        logging.info("Loading entities...")
        entities_df = pd.read_csv(self.entities_path)
        for _, row in entities_df.iterrows():
            self.graph.add_node(row['entity_id'], entity_type=row['entity_type'])
            
        logging.info("Loading relationships...")
        rels_df = pd.read_csv(self.relationships_path)
        for _, row in rels_df.iterrows():
            self.graph.add_edge(
                row['source'], 
                row['target'], 
                relationship_type=row['relationship_type']
            )
            
        logging.info(f"Graph built with {self.graph.number_of_nodes()} nodes and {self.graph.number_of_edges()} edges.")
        return self.graph
