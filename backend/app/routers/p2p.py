from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.database import get_db
from app.models import P2PListing, Order, User, GreenCreditTransaction
from app.security import get_current_user

router = APIRouter(prefix="/api/v1/p2p", tags=["P2P Resale"])


class CreateListingRequest(BaseModel):
    title: str
    description: str = ""
    category: str = "Electronics"
    asking_price: float
    condition_grade: str = "Good"


@router.post("/listings")
async def create_listing(
    req: CreateListingRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    listing = P2PListing(
        seller_id=user.id,
        title=req.title,
        description=req.description,
        category=req.category,
        asking_price=req.asking_price,
        condition_grade=req.condition_grade,
        ai_verified=True  # Simulated AI verification
    )
    db.add(listing)
    await db.commit()
    await db.refresh(listing)
    return {
        "id": listing.id,
        "title": listing.title,
        "asking_price": listing.asking_price,
        "condition_grade": listing.condition_grade,
        "ai_verified": listing.ai_verified,
        "status": listing.status
    }


@router.get("/listings")
async def browse_listings(
    category: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    query = select(P2PListing).where(P2PListing.status == "active")
    if category:
        query = query.where(P2PListing.category == category)
    query = query.order_by(P2PListing.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    listings = result.scalars().all()
    return [
        {
            "id": l.id,
            "title": l.title,
            "description": l.description,
            "category": l.category,
            "asking_price": l.asking_price,
            "condition_grade": l.condition_grade,
            "ai_verified": l.ai_verified,
            "seller_id": l.seller_id,
            "status": l.status,
            "created_at": l.created_at.isoformat()
        }
        for l in listings
    ]


@router.post("/listings/{listing_id}/buy")
async def buy_p2p(
    listing_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(P2PListing).where(P2PListing.id == listing_id, P2PListing.status == "active")
    )
    listing = result.scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found or already sold")
    if listing.seller_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot buy your own listing")

    listing.status = "sold"
    order = Order(
        buyer_id=user.id,
        item_id=listing.id,
        item_type="p2p",
        purchase_price=listing.asking_price,
        final_price=listing.asking_price,
        status="confirmed"
    )
    db.add(order)

    # Credits for buyer (purchased secondhand)
    buyer_credits = 30
    user.green_credits_balance += buyer_credits
    db.add(GreenCreditTransaction(
        user_id=user.id, amount=buyer_credits,
        reason="P2P_PURCHASE", reference_id=order.id,
        balance_after=user.green_credits_balance
    ))

    await db.commit()
    return {"order_id": order.id, "status": "confirmed", "credits_earned": buyer_credits}


@router.delete("/listings/{listing_id}")
async def delete_listing(
    listing_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(select(P2PListing).where(P2PListing.id == listing_id))
    listing = result.scalar_one_or_none()
    if not listing:
        raise HTTPException(status_code=404, detail="Not found")
    if listing.seller_id != user.id:
        raise HTTPException(status_code=403, detail="Not your listing")
    listing.status = "deleted"
    await db.commit()
    return {"status": "deleted"}