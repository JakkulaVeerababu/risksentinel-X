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
            
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.client = genai.Client(api_key=api_key)
        
    def generate_structured_investigation(self, prompt: str, context: Dict[str, Any]) -> InvestigationResult:
        full_prompt = f"{prompt}\n\nCONTEXT:\n{json.dumps(context, indent=2)}"
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    temperature=0.0,
                    response_mime_type="application/json",
                    response_schema=InvestigationResult,
                )
            )
            
            # The SDK parses it if response_schema is provided, or returns JSON string
            if hasattr(response, "parsed") and response.parsed:
                # In google-genai, if response_schema is a Pydantic model, response.parsed might be the object or dict
                if isinstance(response.parsed, InvestigationResult):
                    return response.parsed
                elif isinstance(response.parsed, dict):
                    return InvestigationResult(**response.parsed)
            
            # Fallback to parsing text
            result_dict = json.loads(response.text)
            return InvestigationResult(**result_dict)
            
        except Exception as e:
            logging.error(f"Gemini API request failed: {e}")
            raise RuntimeError(f"Provider unavailable: {e}")
            
    @property
    def provider_info(self) -> str:
        return self.model
