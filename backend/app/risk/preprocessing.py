import pandas as pd
import numpy as np
from typing import Dict, List, Optional
import joblib

from app.risk.features import CONTINUOUS_FEATURES, CATEGORICAL_FEATURES, ENGINEERED_FEATURES, ALL_TRAINING_FEATURES

class FraudPreprocessor:
    def __init__(self):
        # We will use frequency encoding for high-cardinality categorical variables
        self.freq_encoding_maps: Dict[str, pd.Series] = {}
        # Keep track of fit status
        self.is_fitted = False
        self.feature_manifest = ALL_TRAINING_FEATURES.copy()

    def _feature_engineering(self, df: pd.DataFrame) -> pd.DataFrame:
        """Applies mathematical and date transformations."""
        X = df.copy()
        
        # 1. Log transform amount
        if 'TransactionAmt' in X.columns:
            X['TransactionAmt_Log'] = np.log1p(X['TransactionAmt'].fillna(0))
        else:
            X['TransactionAmt_Log'] = 0.0
            
        # 2. Time components (TransactionDT is a timedelta from a reference datetime)
        # Assuming TransactionDT is in seconds
        if 'TransactionDT' in X.columns:
            # roughly days
            days = X['TransactionDT'] / (3600 * 24)
            X['Transaction_DayOfWeek'] = np.floor(days) % 7
            X['Transaction_Hour'] = np.floor((X['TransactionDT'] / 3600) % 24)
        else:
            X['Transaction_DayOfWeek'] = -1
            X['Transaction_Hour'] = -1
            
        # 3. Missing count
        # Count NaNs across continuous and categorical (before any imputation)
        features_to_check = [c for c in CONTINUOUS_FEATURES + CATEGORICAL_FEATURES if c in X.columns]
        if features_to_check:
            X['Missing_Feature_Count'] = X[features_to_check].isnull().sum(axis=1)
        else:
            X['Missing_Feature_Count'] = 0
            
        return X

    def fit(self, X_train: pd.DataFrame) -> None:
        """Fit preprocessing statistics only on the training split to avoid leakage."""
        self.freq_encoding_maps = {}
        
        # Calculate frequency mapping for categorical features
        for col in CATEGORICAL_FEATURES:
            if col in X_train.columns:
                # Frequency encode (count)
                freq_series = X_train[col].value_counts(dropna=False)
                # Normalize to frequency percentage to handle varying dataset sizes
                freq_series = freq_series / len(X_train)
                self.freq_encoding_maps[col] = freq_series
                
        self.is_fitted = True

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        """Transform data safely for inference."""
        if not self.is_fitted:
            raise ValueError("Preprocessor has not been fitted yet.")
            
        # 1. Apply Engineering
        X_trans = self._feature_engineering(X)
        
        # 2. Apply Frequency Encoding to Categoricals
        for col in CATEGORICAL_FEATURES:
            if col in X_trans.columns and col in self.freq_encoding_maps:
                # Map using fit statistics. Fill unknown categories with a very low frequency or 0
                mapping = self.freq_encoding_maps[col]
                X_trans[col] = X_trans[col].map(mapping).fillna(0.0)
            else:
                # If column is completely missing in inference payload
                X_trans[col] = 0.0
                
        # 3. Ensure all continuous features exist
        for col in CONTINUOUS_FEATURES:
            if col not in X_trans.columns:
                X_trans[col] = np.nan
                
        # Return exact columns in exact order
        return X_trans[self.feature_manifest]

    def save(self, filepath: str) -> None:
        joblib.dump(self, filepath)
        
    @classmethod
    def load(cls, filepath: str) -> 'FraudPreprocessor':
        return joblib.load(filepath)
