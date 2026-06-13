import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from app.database import get_db
from app.models import ReturnItem, WaitlistEntry, User, GreenCreditTransaction
from app.security import get_current_user
from app.services.ai_service import (
    simulate_rekognition_grading, compute_grade,
    compute_routing, compute_pricing, compute_green_credits
)

router = APIRouter(prefix="/api/v1/returns", tags=["Returns"])


class ReturnResponse(BaseModel):
    return_id: str
    status: str
    assigned_grade: Optional[str] = None
    routing_decision: Optional[str] = None
    damage_score: Optional[float] = None
    suggested_price: Optional[float] = None
    green_credits_earned: int = 0
    original_price: float
    product_name: str
    category: str
    vision_data: Optional[dict] = None
    notification: Optional[dict] = None


@router.post("/", response_model=ReturnResponse)
async def create_return(
    original_price: float = Form(...),
    product_name: str = Form("Returned Product"),
    category: str = Form("Electronics"),
    images: list[UploadFile] = File(default=[]),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return_id = "RET-" + str(uuid.uuid4())[:8].upper()
    image_keys = [f"uploads/{return_id}/{img.filename}" for img in images]

    # AI Grading (simulated Rekognition)
    vision_result = simulate_rekognition_grading(image_keys, category)
    damage_score = vision_result["damage_score"]
    grade = compute_grade(damage_score)
    routing = compute_routing(grade, category)
    suggested_price = compute_pricing(original_price, damage_score)
    credits = compute_green_credits(original_price, routing)

    # Save to DB
    item = ReturnItem(
        return_id=return_id,
        seller_id=user.id,
        product_name=product_name,
        category=category,
        original_price=original_price,
        suggested_price=suggested_price,
        assigned_grade=grade,
        routing_decision=routing,
        green_credits_earned=credits,
        damage_score=damage_score,
        image_keys=",".join(image_keys),
        vision_data=vision_result,
        status="available" if routing in ("RESELL", "REFURBISH") else "routed"
    )
    db.add(item)

    # Award green credits
    user.green_credits_balance += credits
    credit_tx = GreenCreditTransaction(
        user_id=user.id,
        amount=credits,
        reason=f"RETURN_SUBMITTED_{routing}",
        reference_id=item.id,
        balance_after=user.green_credits_balance
    )
    db.add(credit_tx)

    # Check waitlist match
    notification = None
    waitlist_result = await db.execute(
        select(WaitlistEntry).where(
            WaitlistEntry.requested_grade == grade,
            WaitlistEntry.status == "waiting"
        ).limit(1)
    )
    match = waitlist_result.scalar_one_or_none()
    if match:
        match.status = "notified"
        match.notified_at = datetime.utcnow()
        notification = {
            "type": "WAITLIST_MATCH",
            "message": f"A {grade} item matching your criteria is now available!",
            "buyer_email": match.buyer_email,
            "item_id": return_id,
            "price": suggested_price
        }

    await db.commit()

    return ReturnResponse(
        return_id=return_id,
        status=item.status,
        assigned_grade=grade,
        routing_decision=routing,
        damage_score=damage_score,
        suggested_price=suggested_price,
        green_credits_earned=credits,
        original_price=original_price,
        product_name=product_name,
        category=category,
        vision_data=vision_result,
        notification=notification
    )


@router.get("/")
async def list_returns(
    status: Optional[str] = None,
    grade: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    query = select(ReturnItem).where(ReturnItem.seller_id == user.id)
    if status:
        query = query.where(ReturnItem.status == status)
    if grade:
        query = query.where(ReturnItem.assigned_grade == grade)
    query = query.order_by(ReturnItem.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    items = result.scalars().all()
    return [
        {
            "return_id": i.return_id,
            "product_name": i.product_name,
            "category": i.category,
            "assigned_grade": i.assigned_grade,
            "routing_decision": i.routing_decision,
            "suggested_price": i.suggested_price,
            "original_price": i.original_price,
            "green_credits_earned": i.green_credits_earned,
            "damage_score": i.damage_score,
            "status": i.status,
            "created_at": i.created_at.isoformat()
        }
        for i in items
    ]


@router.get("/{return_id}")
async def get_return(return_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ReturnItem).where(ReturnItem.return_id == return_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Return not found")
    return {
        "return_id": item.return_id,
        "product_name": item.product_name,
        "category": item.category,
        "assigned_grade": item.assigned_grade,
        "routing_decision": item.routing_decision,
        "suggested_price": item.suggested_price,
        "original_price": item.original_price,
        "green_credits_earned": item.green_credits_earned,
        "damage_score": item.damage_score,
        "vision_data": item.vision_data,
        "status": item.status,
        "created_at": item.created_at.isoformat()
    }