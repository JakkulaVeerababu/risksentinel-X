from pydantic import BaseModel, Field
from typing import Optional

class ScoreRequest(BaseModel):
    # This contract requires exactly what the IEEE-CIS model expects.
    # (Only a subset is modeled for Phase 1 baseline)
    TransactionID: str = Field(..., max_length=255)
    TransactionDT: float
    TransactionAmt: float
    ProductCD: str = Field(..., max_length=255)
    
    # Categoricals
    card1: Optional[float] = None
    card2: Optional[float] = None
    card3: Optional[float] = None
    card4: Optional[str] = Field(None, max_length=255)
    card5: Optional[float] = None
    card6: Optional[str] = Field(None, max_length=255)
    addr1: Optional[float] = None
    addr2: Optional[float] = None
    P_emaildomain: Optional[str] = Field(None, max_length=255)
    R_emaildomain: Optional[str] = Field(None, max_length=255)
    DeviceType: Optional[str] = Field(None, max_length=255)
    DeviceInfo: Optional[str] = Field(None, max_length=255)
    
    # Continuous metrics
    dist1: Optional[float] = None
    dist2: Optional[float] = None
    C1: Optional[float] = None
    C2: Optional[float] = None
    C3: Optional[float] = None
    C4: Optional[float] = None
    C5: Optional[float] = None
    C6: Optional[float] = None
    C7: Optional[float] = None
    C8: Optional[float] = None
    C9: Optional[float] = None
    C10: Optional[float] = None
    C11: Optional[float] = None
    C12: Optional[float] = None
    C13: Optional[float] = None
    C14: Optional[float] = None
    D1: Optional[float] = None
    D2: Optional[float] = None
    D3: Optional[float] = None
    D4: Optional[float] = None
    D5: Optional[float] = None
    D10: Optional[float] = None
    D11: Optional[float] = None
    D15: Optional[float] = None

class ScoreResponse(BaseModel):
    transaction_id: str
    risk_score: float
    model_version: str
