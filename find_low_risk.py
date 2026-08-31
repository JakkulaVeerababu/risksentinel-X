import sys
sys.path.insert(0, '/app')
from app.graph.service import GraphRiskService

service = GraphRiskService.get_instance()
print("Graph Service loaded.")

for node, data in service.graph.nodes(data=True):
    try:
        res = service.check_entity(node)
        if res['graph_risk'] is not None and res['graph_risk'] < 0.3:
            print(f"Found low risk entity: {node}, Risk: {res['graph_risk']}")
            break
    except Exception as e:
        pass
