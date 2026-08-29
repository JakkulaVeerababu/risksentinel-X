import pytest
import pandas as pd
import numpy as np

# Skip this entire module if the evaluation package is not installed (e.g. in the production container)
pytest.importorskip("evaluation.split", reason="evaluation module is not shipped in production container")
pytest.importorskip("evaluation.preprocess", reason="evaluation module is not shipped in production container")

from evaluation.split import chronological_split
from evaluation.preprocess import build_preprocessor, get_feature_columns
from app.risk.inference import RiskModelService, ModelArtifactError

# ML-T01: Chronological split
def test_chronological_split():
    df = pd.DataFrame({
        'TransactionID': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'TransactionDT': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    })
    # Mix it up to test sorting
    df = df.sample(frac=1, random_state=42)
    
    train, val, heldout = chronological_split(df)
    
    assert len(train) == 7
    assert len(val) == 1
    assert len(heldout) == 2
    
    assert train['TransactionDT'].max() < val['TransactionDT'].min()
    assert val['TransactionDT'].max() < heldout['TransactionDT'].min()

# ML-T02: No TransactionID overlap
def test_no_overlap_in_splits():
    df = pd.DataFrame({
        'TransactionID': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'TransactionDT': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    })
    train, val, heldout = chronological_split(df)
    
    t_set = set(train['TransactionID'])
    v_set = set(val['TransactionID'])
    h_set = set(heldout['TransactionID'])
    
    assert len(t_set.intersection(v_set)) == 0
    assert len(t_set.intersection(h_set)) == 0
    assert len(v_set.intersection(h_set)) == 0

# ML-T03 & ML-T04: isFraud and TransactionID excluded
def test_feature_columns_excludes_targets_and_ids():
    df = pd.DataFrame({
        'TransactionID': [1, 2],
        'isFraud': [0, 1],
        'amount': [10.0, 20.0],
        'category': ['A', 'B']
    })
    num_cols, cat_cols = get_feature_columns(df)
    
    assert 'TransactionID' not in num_cols and 'TransactionID' not in cat_cols
    assert 'isFraud' not in num_cols and 'isFraud' not in cat_cols
    assert 'amount' in num_cols
    assert 'category' in cat_cols

# ML-T05: Preprocessing fit only on train and ML-T10: unknown category
def test_preprocessor_fit_transform():
    train_df = pd.DataFrame({
        'amount': [10.0, np.nan, 30.0],
        'category': ['A', 'B', np.nan]
    })
    num_cols = ['amount']
    cat_cols = ['category']
    preprocessor = build_preprocessor(num_cols, cat_cols)
    
    X_train = preprocessor.fit_transform(train_df)
    
    val_df = pd.DataFrame({
        'amount': [np.nan],
        'category': ['C'] # UNKNOWN category
    })
    
    X_val = preprocessor.transform(val_df)
    
    # Train test: Median of 10 and 30 is 20
    assert X_train[1, 0] == 20.0 
    
    # Val test: Median imputed based on train (20.0), unknown category mapped to -1
    assert X_val[0, 0] == 20.0
    assert X_val[0, 1] == -1.0 # Unknown category fallback

# ML-T07: Missing model artifact fails explicitly
def test_missing_artifact_raises_error():
    service = RiskModelService(version="nonexistent-version")
    
    with pytest.raises(ModelArtifactError):
        service.load_model()
        
    with pytest.raises(ModelArtifactError):
        service.score({"amount": 100})
