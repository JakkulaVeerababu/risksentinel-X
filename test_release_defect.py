import os
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient

# We will manipulate os.environ and reload modules as needed, or test the class directly.
import importlib

# To test the class directly without spinning up the whole app every time:
from app.agent.service import InvestigationService, ProviderConfigurationError
from app.agent.providers.ollama import OllamaProvider
from app.agent.providers.mock import MockProvider

def test_A():
    print("\n--- TEST A ---")
    if "AGENT_PROVIDER" in os.environ:
        del os.environ["AGENT_PROVIDER"]
    os.environ["APP_ENV"] = "production"
    
    svc = InvestigationService()
    print("Provider Name:", type(svc.provider).__name__ if svc.provider else "None")
    print("Error:", svc.provider_error)
    assert svc.provider is None
    assert "AGENT_PROVIDER is missing" in svc.provider_error

def test_B():
    print("\n--- TEST B ---")
    os.environ["AGENT_PROVIDER"] = "mock"
    os.environ["APP_ENV"] = "production"
    
    svc = InvestigationService()
    print("Provider Name:", type(svc.provider).__name__ if svc.provider else "None")
    print("Error:", svc.provider_error)
    assert svc.provider is None
    assert "MockProvider is only allowed in test mode" in svc.provider_error

def test_C():
    print("\n--- TEST C ---")
    os.environ["AGENT_PROVIDER"] = "mock"
    os.environ["APP_ENV"] = "test"
    
    svc = InvestigationService()
    print("Provider Name:", type(svc.provider).__name__ if svc.provider else "None")
    print("Error:", svc.provider_error)
    assert isinstance(svc.provider, MockProvider)
    assert svc.provider_error is None

def test_D():
    print("\n--- TEST D ---")
    os.environ["AGENT_PROVIDER"] = "ollama"
    os.environ["APP_ENV"] = "production"
    
    svc = InvestigationService()
    print("Provider Name:", type(svc.provider).__name__ if svc.provider else "None")
    print("Error:", svc.provider_error)
    assert isinstance(svc.provider, OllamaProvider)
    assert svc.provider_error is None

def test_E():
    print("\n--- TEST E ---")
    os.environ["AGENT_PROVIDER"] = "invalid-provider"
    os.environ["APP_ENV"] = "production"
    
    svc = InvestigationService()
    print("Provider Name:", type(svc.provider).__name__ if svc.provider else "None")
    print("Error:", svc.provider_error)
    assert svc.provider is None
    assert "Unsupported AGENT_PROVIDER: invalid-provider" in svc.provider_error

if __name__ == "__main__":
    test_A()
    test_B()
    test_C()
    test_D()
    test_E()
    print("\nAll unit tests passed.")
