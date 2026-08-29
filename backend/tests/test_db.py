import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.base import Base
from app.models.domain import TransactionModel, RiskScoreModel, DecisionModel, AuditEventModel

test_engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture
def db():
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=test_engine)

def test_transaction_insert_read(db):
    tx = TransactionModel(transaction_id="TX-DB-1", amount=150.0, customer_id="CUST-1")
    db.add(tx)
    db.commit()
    db.refresh(tx)
    
    saved_tx = db.query(TransactionModel).filter(TransactionModel.transaction_id == "TX-DB-1").first()
    assert saved_tx is not None
    assert saved_tx.amount == 150.0

def test_decision_insert_read(db):
    tx = TransactionModel(transaction_id="TX-DB-2", amount=200.0, customer_id="CUST-2")
    db.add(tx)
    db.commit()
    
    decision = DecisionModel(transaction_id="TX-DB-2", decision="ALLOW", reason="Low risk")
    db.add(decision)
    db.commit()
    
    saved_dec = db.query(DecisionModel).filter(DecisionModel.transaction_id == "TX-DB-2").first()
    assert saved_dec is not None
    assert saved_dec.decision == "ALLOW"

def test_audit_insert_ordering(db):
    a1 = AuditEventModel(transaction_id="TX-DB-3", event_type="E1")
    a2 = AuditEventModel(transaction_id="TX-DB-3", event_type="E2")
    db.add(a1)
    db.add(a2)
    db.commit()
    
    events = db.query(AuditEventModel).filter(AuditEventModel.transaction_id == "TX-DB-3").order_by(AuditEventModel.timestamp.asc(), AuditEventModel.id.asc()).all()
    assert len(events) == 2
    assert events[0].event_type == "E1"
    assert events[1].event_type == "E2"

def test_rollback(db):
    try:
        tx = TransactionModel(transaction_id="TX-DB-4", amount=100.0, customer_id="CUST-4")
        db.add(tx)
        # Simulate error before commit
        raise ValueError("Simulated failure")
        db.commit()
    except ValueError:
        db.rollback()
        
    saved_tx = db.query(TransactionModel).filter(TransactionModel.transaction_id == "TX-DB-4").first()
    assert saved_tx is None

def test_graph_score_persistence(db):
    tx = TransactionModel(transaction_id="TX-DB-5", amount=300.0, customer_id="CUST-5")
    db.add(tx)
    db.commit()
    
    score = RiskScoreModel(
        transaction_id="TX-DB-5",
        ml_score=0.8,
        graph_score=0.9,
        model_version="xgb-ieeecis-v1"
    )
    db.add(score)
    db.commit()
    
    saved_score = db.query(RiskScoreModel).filter(RiskScoreModel.transaction_id == "TX-DB-5").first()
    assert saved_score is not None
    assert saved_score.graph_score == 0.9
    assert saved_score.ml_score == 0.8
    assert saved_score.model_version == "xgb-ieeecis-v1"
