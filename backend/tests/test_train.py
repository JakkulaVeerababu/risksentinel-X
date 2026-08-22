import pytest
import pandas as pd
from app.risk.train import perform_chronological_split
from app.risk.features import TIME_COL, ID_COL

def test_chronological_split():
    # Create mock data
    data = {
        TIME_COL: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
        ID_COL: ["ID1", "ID2", "ID3", "ID4", "ID5", "ID6", "ID7", "ID8", "ID9", "ID10"]
    }
    df = pd.DataFrame(data)
    
    train, val, test = perform_chronological_split(df)
    
    # Check sizes (70%, 15%, 15% of 10)
    assert len(train) == 7
    assert len(val) == 1
    assert len(test) == 2
    
    # Check no overlap
    assert set(train[ID_COL]).isdisjoint(set(val[ID_COL]))
    assert set(train[ID_COL]).isdisjoint(set(test[ID_COL]))
    assert set(val[ID_COL]).isdisjoint(set(test[ID_COL]))
    
    # Check chronology
    assert train[TIME_COL].max() <= val[TIME_COL].min()
    assert val[TIME_COL].max() <= test[TIME_COL].min()
