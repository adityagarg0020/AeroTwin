import os
import joblib
import logging
import threading

logger = logging.getLogger(__name__)

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'ml', 'models')
if not os.path.exists(os.path.join(MODEL_DIR, 'scaler.pkl')):
    MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'ml', 'models')

MODEL_NAMES = [
    'compressorhealth', 'combustorhealth', 'turbinehealth',
    'overallhealth', 'thrust_n', 'tsfc_g_n_s'
]


class ModelManager:
    def __init__(self):
        self._models = {}
        self._scaler = None
        self._metadata = {}
        self._loaded = False
        self._loading = False

    def load_models(self):
        if self._loaded:
            return
        if self._loading:
            self._wait_for_loading()
            return
        self._loading = True
        try:
            scaler_path = os.path.join(MODEL_DIR, 'scaler.pkl')
            if os.path.exists(scaler_path):
                self._scaler = joblib.load(scaler_path)
                logger.info("Scaler loaded successfully")
            else:
                raise FileNotFoundError(f"Scaler not found at {scaler_path}")

            for name in MODEL_NAMES:
                model_path = os.path.join(MODEL_DIR, f'{name}_model.pkl')
                if os.path.exists(model_path):
                    model_info = joblib.load(model_path)
                    self._models[name] = model_info['model']
                    self._metadata[name] = {
                        'target': model_info['target'],
                        'train_r2': model_info.get('train_r2', None),
                        'test_r2': model_info.get('test_r2', None),
                        'test_mae': model_info.get('test_mae', None),
                        'n_features': model_info.get('n_features', 21)
                    }
                    logger.info(f"Model '{name}' loaded (R²={model_info.get('test_r2', 'N/A')})")
                else:
                    logger.warning(f"Model file not found: {model_path}")

            self._loaded = True
            logger.info(f"Loaded {len(self._models)} models")
        finally:
            self._loading = False

    def _wait_for_loading(self):
        import time
        while self._loading:
            time.sleep(0.1)

    def load_models_async(self):
        thread = threading.Thread(target=self.load_models, daemon=True)
        thread.start()

    @property
    def models(self):
        return self._models

    @property
    def scaler(self):
        return self._scaler

    @property
    def metadata(self):
        return self._metadata

    @property
    def is_loaded(self):
        return self._loaded

    @property
    def is_loading(self):
        return self._loading


manager = ModelManager()
