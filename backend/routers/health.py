from fastapi import APIRouter
from services.data_loader import manager

router = APIRouter(prefix='/health', tags=['health'])


@router.get('')
def health_check():
    return {
        'status': 'operational',
        'version': '1.0.0',
        'modelsLoaded': len(manager.models),
        'modelsLoading': manager.is_loading,
        'name': 'AeroTwin AI - Physics-Informed Digital Twin'
    }
