from fastapi import APIRouter
from services.engine import get_model_metadata
from services.data_loader import manager

router = APIRouter(prefix='/models', tags=['models'])


@router.get('')
def list_models():
    if not manager.is_loaded:
        manager.load_models()
    meta = get_model_metadata()
    result = []
    for name, md in meta.items():
        result.append({
            'id': name,
            'target': md.get('target', name),
            'testR2': md.get('test_r2', 0),
            'testMAE': md.get('test_mae', 0),
            'nFeatures': md.get('n_features', 21)
        })
    return {'models': result, 'count': len(result)}


@router.get('/status')
def model_status():
    if not manager.is_loaded:
        manager.load_models()
    return {
        'loaded': manager.is_loaded,
        'count': len(manager.models),
        'models': list(manager.metadata.keys())
    }
