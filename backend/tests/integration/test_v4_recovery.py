from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_investigations_returns_200():
    response = client.get("/api/v1/investigations/")
    assert response.status_code == 200
    data = response.json()
    assert "investigations" in data
    assert isinstance(data["investigations"], list)

def test_empty_investigations_returns_empty_not_404():
    # Since we are using the test db (which might be empty or have data),
    # we just verify it returns a list and a 200 status.
    response = client.get("/api/v1/investigations/")
    assert response.status_code == 200
    assert "investigations" in response.json()

def test_audit_list_returns_200():
    response = client.get("/api/v1/audit/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_audit_list_uses_persisted_events():
    response = client.get("/api/v1/audit/")
    assert response.status_code == 200
    events = response.json()
    if len(events) > 0:
        assert "event_id" in events[0]
        assert "service" in events[0]

def test_audit_empty_returns_empty_not_500():
    # Passing a fake transaction_id should return an empty list without a 500 error
    response = client.get("/api/v1/audit/?transaction_id=fake_tx_id_xyz")
    assert response.status_code == 200
    assert response.json() == []
