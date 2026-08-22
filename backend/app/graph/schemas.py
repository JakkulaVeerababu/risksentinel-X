from pydantic import BaseModel
from typing import Dict, Any

class GraphSignalEvidence(BaseModel):
    shared_device_count: int
    shared_ip_count: int
    payment_instrument_reuse: int
    connected_customer_count: int
    community_size: int
    community_density: float

class GraphCheckResponse(BaseModel):
    entity_id: str
    entity_type: str
    cluster_detected: bool
    community_id: str
    graph_risk: float
    related_entities: int
    signals: GraphSignalEvidence
