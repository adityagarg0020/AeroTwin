from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from services.engine import predict_all, predict_single, simulate, get_model_metadata
from services.data_loader import manager

router = APIRouter(prefix='/predict', tags=['predict'])


class EngineInput(BaseModel):
    EngineID: int = Field(1, ge=1, le=10)
    Cycle: int = Field(1, ge=1, le=300)
    Altitude_m: float = Field(0.0)
    Mach: float = Field(0.0)
    Tamb_K: float = Field(288.15)
    Pamb_Pa: float = Field(101325.0)
    RPM_rev_min: float = Field(30000.0)
    FuelFlow_kg_s: float = Field(0.5)
    P2_Pa: float = Field(100000.0)
    T2_K: float = Field(300.0)
    P3_Pa: float = Field(300000.0)
    T3_K: float = Field(800.0)
    P4_Pa: float = Field(100000.0)
    T4_K: float = Field(700.0)


class SimulateInput(EngineInput):
    pass


class PredictionResponse(BaseModel):
    predictions: dict
    metadata: dict
    input: dict


@router.post('', response_model=PredictionResponse)
def predict(data: EngineInput):
    try:
        return predict_all(data.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/all', response_model=PredictionResponse)
def predict_all_endpoint(data: EngineInput):
    try:
        return predict_all(data.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/simulate', response_model=PredictionResponse)
def simulate_endpoint(data: SimulateInput):
    try:
        return simulate(data.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/health')
def predict_health():
    if not manager.is_loaded:
        manager.load_models()
    return {'status': 'ready', 'models_loaded': len(manager.models)}
