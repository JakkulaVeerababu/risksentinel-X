# IEEE-CIS Fraud Detection Feature Manifest definitions

TARGET_COL = 'isFraud'
TIME_COL = 'TransactionDT'
ID_COL = 'TransactionID'

# Sample subset of continuous features for baseline
CONTINUOUS_FEATURES = [
    'TransactionAmt',
    'dist1', 'dist2',
    'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14',
    'D1', 'D2', 'D3', 'D4', 'D5', 'D10', 'D11', 'D15'
]

# Sample subset of categorical features for baseline
CATEGORICAL_FEATURES = [
    'ProductCD',
    'card1', 'card2', 'card3', 'card4', 'card5', 'card6',
    'addr1', 'addr2',
    'P_emaildomain', 'R_emaildomain',
    'DeviceType', 'DeviceInfo'
]

# Engineered features
ENGINEERED_FEATURES = [
    'TransactionAmt_Log',
    'Transaction_Hour',
    'Transaction_DayOfWeek',
    'Missing_Feature_Count'
]

ALL_TRAINING_FEATURES = CONTINUOUS_FEATURES + CATEGORICAL_FEATURES + ENGINEERED_FEATURES
