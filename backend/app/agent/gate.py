import logging
from app.graph.risk import GraphRiskCalculator
from app.risk.inference import RiskModelService

class InvestigationGate:
    """
    Deterministic gate controlling whether the LLM Investigation Agent should run.
    Ensures that low-risk transactions do not incur LLM costs.
    """

    @classmethod
    def should_investigate(cls, ml_score: float, graph_score: float | None) -> bool:
        """
        Evaluate risk scores against frozen thresholds.
        Returns True if either score exceeds its respective threshold, False otherwise.
        """
        ml_threshold = RiskModelService.get_instance().threshold
        graph_threshold = GraphRiskCalculator.GRAPH_SUSPICIOUS_THRESHOLD

        is_ml_suspicious = ml_score is not None and ml_score >= ml_threshold
        is_graph_suspicious = graph_score is not None and graph_score >= graph_threshold

        run_agent = is_ml_suspicious or is_graph_suspicious
        
        graph_str = f"{graph_score:.3f}" if graph_score is not None else "None"
        logging.info(f"InvestigationGate: ML ({ml_score:.3f} >= {ml_threshold:.3f}) -> {is_ml_suspicious}, "
                     f"Graph ({graph_str} >= {graph_threshold:.3f}) -> {is_graph_suspicious}. "
                     f"Decision: {'RUN_AGENT' if run_agent else 'SKIP_AGENT'}")

        return run_agent
