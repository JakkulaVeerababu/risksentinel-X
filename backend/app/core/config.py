from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "RiskSentinel X"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    DATABASE_URL: str = "postgresql+psycopg://risksentinel:risksentinel@postgres:5432/risksentinel"
    LOG_LEVEL: str = "INFO"
    
    MODEL_PATH: str = "/app/models/xgboost_fraud.json"
    
    AGENT_PROVIDER: str = "ollama"
    CLAUDE_API_KEY: Optional[str] = None
    OLLAMA_BASE_URL: str = "http://localhost:11434"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
