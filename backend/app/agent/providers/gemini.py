import os
import json
import logging
from typing import Dict, Any
from google import genai
from google.genai import types

from app.agent.providers.base import InvestigationLLMProvider
from app.agent.schemas import InvestigationResult

class GeminiProvider(InvestigationLLMProvider):
    """
    Connects to the Google Gemini API using the google-genai SDK.
    """
    
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is missing.")
            
        self.model = os.getenv("GEMINI_MODEL", "gemini-3.7-flash")
        self.client = genai.Client(api_key=api_key)
        
    def generate_structured_investigation(self, prompt: str, context: Dict[str, Any]) -> InvestigationResult:
        full_prompt = f"{prompt}\n\nCONTEXT:\n{json.dumps(context, indent=2)}"
        
        try:
            interaction = self.client.interactions.create(
                model=self.model,
                input=full_prompt,
                response_format={
                    "type": "text",
                    "mime_type": "application/json",
                    "schema": InvestigationResult.model_json_schema()
                }
            )
            
            return InvestigationResult.model_validate_json(interaction.output_text)
            
        except Exception as e:
            logging.error(f"Gemini API request failed: {e}")
            raise RuntimeError(f"Provider unavailable: {e}")
            
    @property
    def provider_info(self) -> str:
        return self.model
