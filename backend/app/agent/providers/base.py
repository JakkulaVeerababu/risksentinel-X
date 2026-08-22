from abc import ABC, abstractmethod
from typing import Dict, Any
from app.agent.schemas import InvestigationResult

class InvestigationLLMProvider(ABC):
    
    @abstractmethod
    def generate_structured_investigation(
        self, 
        prompt: str, 
        context: Dict[str, Any]
    ) -> InvestigationResult:
        """
        Takes the rigidly constructed prompt and the verified context 
        and returns a Pydantic-validated InvestigationResult.
        Must raise exceptions on timeout or malformed JSON.
        """
        pass
        
    @property
    @abstractmethod
    def provider_info(self) -> str:
        """Returns provider and model identifier (e.g. 'Ollama-llama3', 'Mock-v1')"""
        pass
