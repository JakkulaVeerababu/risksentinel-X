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

        self.model = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
        timeout_ms = int(os.getenv("GEMINI_TIMEOUT_MS", "10000"))
        retry_attempts = int(os.getenv("GEMINI_RETRY_ATTEMPTS", "2"))
        self.client = genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(
                timeout=timeout_ms,
                retry_options=types.HttpRetryOptions(attempts=retry_attempts),
            ),
        )
        logging.info("Gemini provider configured with model %s", self.model)
        
    def generate_structured_investigation(self, prompt: str, context: Dict[str, Any]) -> InvestigationResult:
        full_prompt = f"{prompt}\n\nCONTEXT:\n{json.dumps(context, indent=2)}"
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=InvestigationResult,
                    temperature=0.1,
                    max_output_tokens=1024,
                ),
            )

            if not response.text:
                raise RuntimeError("Gemini returned an empty structured response.")

            return InvestigationResult.model_validate_json(response.text)
            
        except Exception as e:
            logging.error("Gemini API request failed: %s", e)
            raise RuntimeError(f"Provider unavailable: {e}") from e
            
    @property
    def provider_info(self) -> str:
        return self.model
