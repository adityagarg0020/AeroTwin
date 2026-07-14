import numpy as np
import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error
from sklearn.linear_model import Ridge
from preprocess import prepare_training_data, TARGET_COLUMNS

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'turbojet_complete_dataset.csv')


def train_models():
    print("Loading and engineering features...")
    X_scaled, y_dict, scaler = prepare_training_data(CSV_PATH)
    n_features = X_scaled.shape[1]
    print(f"Feature matrix shape: {X_scaled.shape}")
    print(f"Features used: {n_features}")

    models = {}
    results = {}

    for target in TARGET_COLUMNS:
        print(f"\n{'='*50}")
        print(f"Training model for: {target}")

        y = y_dict[target]
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )

        model = RandomForestRegressor(
            n_estimators=500,
            max_depth=25,
            min_samples_leaf=2,
            min_samples_split=5,
            n_jobs=-1,
            random_state=42
        )
        model.fit(X_train, y_train)

        y_pred_train = model.predict(X_train)
        y_pred_test = model.predict(X_test)

        train_r2 = r2_score(y_train, y_pred_train)
        test_r2 = r2_score(y_test, y_pred_test)
        test_mae = mean_absolute_error(y_test, y_pred_test)

        print(f"  Train R²: {train_r2:.4f}")
        print(f"  Test R²:  {test_r2:.4f}")
        print(f"  Test MAE: {test_mae:.6f}")

        model_path = os.path.join(MODEL_DIR, f'{target.lower()}_model.pkl')

        model_info = {
            'model': model,
            'target': target,
            'train_r2': train_r2,
            'test_r2': test_r2,
            'test_mae': test_mae,
            'n_features': n_features
        }
        joblib.dump(model_info, model_path)
        models[target] = model
        results[target] = {
            'train_r2': float(f"{train_r2:.4f}"),
            'test_r2': float(f"{test_r2:.4f}"),
            'test_mae': float(f"{test_mae:.6f}"),
            'n_features': n_features
        }

    scaler_path = os.path.join(MODEL_DIR, 'scaler.pkl')
    joblib.dump(scaler, scaler_path)
    print(f"\nScaler saved to {scaler_path}")

    with open(os.path.join(MODEL_DIR, 'training_results.txt'), 'w') as f:
        f.write("AeroTwin AI - Model Training Results\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Total samples: {X_scaled.shape[0]}\n")
        f.write(f"Features: {n_features}\n\n")
        for target, res in results.items():
            f.write(f"{target}:\n")
            f.write(f"  Train R²: {res['train_r2']}\n")
            f.write(f"  Test R²:  {res['test_r2']}\n")
            f.write(f"  Test MAE: {res['test_mae']}\n\n")

    print("\n" + "=" * 50)
    print("TRAINING COMPLETE")
    print("=" * 50)
    for target, res in results.items():
        print(f"  {target}: R²={res['test_r2']}, MAE={res['test_mae']}")

    return models, results


if __name__ == '__main__':
    train_models()
