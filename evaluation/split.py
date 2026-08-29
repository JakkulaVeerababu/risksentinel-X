import pandas as pd
from typing import Tuple

def chronological_split(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Splits the dataframe 70/15/15 into train, validation, and heldout sets.
    Assumes dataframe is already chronologically sorted.
    """
    # Ensure it's sorted just in case
    df = df.sort_values("TransactionDT").reset_index(drop=True)
    
    n = len(df)
    train_end = int(n * 0.70)
    val_end = int(n * 0.85)
    
    train = df.iloc[:train_end].copy()
    validation = df.iloc[train_end:val_end].copy()
    heldout = df.iloc[val_end:].copy()
    
    # Verify overlap
    train_ids = set(train['TransactionID'])
    val_ids = set(validation['TransactionID'])
    heldout_ids = set(heldout['TransactionID'])
    
    if len(train_ids.intersection(val_ids)) > 0:
        raise ValueError("Overlap detected between Train and Validation")
    if len(train_ids.intersection(heldout_ids)) > 0:
        raise ValueError("Overlap detected between Train and Heldout")
    if len(val_ids.intersection(heldout_ids)) > 0:
        raise ValueError("Overlap detected between Validation and Heldout")
        
    return train, validation, heldout
