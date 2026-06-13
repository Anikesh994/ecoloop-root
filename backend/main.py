import os
import sys
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware  # <-- IMPORTANT NEW IMPORT
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Path safety baseline mapping for Windows systems
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from ai_processing import simulate_computer_vision_assessment, calculate_second_life_routing

load_dotenv()

app = FastAPI(
    title="EcoLoop AI - Second Life Commerce Engine",
    description="Production-grade reverse-logistics orchestration platform.",
    version="1.0.0"
)

# --- THE CORS FIX: ALLOW YOUR FRONTEND TO COMMUNICATE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits port 5500 to cleanly cross over and talk to port 8000
    allow_credentials=True,
    allow_methods=["*"],  # Allows POST requests
    allow_headers=["*"],  # Allows tracking headers
)

class ReturnInitiateRequest(BaseModel):
    userId: str = Field(..., examples=["usr_90210"])
    orderId: str = Field(..., examples=["ord_883912"])
    itemId: str = Field(..., examples=["itm_55410"])
    contentType: str = Field(..., examples=["image/jpeg"])

@app.get("/")
async def root_health_check():
    return {
        "status": "HEALTHY",
        "service": "ecoloop-backend-core",
        "aws_sync": "LOCAL_SIMULATION_ACTIVE"
    }

@app.post("/v1/returns/{return_id}/process")
async def process_return_ai(return_id: str, original_price: float):
    try:
        vision_results = simulate_computer_vision_assessment(image_key=f"raw-returns/{return_id}.jpg")
        final_assessment = calculate_second_life_routing(
            vision_data=vision_results, 
            original_price=original_price
        )
        return {
            "returnId": return_id,
            "processing_status": "SUCCESS",
            "payload": final_assessment
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pipeline Execution Failure: {str(e)}"
        )