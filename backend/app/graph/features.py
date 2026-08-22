import networkx as nx

class GraphFeatureExtractor:
    def __init__(self, graph: nx.Graph):
        self.graph = graph

    def _get_shared_entity_count(self, entity_id: str, target_type: str, relationship_filter: str = None) -> int:
        """Finds how many distinct customers share a specific type of connected entity."""
        if entity_id not in self.graph:
            return 0
            
        # Get neighbors of specific type (e.g., all devices for a customer)
        target_nodes = [
            n for n in self.graph.neighbors(entity_id) 
            if self.graph.nodes[n].get("entity_type") == target_type
        ]
        
        shared_customers = set()
        for node in target_nodes:
            # For each device/IP, find connected customers
            for neighbor in self.graph.neighbors(node):
                if self.graph.nodes[neighbor].get("entity_type") == "customer":
                    shared_customers.add(neighbor)
                    
        # Exclude self if the root was a customer
        if self.graph.nodes[entity_id].get("entity_type") == "customer":
            shared_customers.discard(entity_id)
            
        return len(shared_customers)

    def extract_features(self, entity_id: str) -> dict:
        """Extract graph signals for a specific entity."""
        if entity_id not in self.graph:
            raise ValueError("Entity not in graph")
            
        node_data = self.graph.nodes[entity_id]
        
        # Signals
        shared_devices = self._get_shared_entity_count(entity_id, "device")
        shared_ips = self._get_shared_entity_count(entity_id, "ip")
        shared_pis = self._get_shared_entity_count(entity_id, "payment_instrument")
        
        # Connected Customers via 2-hop paths
        connected_customers = shared_devices + shared_ips + shared_pis
        
        # Community density (edges / potential edges in the community)
        comm_id = node_data.get("community_id", -1)
        if comm_id != -1:
            comm_nodes = [n for n, data in self.graph.nodes(data=True) if data.get("community_id") == comm_id]
            comm_size = len(comm_nodes)
            if comm_size > 1:
                subgraph = self.graph.subgraph(comm_nodes)
                # Density formula for undirected simple graph: 2*E / (V * (V-1))
                density = (2 * subgraph.number_of_edges()) / (comm_size * (comm_size - 1))
            else:
                density = 0.0
        else:
            comm_size = 0
            density = 0.0
            
        return {
            "shared_device_count": shared_devices,
            "shared_ip_count": shared_ips,
            "payment_instrument_reuse": shared_pis,
            "connected_customer_count": connected_customers,
            "community_size": comm_size,
            "community_density": density
        }
