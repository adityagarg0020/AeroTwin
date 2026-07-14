import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from services.data_loader import manager
from routers import predict, models_router, history, health, shap_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading AI models...")
    manager.load_models()
    print(f"Loaded {len(manager.models)} models successfully")
    yield
    print("Shutting down...")


app = FastAPI(
    title='AeroTwin AI',
    description='Physics-Informed Digital Twin for Four-Stage Turbojet Health Monitoring',
    version='1.0.0',
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(health.router)
app.include_router(predict.router)
app.include_router(models_router.router)
app.include_router(history.router)
app.include_router(shap_router.router)


@app.get('/')
def root():
    return {
        'name': 'AeroTwin AI',
        'version': '1.0.0',
        'status': 'operational',
        'endpoints': {
            'health': '/health',
            'models': '/models',
            'predict': '/predict',
            'predict/all': '/predict/all',
            'predict/simulate': '/predict/simulate',
            'history': '/history/{engine_id}',
            'history/range': '/history/range',
            'history/predict': '/history/predict/{engine_id}',
            'explain': '/explain/{model_name}'
        }
    }


if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=False)
