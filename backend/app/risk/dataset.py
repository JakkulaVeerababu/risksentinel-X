import pandas as pd
import numpy as np
from pathlib import Path

def reduce_mem_usage(df: pd.DataFrame, verbose: bool = True) -> pd.DataFrame:
    """Iterate through all columns of a dataframe and modify the data type to reduce memory usage."""
    numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
    start_mem = df.memory_usage().sum() / 1024**2
    
    for col in df.columns:
        col_type = df[col].dtypes
        if col_type in numerics:
            c_min = df[col].min()
            c_max = df[col].max()
            if str(col_type)[:3] == 'int':
                if c_min > np.iinfo(np.int8).min and c_max < np.iinfo(np.int8).max:
                    df[col] = df[col].astype(np.int8)
                elif c_min > np.iinfo(np.int16).min and c_max < np.iinfo(np.int16).max:
                    df[col] = df[col].astype(np.int16)
                elif c_min > np.iinfo(np.int32).min and c_max < np.iinfo(np.int32).max:
                    df[col] = df[col].astype(np.int32)
                elif c_min > np.iinfo(np.int64).min and c_max < np.iinfo(np.int64).max:
                    df[col] = df[col].astype(np.int64)  
            else:
                if c_min > np.finfo(np.float16).min and c_max < np.finfo(np.float16).max:
                    df[col] = df[col].astype(np.float16)
                elif c_min > np.finfo(np.float32).min and c_max < np.finfo(np.float32).max:
                    df[col] = df[col].astype(np.float32)
                else:
                    df[col] = df[col].astype(np.float64)
                    
    end_mem = df.memory_usage().sum() / 1024**2
    if verbose:
        print(f'Memory usage decreased to {end_mem:5.2f} Mb ({(100 * (start_mem - end_mem) / start_mem):.1f}% reduction)')
    return df

def load_and_merge_data(transaction_path: str, identity_path: str) -> pd.DataFrame:
    """Loads and merges the IEEE-CIS transaction and identity data safely."""
    tx_path = Path(transaction_path)
    id_path = Path(identity_path)
    
    if not tx_path.exists():
        raise FileNotFoundError(f"Transaction file not found: {tx_path}")
    if not id_path.exists():
        raise FileNotFoundError(f"Identity file not found: {id_path}")

    # Load with minimal memory optimizations
    df_tx = pd.read_csv(tx_path)
    df_id = pd.read_csv(id_path)
    
    # Ensure TransactionID uniqueness
    if df_tx['TransactionID'].duplicated().any():
        raise ValueError("Transaction dataset contains duplicate TransactionIDs")

    # Left join to preserve all transactions, even without identity info
    df_merged = df_tx.merge(df_id, on='TransactionID', how='left')
    
    # Ensure row count didn't expand unexpectedly
    assert len(df_merged) == len(df_tx), "Merge expanded row count unexpectedly"
    
    # Reduce memory
    df_merged = reduce_mem_usage(df_merged)
    
    return df_merged
