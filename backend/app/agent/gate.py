import logging
from pydantic import BaseModel
from app.graph.risk import GraphRiskCalculator
from app.risk.inference import RiskModelService

INVESTIGATION_GATE_VERSION = "gate-v1"

class GateResult(BaseModel):
    decision: str
    gate_version: str
    ml_threshold: float
    graph_threshold: float

class InvestigationGate:
    """
    Deterministic gate controlling whether the LLM Investigation Agent should run.
    Ensures that low-risk transactions do not incur LLM costs.
    """
    
    VERSION = INVESTIGATION_GATE_VERSION

    @classmethod
    def evaluate(cls, ml_score: float, graph_score: float | None) -> GateResult:
        """
        Evaluate risk scores against frozen thresholds.
        Returns a structured GateResult.
        """
        ml_threshold = RiskModelService.get_instance().threshold
        graph_threshold = GraphRiskCalculator.GRAPH_SUSPICIOUS_THRESHOLD

        is_ml_suspicious = ml_score is not None and ml_score >= ml_threshold
        is_graph_suspicious = graph_score is not None and graph_score >= graph_threshold

        run_agent = is_ml_suspicious or is_graph_suspicious
        decision = "RUN_AGENT" if run_agent else "SKIP_AGENT"
        
        graph_str = f"{graph_score:.3f}" if graph_score is not None else "None"
        logging.info(f"InvestigationGate {cls.VERSION}: ML ({ml_score:.3f} >= {ml_threshold:.3f}) -> {is_ml_suspicious}, "
                     f"Graph ({graph_str} >= {graph_threshold:.3f}) -> {is_graph_suspicious}. "
                     f"Decision: {decision}")

        return GateResult(
            decision=decision,
            gate_version=cls.VERSION,
            ml_threshold=ml_threshold,
            graph_threshold=graph_threshold
        )

    @classmethod
    def should_investigate(cls, ml_score: float, graph_score: float | None) -> bool:
        """
        Legacy wrapper. Evaluate risk scores against frozen thresholds.
        Returns True if either score exceeds its respective threshold, False otherwise.
        """
        return cls.evaluate(ml_score, graph_score).decision == "RUN_AGENT"
