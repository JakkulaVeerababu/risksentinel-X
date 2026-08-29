import networkx as nx

class GraphFeatureExtractor:
    def __init__(self, graph: nx.Graph):
        self.graph = graph

    def _get_shared_entity_count(self, entity_id: str, target_type: str) -> int:
        """Finds how many distinct customers share a specific type of connected entity."""
        if entity_id not in self.graph:
            return 0
            
        target_nodes = [
            n for n in self.graph.neighbors(entity_id) 
            if self.graph.nodes[n].get("entity_type") == target_type
        ]
        
        shared_customers = set()
        for node in target_nodes:
            for neighbor in self.graph.neighbors(node):
                if self.graph.nodes[neighbor].get("entity_type") == "customer":
                    shared_customers.add(neighbor)
                    
        if self.graph.nodes[entity_id].get("entity_type") == "customer":
            shared_customers.discard(entity_id)
            
        return len(shared_customers)

    def extract_features(self, entity_id: str) -> dict:
        """Extract graph signals for a specific entity, accounting for its entity_type."""
        if entity_id not in self.graph:
            raise ValueError("Entity not in graph")
            
        node_data = self.graph.nodes[entity_id]
        entity_type = node_data.get("entity_type", "unknown")
        
        shared_devices = 0
        shared_ips = 0
        shared_pis = 0
        connected_customers = 0
        
        if entity_type == "customer":
            # For customers, how many other customers share their resources?
            shared_devices = self._get_shared_entity_count(entity_id, "device")
            shared_ips = self._get_shared_entity_count(entity_id, "ip")
            shared_pis = self._get_shared_entity_count(entity_id, "payment_instrument")
            connected_customers = shared_devices + shared_ips + shared_pis
        else:
            # For devices, IPs, merchants, PIs, the risk comes from how many distinct customers use them
            # EXCEPT merchants naturally have many customers, so we track it but weigh it differently in risk.py
            customers_using_this = [
                n for n in self.graph.neighbors(entity_id) 
                if self.graph.nodes[n].get("entity_type") == "customer"
            ]
            connected_customers = len(customers_using_this)
            
            # Map this back to the specific signal type for risk calculator compatibility
            if entity_type == "device":
                shared_devices = connected_customers
            elif entity_type == "ip":
                shared_ips = connected_customers
            elif entity_type == "payment_instrument":
                shared_pis = connected_customers

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
            "entity_type": entity_type,
            "shared_device_count": shared_devices,
            "shared_ip_count": shared_ips,
            "payment_instrument_reuse": shared_pis,
            "connected_customer_count": connected_customers,
            "community_size": comm_size,
            "community_density": density
        }
