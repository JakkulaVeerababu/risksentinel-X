import networkx as nx
import community as community_louvain
import logging

class CommunityDetector:
    def __init__(self, graph: nx.Graph):
        self.graph = graph
        
    def detect_communities(self):
        """
        Runs Louvain community detection on the simple undirected graph.
        Assigns 'community_id' as a node attribute.
        """
        logging.info("Running Louvain community detection...")
        
        # python-louvain works natively on undirected nx.Graph
        # best_partition returns a dict: {node: community_id}
        partition = community_louvain.best_partition(self.graph)
        
        # Assign community metadata back to the graph
        nx.set_node_attributes(self.graph, partition, 'community_id')
        
        num_communities = len(set(partition.values()))
        logging.info(f"Detected {num_communities} communities.")
        
        return partition
