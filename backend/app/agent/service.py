import time
import logging
from typing import List

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

class InvestigationService:
    def __init__(self):
        # Allow env config to choose provider (mock for Phase 3 testing/default)
        import os
        provider_name = os.getenv("AGENT_PROVIDER", "mock")
        if provider_name == "ollama":
            self.provider = OllamaProvider()
        else:
            self.provider = MockProvider()
            
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

    def investigate(self, request: InvestigationRequest) -> InvestigationResponse:
        logging.info(f"Starting Investigation for {request.transaction_id}")
        
        # 1. Deterministic Execution of the EXACTLY TWO tools
        tcr_history = self._run_tool(AgentTools.get_transaction_history, request.customer_id)
        tcr_graph = self._run_tool(AgentTools.get_graph_context, request.graph_entity_id)
        
        tool_calls = [tcr_history, tcr_graph]
        
        # 2. Build Bounded Context for the LLM
        context = {
            "transaction_history": tcr_history.output if tcr_history.status == "success" else {},
            "graph_context": tcr_graph.output if tcr_graph.status == "success" else {}
        }
        
        investigation_status = "COMPLETED"
        
        # 3. Request LLM Analysis
        try:
            import os
            if os.getenv("SIMULATE_AGENT_FAILURE") == "true":
                raise RuntimeError("Simulated Agent Failure")

            raw_result = self.provider.generate_structured_investigation(
                prompt=INVESTIGATION_PROMPT_V1,
                context=context
            )
            
            # 4. Strict Deterministic Validation
            validated_result = DeterministicValidator.validate_and_filter(raw_result, context)
            
        except (TimeoutError, ValueError, RuntimeError) as e:
            logging.error(f"Agent Provider Failed: {e}")
            investigation_status = "DEGRADED"
            validated_result = InvestigationResult(
                recommendation="REVIEW",
                confidence=0.0,
                reason_codes=[ReasonCodeEnum.AGENT_UNAVAILABLE, ReasonCodeEnum.INSUFFICIENT_EVIDENCE],
                evidence=[]
            )
            
        # Strip output from ToolCallRecords to prevent bloat in the final response 
        # (Though Phase 3 instructions say tool_calls can be included, usually we drop the full payload)
        clean_tool_calls = []
        for tc in tool_calls:
            clean_tool_calls.append(ToolCallRecord(
                tool=tc.tool, 
                status=tc.status, 
                duration_ms=tc.duration_ms
            ))
            
        return InvestigationResponse(
            transaction_id=request.transaction_id,
            status=investigation_status,
            provider_info=self.provider.provider_info,
            tool_calls=clean_tool_calls,
            investigation=validated_result
        )
