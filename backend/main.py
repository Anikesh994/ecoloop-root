import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure app package is importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import init_db
from app.routers import auth, returns, marketplace, p2p, credits, analytics, predictions


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    await init_db()
    print("[EcoLoop] Database initialized")
    yield
    # Shutdown
    print("[EcoLoop] Shutting down")


app = FastAPI(
    title="EcoLoop AI - Circular Commerce Platform",
    description="AWS-native intelligent ecosystem for sustainable product lifecycle management",
    version="2.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(returns.router)
app.include_router(marketplace.router)
app.include_router(p2p.router)
app.include_router(credits.router)
app.include_router(analytics.router)
app.include_router(predictions.router)


@app.get("/")
async def root():
    return {
        "service": "ecoloop-ai-backend",
        "version": "2.0.0",
        "status": "HEALTHY",
        "pillars": [
            "AI Routing Engine",
            "Smart Quality Grading",
            "Personalized Recommendations",
            "Green Credits & Incentives",
            "Peer-to-Peer Resale",
            "Predictive Return Prevention"
        ]
    }


@app.get("/health")
async def health():
    return {"status": "ok", "database": "connected", "environment": os.getenv("ENVIRONMENT", "dev")}