import pandas as pd
import logging
from pathlib import Path
import sys

logger = logging.getLogger(__name__)

def load_ieee_cis_dataset(raw_dir: Path) -> pd.DataFrame:
    """
    Loads and joins the IEEE-CIS Fraud Detection dataset.
    Requires train_transaction.csv and train_identity.csv to exist.
    """
    tx_file = raw_dir / "train_transaction.csv"
    id_file = raw_dir / "train_identity.csv"

    if not tx_file.exists() or not id_file.exists():
        logger.error(f"Dataset missing. Please download IEEE-CIS train_transaction.csv and train_identity.csv to {raw_dir}")
        raise FileNotFoundError("IEEE-CIS Dataset files are missing.")

    logger.info("Loading train_transaction.csv...")
    # Load transactions
    df_tx = pd.read_csv(tx_file)
    
    logger.info("Loading train_identity.csv...")
    # Load identities
    df_id = pd.read_csv(id_file)

    # Validate required columns
    required_tx_cols = {'TransactionID', 'TransactionDT', 'isFraud'}
    if not required_tx_cols.issubset(df_tx.columns):
        raise ValueError(f"train_transaction.csv missing required columns: {required_tx_cols - set(df_tx.columns)}")
    
    if 'TransactionID' not in df_id.columns:
        raise ValueError("train_identity.csv missing 'TransactionID' column.")

    # Check for duplicate keys before merge
    if df_tx['TransactionID'].duplicated().any():
        logger.warning("train_transaction.csv contains duplicate TransactionIDs")
        df_tx = df_tx.drop_duplicates(subset=['TransactionID'])
        
    if df_id['TransactionID'].duplicated().any():
        logger.warning("train_identity.csv contains duplicate TransactionIDs")
        df_id = df_id.drop_duplicates(subset=['TransactionID'])

    initial_rows = len(df_tx)
    
    logger.info("Joining transaction and identity tables...")
    # Join on TransactionID
    df = df_tx.merge(df_id, on='TransactionID', how='left')
    
    if len(df) != initial_rows:
        raise ValueError(f"Join exploded! Rows before: {initial_rows}, rows after: {len(df)}")
        
    # Sort chronologically
    logger.info("Sorting chronologically by TransactionDT...")
    df = df.sort_values("TransactionDT").reset_index(drop=True)
    
    return df
