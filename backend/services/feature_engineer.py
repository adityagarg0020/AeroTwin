import numpy as np
import pandas as pd

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


def engineer_features(df):
    data = df.copy()
    data['PressureRatio'] = data['P3_Pa'] / (data['P2_Pa'] + 1e-8)
    data['TemperatureRatio'] = data['T3_K'] / (data['T2_K'] + 1e-8)
    data['PressureDrop'] = data['P3_Pa'] - data['P4_Pa']
    data['TemperatureDrop'] = data['T3_K'] - data['T4_K']
    data['FuelPerRPM'] = data['FuelFlow_kg_s'] / (data['RPM_rev_min'] + 1e-8)

    if 'CycleNorm' not in data.columns:
        if 'EngineID' in data.columns and len(data) > 1:
            data['CycleNorm'] = data.groupby('EngineID')['Cycle'].transform(
                lambda x: x / x.max()
            )
        else:
            data['CycleNorm'] = data['Cycle'] / 30.0

    if 'AltitudeNorm' not in data.columns:
        data['AltitudeNorm'] = data['Altitude_m'] / 13000.0

    return data


def prepare_input(input_dict):
    df = pd.DataFrame([input_dict])
    df_eng = engineer_features(df)
    return df_eng[ALL_FEATURES].values



