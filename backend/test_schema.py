import os
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from enum import Enum
from google import genai

class RecommendationEnum(str, Enum):
    ALLOW = "ALLOW"
    REVIEW = "REVIEW"

class ReasonCodeEnum(str, Enum):
    HIGH_ML_RISK = "HIGH_ML_RISK"

class EvidenceItem(BaseModel):
    signal: str = Field(description="Name")
    observed: str = Field(description="Observed")
    source: Literal["transaction_history", "graph_context", "ml_model", "transaction"] = Field(
        description="Source"
    )

class InvestigationResult(BaseModel):
    recommendation: Optional[RecommendationEnum] = Field(None, description="Advisory recommendation")
    confidence: Optional[float] = Field(None, description="Confidence")
    reason_codes: List[ReasonCodeEnum] = Field(description="Reason codes")
    evidence: List[EvidenceItem] = Field(description="Evidence")

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

try:
    interaction = client.interactions.create(
        model="gemini-3.7-flash",
        input="test",
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": InvestigationResult.model_json_schema()
        }
    )
    print("Success")
except Exception as e:
    print(f"Error: {e}")
