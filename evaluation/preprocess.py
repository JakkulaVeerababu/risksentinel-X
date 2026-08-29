import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OrdinalEncoder
from sklearn.pipeline import Pipeline
from typing import List, Tuple

def build_preprocessor(numeric_cols: List[str], categorical_cols: List[str]) -> ColumnTransformer:
    """
    Builds the sklearn preprocessing pipeline.
    Numeric: Median imputation
    Categorical: Constant imputation ("__MISSING__") + OrdinalEncoding
    """
    
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median'))
    ])
    
    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='constant', fill_value='__MISSING__')),
        ('encoder', OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1))
    ])
    
    preprocessor = ColumnTransformer([
        ('num', num_pipeline, numeric_cols),
        ('cat', cat_pipeline, categorical_cols)
    ], remainder='drop') # Drop any columns not explicitly specified
    
    return preprocessor

def get_feature_columns(df: pd.DataFrame) -> Tuple[List[str], List[str]]:
    """
    Infers numeric and categorical columns from the dataframe.
    Ignores target (isFraud) and identifier (TransactionID).
    """
    ignore_cols = {'isFraud', 'TransactionID'}
    features = [c for c in df.columns if c not in ignore_cols]
    
    # We will treat object/string columns as categorical
    # and numeric types as numeric.
    numeric_cols = []
    categorical_cols = []
    
    for col in features:
        if pd.api.types.is_numeric_dtype(df[col]):
            numeric_cols.append(col)
        else:
            categorical_cols.append(col)
            
    return numeric_cols, categorical_cols
