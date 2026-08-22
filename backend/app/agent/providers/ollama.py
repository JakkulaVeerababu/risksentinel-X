import os
import requests
import json
import logging
from typing import Dict, Any
from app.agent.providers.base import InvestigationLLMProvider
from app.agent.schemas import InvestigationResult

class OllamaProvider(InvestigationLLMProvider):
    """
    Connects to a local Ollama instance (http://localhost:11434).
    """
    
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "llama3")
        self.timeout = int(os.getenv("AGENT_TIMEOUT_SECONDS", "30"))
        
    def generate_structured_investigation(self, prompt: str, context: Dict[str, Any]) -> InvestigationResult:
        url = f"{self.base_url}/api/generate"
        
        # Combine prompt + context
        full_prompt = f"{prompt}\n\nCONTEXT:\n{json.dumps(context, indent=2)}"
        
        payload = {
            "model": self.model,
            "prompt": full_prompt,
            "format": "json", # Force structured output
            "stream": False,
            "options": {
                "temperature": 0.0 # Deterministic
            }
        }
        
        try:
            response = requests.post(url, json=payload, timeout=self.timeout)
            response.raise_for_status()
            
            result_json = response.json().get("response", "{}")
            result_dict = json.loads(result_json)
            
            # Rely on Pydantic to validate the dict
            return InvestigationResult(**result_dict)
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Ollama API request failed: {e}")
            raise RuntimeError(f"Provider unavailable: {e}")
        except json.JSONDecodeError as e:
            logging.error(f"Ollama returned malformed JSON: {e}")
            raise ValueError(f"Malformed structured output: {e}")
            
    @property
    def provider_info(self) -> str:
        return f"ollama-{self.model}"
