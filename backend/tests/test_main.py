from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.schemas.domain import Transaction

client = TestClient(app)

def test_backend_imports():
    # If this file runs, app.main successfully imported
    assert app is not None

def test_configuration_loads():
    assert settings.APP_NAME == "RiskSentinel X"
    assert settings.DATABASE_URL is not None

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to RiskSentinel X API" in response.json()["message"]

def test_read_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "RiskSentinel X"

def test_api_v1_health():
    from app.db.session import get_db
    class MockSession:
        def execute(self, *args, **kwargs):
            return True
    
    app.dependency_overrides[get_db] = lambda: MockSession()
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "healthy"
    app.dependency_overrides.clear()

def test_invalid_api_input_receives_valid_error_response():
    # Test our global RequestValidationError handler
    # We will POST to a dummy endpoint to test validation
    # Since we don't have a POST endpoint yet, we can create a temporary one for the test
    @app.post("/test-validation")
    def dummy_post(tx: Transaction):
        return tx

    response = client.post("/test-validation", json={"amount": "not_a_number"})
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "message" in data["error"]
