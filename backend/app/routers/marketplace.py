from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from datetime import datetime
from app.database import get_db
from app.models import ReturnItem, WaitlistEntry, Order, User, GreenCreditTransaction
from app.security import get_current_user

router = APIRouter(prefix="/api/v1/marketplace", tags=["Marketplace"])


@router.get("/")
async def browse_marketplace(
    category: Optional[str] = None,
    grade: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    query = select(ReturnItem).where(ReturnItem.status == "available")
    if category:
        query = query.where(ReturnItem.category == category)
    if grade:
        query = query.where(ReturnItem.assigned_grade == grade)
    if min_price is not None:
        query = query.where(ReturnItem.suggested_price >= min_price)
    if max_price is not None:
        query = query.where(ReturnItem.suggested_price <= max_price)
    query = query.order_by(ReturnItem.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    items = result.scalars().all()
    return [
        {
            "return_id": i.return_id,
            "product_name": i.product_name,
            "category": i.category,
            "assigned_grade": i.assigned_grade,
            "suggested_price": i.suggested_price,
            "original_price": i.original_price,
            "green_credits_earned": i.green_credits_earned,
            "damage_score": i.damage_score,
            "routing_decision": i.routing_decision,
            "created_at": i.created_at.isoformat()
        }
        for i in items
    ]


class PurchaseRequest(BaseModel):
    return_id: str
    apply_credits: int = 0


@router.post("/purchase")
async def purchase_item(
    req: PurchaseRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ReturnItem).where(ReturnItem.return_id == req.return_id, ReturnItem.status == "available")
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not available")

    credits_discount = min(req.apply_credits, user.green_credits_balance) * 0.5
    final_price = max(0, item.suggested_price - credits_discount)

    # Create order
    order = Order(
        buyer_id=user.id,
        item_id=item.id,
        item_type="return",
        purchase_price=item.suggested_price,
        credits_applied=req.apply_credits,
        final_price=final_price,
        status="confirmed"
    )
    db.add(order)

    # Update item status
    item.status = "sold"

    # Award buyer credits for buying refurbished
    bonus_credits = 30
    user.green_credits_balance = user.green_credits_balance - req.apply_credits + bonus_credits
    credit_tx = GreenCreditTransaction(
        user_id=user.id,
        amount=bonus_credits - req.apply_credits,
        reason="PURCHASE_REFURBISHED",
        reference_id=order.id,
        balance_after=user.green_credits_balance
    )
    db.add(credit_tx)

    await db.commit()

    return {
        "order_id": order.id,
        "status": "confirmed",
        "final_price": final_price,
        "credits_applied": req.apply_credits,
        "credits_earned": bonus_credits,
        "new_credit_balance": user.green_credits_balance
    }


class WaitlistRequest(BaseModel):
    requested_grade: str
    requested_category: Optional[str] = None
    max_price: Optional[float] = None


@router.post("/waitlist")
async def join_waitlist(
    req: WaitlistRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    entry = WaitlistEntry(
        buyer_id=user.id,
        buyer_email=user.email,
        requested_grade=req.requested_grade,
        requested_category=req.requested_category,
        max_price=req.max_price
    )
    db.add(entry)
    await db.commit()
    return {"status": "SUCCESS", "message": f"Joined waitlist for {req.requested_grade}"}


@router.get("/waitlist")
async def my_waitlist(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(
        select(WaitlistEntry).where(WaitlistEntry.buyer_id == user.id).order_by(WaitlistEntry.created_at.desc())
    )
    entries = result.scalars().all()
    return [
        {
            "id": e.id,
            "requested_grade": e.requested_grade,
            "requested_category": e.requested_category,
            "max_price": e.max_price,
            "status": e.status,
            "created_at": e.created_at.isoformat()
        }
        for e in entries
    ]