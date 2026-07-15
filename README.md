# AeroTwin AI

**Physics-Informed Digital Twin for Four-Stage Turbojet Health Monitoring**

A full-stack AI application that provides a digital twin for a four-stage turbojet engine. Uses machine learning to predict engine health metrics from operational sensor data, with interactive 3D visualization, predictive analytics, SHAP-based explainability, fleet management, and flight simulation.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.12, FastAPI, Uvicorn, scikit-learn, pandas, numpy, joblib |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, Three.js / React Three Fiber, Framer Motion, Recharts, Zustand, TanStack React Query |
| **ML/AI** | RandomForestRegressor, StandardScaler, joblib, custom SHAP-like explainability |
| **Infrastructure** | Docker, Render, Vercel |

---

## Project Structure

```
turbo engine/
│
├── backend/                      # FastAPI Python backend
│   ├── main.py                   # App entry point, CORS, routers
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile                # Docker build config
│   ├── routers/                  # API route handlers
│   │   ├── health.py             # GET /health
│   │   ├── predict.py            # POST /predict, /predict/all, /predict/simulate
│   │   ├── models_router.py      # GET /models, /models/status
│   │   ├── history.py            # GET /history/{id}, /history/range
│   │   └── shap_router.py        # GET /explain/{model_name}
│   └── services/                 # Business logic
│       ├── data_loader.py        # ModelManager - async .pkl loader
│       ├── feature_engineer.py   # Feature engineering pipeline
│       └── engine.py             # predict_all, predict_single, simulate
│
├── frontend/                     # React + Vite frontend
│   ├── package.json              # Dependencies & scripts
│   ├── vite.config.ts            # Vite config with dev proxy
│   ├── vercel.json               # Vercel deployment config
│   ├── index.html                # HTML entry point
│   └── src/
│       ├── main.tsx              # React entry
│       ├── App.tsx               # Root component with routing
│       ├── index.css             # Tailwind + custom space theme
│       ├── api/client.ts         # API client (fetch, predict, etc.)
│       ├── types/index.ts        # TypeScript interfaces
│       ├── store/engineStore.ts  # Zustand state management
│       ├── utils/                # colors.ts, formatters.ts
│       ├── hooks/useSound.ts     # Sound effect hook
│       ├── pages/                # 11 page components
│       │   ├── Landing.tsx
│       │   ├── Dashboard.tsx
│       │   ├── DigitalTwin.tsx
│       │   ├── Predictions.tsx
│       │   ├── Analytics.tsx
│       │   ├── FlightSimPage.tsx
│       │   ├── AICopilotPage.tsx
│       │   ├── Fleet.tsx
│       │   ├── Maintenance.tsx
│       │   ├── ModelComparison.tsx
│       │   └── Settings.tsx
│       └── components/
│           ├── layout/           # Navigation, PageTransition, GlassPanel, SkeletonLoader
│           ├── ui/               # Button, Card, Badge, Slider, Tooltip, AnimatedCounter
│           ├── three/            # 3D engine (TurbojetEngine, Particles, HeatMap, etc.)
│           └── dashboard/        # HealthCard, TelemetryPanel, ShapExplainer, etc.
│
├── ml/                           # ML training pipeline
│   ├── preprocess.py             # Feature engineering
│   ├── train.py                  # Train 6 RandomForest models
│   └── models/                   # Trained .pkl artifacts
│       ├── scaler.pkl
│       ├── compressorhealth_model.pkl
│       ├── combustorhealth_model.pkl
│       ├── turbinehealth_model.pkl
│       ├── overallhealth_model.pkl
│       ├── thrust_n_model.pkl
│       └── tsfc_g_n_s_model.pkl
│
├── train.csv                     # Training sensor data (241 rows)
├── test.csv                      # Test sensor data (61 rows)
├── ground_truth.csv              # Ground truth health targets
├── turbojet_complete_dataset.csv # Full combined dataset (300 rows)
│
├── start_all.ps1                 # Start backend + frontend
├── start_backend.ps1             # Start backend only
├── start_frontend.ps1            # Start frontend only
├── deploy.ps1                    # Deployment instructions
└── render.yaml                   # Render.com backend config
```

---

## Dataset

### Sensor / Operational Data

| Column | Description | Units |
|--------|-------------|-------|
| `EngineID` | Engine identifier (1-10) | — |
| `Cycle` | Operational cycle number | — |
| `Altitude_m` | Flight altitude | m |
| `Mach` | Mach number | — |
| `Tamb_K` | Ambient temperature | K |
| `Pamb_Pa` | Ambient pressure | Pa |
| `RPM_rev_min` | Rotational speed | rev/min |
| `FuelFlow_kg_s` | Fuel flow rate | kg/s |
| `P2_Pa` | Compressor inlet pressure | Pa |
| `T2_K` | Compressor inlet temperature | K |
| `P3_Pa` | Combustor inlet pressure | Pa |
| `T3_K` | Combustor inlet temperature | K |
| `P4_Pa` | Turbine inlet pressure | Pa |
| `T4_K` | Turbine inlet temperature | K |

### Engineered Features

| Feature | Formula |
|---------|---------|
| `PressureRatio` | P3 / P2 |
| `TemperatureRatio` | T3 / T2 |
| `PressureDrop` | P3 - P4 |
| `TemperatureDrop` | T3 - T4 |
| `FuelPerRPM` | FuelFlow / RPM |
| `CycleNorm` | Cycle / max(Cycle) per engine |
| `AltitudeNorm` | Altitude / max(Altitude) |

### Target Variables

| Column | Description | Range |
|--------|-------------|-------|
| `CompressorHealth` | Compressor health index | 0-1 |
| `CombustorHealth` | Combustor health index | 0-1 |
| `TurbineHealth` | Turbine health index | 0-1 |
| `OverallHealth` | Overall engine health index | 0-1 |
| `Thrust_N` | Engine thrust | N |
| `TSFC_g_N_s` | Specific fuel consumption | g/(N·s) |

---

## Model Performance

| Model | Test R² | Test MAE |
|-------|---------|----------|
| CompressorHealth | 0.9450 | 0.01319 |
| CombustorHealth | 0.9418 | 0.00551 |
| TurbineHealth | 0.8469 | 0.01502 |
| OverallHealth | 0.9621 | 0.00713 |
| Thrust_N | 0.9705 | 2176.06 N |
| TSFC_g_N_s | 0.9807 | 0.00074 g/(N·s) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root info, available endpoints |
| GET | `/health` | System status & model load state |
| GET | `/models` | List ML models with R² and MAE |
| GET | `/models/status` | Model load status |
| POST | `/predict` | Run all 6 ML models on input |
| POST | `/predict/all` | Same as above |
| POST | `/predict/simulate` | Simulation mode |
| GET | `/predict/health` | Prediction readiness |
| GET | `/history/{engine_id}` | Historical sensor data |
| GET | `/history/range` | Single cycle data point |
| GET | `/history/predict/{engine_id}` | Prediction + ground truth |
| GET | `/explain/{model_name}` | SHAP-like feature importance |

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- npm

### Local Development

**Start everything:**
```powershell
.\start_all.ps1
```

**Or start individually:**
```powershell
.\start_backend.ps1     # http://localhost:8000
.\start_frontend.ps1    # http://localhost:5173
```

**Manually:**

```powershell
# Backend
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Frontend
cd frontend
npm run dev
```

API docs available at `http://localhost:8000/docs`

### Deployment

- **Frontend**: Deploy to Vercel (`cd frontend && npm run build`, set `VITE_API_URL`)
- **Backend**: Deploy to Render via `render.yaml` or `Dockerfile`

---

## Features

- **Interactive 3D Engine** — Exploded view, X-ray mode, heatmap overlay, particle effects (airflow, smoke, fire)
- **Predictive Analytics** — Real-time health predictions across 6 ML models
- **SHAP Explainability** — Model-agnostic feature importance for every prediction
- **Fleet Management** — Monitor multiple engines, compare health metrics
- **Maintenance Scheduling** — Degradation timeline with automated recommendations
- **Flight Simulation** — Real-time telemetry visualization
- **AI Copilot** — Interactive assistant for engine insights
- **Space Theme UI** — Glass-morphism, glow effects, HUD elements, scanline overlay
