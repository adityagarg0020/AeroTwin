import numpy as np
import pandas as pd
from services.data_loader import manager
from services.feature_engineer import prepare_input, FEATURE_COLUMNS, ALL_FEATURES


def predict_all(input_dict):
    if not manager.is_loaded:
        manager.load_models()

    X = prepare_input(input_dict)
    X_scaled = manager.scaler.transform(X)

    predictions = {}
    for name, model in manager.models.items():
        pred = model.predict(X_scaled)[0]
        clean_name = name.replace('_model', '')
        key_map = {
            'compressorhealth': 'compressorHealth',
            'combustorhealth': 'combustorHealth',
            'turbinehealth': 'turbineHealth',
            'overallhealth': 'overallHealth',
            'thrust_n': 'thrust',
            'tsfc_g_n_s': 'tsfc'
        }
        predictions[key_map.get(clean_name, clean_name)] = float(pred)

    meta = {}
    for name, md in manager.metadata.items():
        clean_name = name.replace('_model', '')
        key_map = {
            'compressorhealth': 'compressorHealth',
            'combustorhealth': 'combustorHealth',
            'turbinehealth': 'turbineHealth',
            'overallhealth': 'overallHealth',
            'thrust_n': 'thrust',
            'tsfc_g_n_s': 'tsfc'
        }
        meta[key_map.get(clean_name, clean_name)] = {
            'testR2': md.get('test_r2', 0),
            'testMAE': md.get('test_mae', 0)
        }

    return {
        'predictions': predictions,
        'metadata': meta,
        'input': input_dict
    }


def predict_single(input_dict):
    result = predict_all(input_dict)
    return result['predictions']


def get_model_metadata():
    if not manager.is_loaded:
        manager.load_models()
    return manager.metadata


def simulate(input_dict):
    return predict_all(input_dict)
