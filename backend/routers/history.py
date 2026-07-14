import os
import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException, Query, Path
from services.engine import predict_all
from services.feature_engineer import FEATURE_COLUMNS

router = APIRouter(prefix='/history', tags=['history'])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
CSV_PATH = os.path.join(DATA_DIR, 'turbojet_complete_dataset.csv')
TRAIN_PATH = os.path.join(DATA_DIR, 'train.csv')
GROUND_TRUTH_PATH = os.path.join(DATA_DIR, 'ground_truth.csv')


def _load_complete_data():
    if not os.path.exists(CSV_PATH):
        raise HTTPException(status_code=404, detail='Dataset not found')
    df = pd.read_csv(CSV_PATH)
    return df


def _load_ground_truth():
    if not os.path.exists(GROUND_TRUTH_PATH):
        raise HTTPException(status_code=404, detail='Ground truth not found')
    df = pd.read_csv(GROUND_TRUTH_PATH)
    return df


@router.get('/{engine_id}')
def get_engine_history(
    engine_id: int = Path(..., ge=1, le=10),
    start_cycle: int = Query(1, ge=1),
    end_cycle: int = Query(300, ge=1, le=300)
):
    df = _load_complete_data()
    engine_data = df[(df['EngineID'] == engine_id) &
                     (df['Cycle'] >= start_cycle) &
                     (df['Cycle'] <= end_cycle)]
    if engine_data.empty:
        raise HTTPException(status_code=404, detail=f'No data for engine {engine_id}')
    records = engine_data.to_dict(orient='records')
    for r in records:
        for k, v in r.items():
            if isinstance(v, (np.integer,)):
                r[k] = int(v)
            elif isinstance(v, (np.floating,)):
                r[k] = float(v)
    return {
        'engineId': engine_id,
        'count': len(records),
        'records': records,
        'startCycle': start_cycle,
        'endCycle': end_cycle
    }


@router.get('/range')
def get_cycle_range(
    engine_id: int = Query(1, ge=1, le=10),
    cycle: int = Query(1, ge=1, le=300)
):
    df = _load_complete_data()
    row = df[(df['EngineID'] == engine_id) & (df['Cycle'] == cycle)]
    if row.empty:
        raise HTTPException(status_code=404, detail=f'No data for engine {engine_id} cycle {cycle}')
    record = row.iloc[0].to_dict()
    for k, v in record.items():
        if isinstance(v, (np.integer,)):
            record[k] = int(v)
        elif isinstance(v, (np.floating,)):
            record[k] = float(v)
    return {'engineId': engine_id, 'cycle': cycle, 'data': record}


@router.get('/predict/{engine_id}')
def get_prediction(
    engine_id: int = Path(..., ge=1, le=10),
    cycle: int = Query(1, ge=1, le=300)
):
    df = _load_complete_data()
    row = df[(df['EngineID'] == engine_id) & (df['Cycle'] == cycle)]
    if row.empty:
        raise HTTPException(status_code=404, detail=f'No data for engine {engine_id} cycle {cycle}')
    input_data = {col: row.iloc[0][col] for col in FEATURE_COLUMNS}
    result = predict_all(input_data)
    actual = None
    gt_df = _load_ground_truth()
    gt_row = gt_df[(gt_df['EngineID'] == engine_id) & (gt_df['Cycle'] == cycle)]
    if not gt_row.empty:
        actual = gt_row.iloc[0].to_dict()
        for k, v in actual.items():
            if isinstance(v, (np.integer,)):
                actual[k] = int(v)
            elif isinstance(v, (np.floating,)):
                actual[k] = float(v)
    return {
        'engineId': engine_id,
        'cycle': cycle,
        'predicted': result,
        'actual': actual
    }
