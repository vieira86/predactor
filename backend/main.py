from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import tempfile
from pathlib import Path
import numpy as np
import pandas as pd
from rdkit import Chem
import joblib
from typing import Optional
import subprocess
from preprocessing import preprocess_molecule, is_active
import logging
from io import StringIO

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carregar o modelo e configurações


# Carregar o modelo e configurações
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "modelo_final_lgbm_semprocessar.pkl")

# MODEL_PATH = "C:/Users/Rafa/Desktop/predactors-funcionando/predactors-platform-new/backend/models/modelo_final_lgbm_semprocessar.pkl"


class MoleculeRequest(BaseModel):
    smiles: str

class PredictionResponse(BaseModel):
    # class_id: int
    prediction: float
    is_active: bool
    status:str
    # pdb_url: Optional[str] = None
    # pdb_content: Optional[str] = None
    # image_url: Optional[str] = None


@app.post("/predict", response_model=PredictionResponse)
async def predict_molecule(request: MoleculeRequest):
    try:
        logger.info(f"Received SMILES: {request.smiles}")

        # 1. Pré-processar a molécula
        logger.info("Pre-processing molecule...")
        mol, features = preprocess_molecule(request.smiles)
        logger.info(f"Features calculated: {features}")

        # 2. Converter para numpy array e garantir que seja 2D
        features_array = np.array(features)  # Converter o DataFrame para numpy array
        if features_array.ndim == 1:
            features_array = features_array.reshape(1, -1)  # Garantir que seja 2D
        logger.info(f"Features shape before prediction: {features_array.shape}")

        # 3. Fazer a predição
        logger.info("Loading model...")
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
            
        model = joblib.load(MODEL_PATH)
        logger.info("Making prediction...")
        prediction = float(model.predict(features_array)[0])
        active = is_active(prediction)
        logger.info(f"Prediction: {prediction}, Active: {active}")

        print(prediction)

        return PredictionResponse(
            prediction=prediction,
            
            status="Active" if active else "Inactive",
            is_active=active
        )

    except Exception as e:
        logger.error(f"Error in predict_molecule: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
