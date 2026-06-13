from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.database import get_db
from app.models import ReturnPrediction, User
from app.security import get_current_user
from app.services.ai_service import predict_return_risk

router = APIRouter(prefix="/api/v1/predictions", tags=["Return Prevention"])


class PredictionRequest(BaseModel):
    product_name: str
    category: str = "Electronics"
    price: float = 10000


@router.post("/check")
async def check_return_risk(
    req: PredictionRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = predict_return_risk(req.category, req.price)

    prediction = ReturnPrediction(
        user_id=user.id,
        product_name=req.product_name,
        category=req.category,
        predicted_return_probability=result["risk_score"],
        risk_factors=result["risk_factors"],
        recommendation=result["recommendation"]
    )
    db.add(prediction)
    await db.commit()

    return {
        "product_name": req.product_name,
        "category": req.category,
        "price": req.price,
        "risk_score": result["risk_score"],
        "risk_factors": result["risk_factors"],
        "recommendation": result["recommendation"],
        "potential_savings": result["potential_savings"]
    }


@router.get("/history")
async def prediction_history(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ReturnPrediction)
        .where(ReturnPrediction.user_id == user.id)
        .order_by(ReturnPrediction.created_at.desc())
        .limit(limit)
    )
    preds = result.scalars().all()
    return [
        {
            "id": p.id,
            "product_name": p.product_name,
            "category": p.category,
            "risk_score": p.predicted_return_probability,
            "risk_factors": p.risk_factors,
            "recommendation": p.recommendation,
            "outcome": p.outcome,
            "created_at": p.created_at.isoformat()
        }
        for p in preds
    ]