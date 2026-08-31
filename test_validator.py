import sys
sys.path.insert(0, '/app')
from app.agent.schemas import InvestigationResult, EvidenceItem
from app.agent.validators import DeterministicValidator

context = {
    "transaction_history": {
        "customer_id": "CUST_9",
        "transaction_count": 6
    },
    "graph_context": {
        "shared_device_count": 5
    }
}

result = InvestigationResult(
    recommendation="REVIEW",
    confidence=0.8,
    reason_codes=["UNUSUAL_AMOUNT"],
    evidence=[
        EvidenceItem(source="transaction_history", signal="shared_device_count", observed="5")
    ]
)

validated = DeterministicValidator.validate_and_filter(result, context)
print("Validated Evidence:", validated.evidence)
