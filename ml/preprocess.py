import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

FEATURE_COLUMNS = [
    'EngineID', 'Cycle', 'Altitude_m', 'Mach', 'Tamb_K', 'Pamb_Pa',
    'RPM_rev_min', 'FuelFlow_kg_s',
    'P2_Pa', 'T2_K', 'P3_Pa', 'T3_K', 'P4_Pa', 'T4_K'
]

TARGET_COLUMNS = [
    'CompressorHealth', 'CombustorHealth', 'TurbineHealth',
    'OverallHealth', 'Thrust_N', 'TSFC_g_N_s'
]

DERIVED_FEATURES = [
    'PressureRatio', 'TemperatureRatio',
    'PressureDrop', 'TemperatureDrop',
    'FuelPerRPM', 'CycleNorm', 'AltitudeNorm'
]

ALL_FEATURES = FEATURE_COLUMNS + DERIVED_FEATURES


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    data = df.copy()
    data['PressureRatio'] = data['P3_Pa'] / (data['P2_Pa'] + 1e-8)
    data['TemperatureRatio'] = data['T3_K'] / (data['T2_K'] + 1e-8)
    data['PressureDrop'] = data['P3_Pa'] - data['P4_Pa']
    data['TemperatureDrop'] = data['T3_K'] - data['T4_K']
    data['FuelPerRPM'] = data['FuelFlow_kg_s'] / (data['RPM_rev_min'] + 1e-8)
    data['CycleNorm'] = data.groupby('EngineID')['Cycle'].transform(
        lambda x: x / x.max()
    )
    data['AltitudeNorm'] = data['Altitude_m'] / data['Altitude_m'].max()
    return data


def prepare_training_data(csv_path: str):
    df = pd.read_csv(csv_path)
    df_eng = engineer_features(df)

    X = df_eng[ALL_FEATURES].values
    y = {}
    for t in TARGET_COLUMNS:
        y[t] = df_eng[t].values

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X_scaled, y, scaler
