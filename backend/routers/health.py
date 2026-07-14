from fastapi import APIRouter
from services.data_loader import manager

router = APIRouter(prefix='/health', tags=['health'])


@router.get('')
def health_check():
    if not manager.is_loaded:
        manager.load_models()
    return {
        'status': 'operational',
        'version': '1.0.0',
        'modelsLoaded': len(manager.models),
        'name': 'AeroTwin AI - Physics-Informed Digital Twin'
    }
