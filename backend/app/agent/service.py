import time
import logging
from typing import List
from sqlalchemy.orm import Session

from app.agent.schemas import (
    InvestigationRequest, 
    InvestigationResponse, 
    ToolCallRecord, 
    InvestigationResult, 
    ReasonCodeEnum
)
from app.agent.tools import AgentTools
from app.agent.prompts import INVESTIGATION_PROMPT_V1
from app.agent.validators import DeterministicValidator
from app.agent.providers.mock import MockProvider
from app.agent.providers.ollama import OllamaProvider

class ProviderConfigurationError(ValueError):
    pass

class InvestigationService:
    def __init__(self):
        # Allow env config to choose provider (mock for Phase 3 testing/default)
        import os
        provider_name = os.getenv("AGENT_PROVIDER")
        app_env = os.getenv("APP_ENV", "production")
        
        self.provider = None
        self.provider_error = None
        
        if provider_name == "ollama":
            self.provider = OllamaProvider()
        elif provider_name == "mock":
            if app_env == "test":
                self.provider = MockProvider()
            else:
                self.provider_error = "MockProvider is only allowed in test mode (APP_ENV=test)."
        elif provider_name == "gemini":
            try:
                from app.agent.providers.gemini import GeminiProvider
                self.provider = GeminiProvider()
            except Exception as e:
                logging.error("Gemini provider could not be initialized: %s", e)
                self.provider_error = f"Gemini provider configuration failed: {e}"
        elif not provider_name:
            self.provider_error = "AGENT_PROVIDER is missing. Provider configuration is required."
        else:
            self.provider_error = f"Unsupported AGENT_PROVIDER: {provider_name}"
            
    def _run_tool(self, tool_func, *args) -> ToolCallRecord:
        start_time = time.time()
        tool_name = tool_func.__name__
        try:
            output = tool_func(*args)
            status = "success"
            # If the tool explicitly returned an error dict, mark it
            if "error" in output:
                status = "error"
        except Exception as e:
            output = {"error": str(e)}
            status = "error"
            
        duration_ms = (time.time() - start_time) * 1000
        
        return ToolCallRecord(
            tool=tool_name,
            status=status,
            duration_ms=duration_ms,
            output=output
        )

    def investigate(self, request: InvestigationRequest, db: Session) -> InvestigationResponse:
        logging.info(f"Starting Investigation for {request.transaction_id}")
        
        from app.agent.gate import InvestigationGate
        from app.models.domain import InvestigationModel
        import json
        
        # 1. Deterministic Gate
        gate_result = InvestigationGate.evaluate(request.ml_risk_score, request.graph_risk_score)
        if gate_result.decision == "SKIP_AGENT":
            logging.info(f"Investigation SKIPPED for {request.transaction_id} by {gate_result.gate_version}")
            
            # Persist skipped state
            inv = InvestigationModel(
                transaction_id=request.transaction_id,
                agent_state="SKIPPED",
                recommendation=None,
                confidence=None,
                reason_codes=[],
                evidence=[{
                    "source": "InvestigationGate",
                    "gate_version": gate_result.gate_version,
                    "decision": gate_result.decision,
                    "ml_threshold": gate_result.ml_threshold,
                    "graph_threshold": gate_result.graph_threshold
                }]
            )
            db.add(inv)
            try:
                db.commit()
            except Exception as e:
                logging.error(f"Failed to persist SKIPPED investigation: {e}")
                db.rollback()
                
            return InvestigationResponse(
                transaction_id=request.transaction_id,
                status="SKIPPED",
                provider_info="none",
                tool_calls=[],
                investigation=InvestigationResult(
                    recommendation=None,
                    confidence=None,
                    reason_codes=[],
                    evidence=[]
                )
            )

        # 2. Deterministic Execution of the EXACTLY TWO tools
        tcr_history = self._run_tool(AgentTools.get_transaction_history, request.customer_id, db)
        tcr_graph = self._run_tool(AgentTools.get_graph_context, request.graph_entity_id)
        
        tool_calls = [tcr_history, tcr_graph]
        
        # 3. Build Bounded Context for the LLM
        context = {
            "transaction_history": tcr_history.output if tcr_history.status == "success" else {},
            "graph_context": tcr_graph.output if tcr_graph.status == "success" else {}
        }
        
        investigation_status = "COMPLETED"
        
        # 4. Request LLM Analysis
        try:
            if self.provider_error:
                raise ProviderConfigurationError(self.provider_error)

            import os
            if os.getenv("SIMULATE_AGENT_FAILURE") == "true":
                raise RuntimeError("Simulated Agent Failure")

            raw_result = self.provider.generate_structured_investigation(
                prompt=INVESTIGATION_PROMPT_V1,
                context=context
            )
            
            # 5. Strict Deterministic Validation
            validated_result = DeterministicValidator.validate_and_filter(raw_result, context)
            
        except Exception as e:
            logging.error(f"Agent Provider Failed: {e}")
            investigation_status = "DEGRADED"
            validated_result = InvestigationResult(
                recommendation="REVIEW",
                confidence=0.0,
                reason_codes=[ReasonCodeEnum.AGENT_UNAVAILABLE, ReasonCodeEnum.INSUFFICIENT_EVIDENCE],
                evidence=[]
            )
            
        clean_tool_calls = []
        for tc in tool_calls:
            clean_tool_calls.append(ToolCallRecord(
                tool=tc.tool, 
                status=tc.status, 
                duration_ms=tc.duration_ms
            ))
            
        # 6. Persist Investigation
        inv = InvestigationModel(
            transaction_id=request.transaction_id,
            agent_state=investigation_status,
            recommendation=validated_result.recommendation.value if hasattr(validated_result.recommendation, 'value') else str(validated_result.recommendation),
            confidence=validated_result.confidence,
            reason_codes=[rc.value if hasattr(rc, 'value') else str(rc) for rc in validated_result.reason_codes],
            evidence=[e.model_dump() for e in validated_result.evidence],
            provider=self.provider.provider_info if self.provider else "unconfigured",
            tool_calls=[tc.model_dump() for tc in clean_tool_calls]
        )
        db.merge(inv)
        try:
            db.commit()
        except Exception as e:
            logging.error(f"Failed to persist investigation: {e}")
            db.rollback()
            
        return InvestigationResponse(
            transaction_id=request.transaction_id,
            status=investigation_status,
            provider_info=self.provider.provider_info if self.provider else "unconfigured",
            tool_calls=clean_tool_calls,
            investigation=validated_result
        )
