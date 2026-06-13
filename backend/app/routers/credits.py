from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models import User, GreenCreditTransaction
from app.security import get_current_user

router = APIRouter(prefix="/api/v1/credits", tags=["Green Credits"])


@router.get("/balance")
async def get_balance(user: User = Depends(get_current_user)):
    return {"balance": user.green_credits_balance, "email": user.email}


@router.get("/history")
async def credit_history(
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(GreenCreditTransaction)
        .where(GreenCreditTransaction.user_id == user.id)
        .order_by(GreenCreditTransaction.created_at.desc())
        .offset(offset).limit(limit)
    )
    txs = result.scalars().all()
    return [
        {
            "id": t.id,
            "amount": t.amount,
            "reason": t.reason,
            "balance_after": t.balance_after,
            "created_at": t.created_at.isoformat()
        }
        for t in txs
    ]


@router.get("/leaderboard")
async def leaderboard(limit: int = 10, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User)
        .where(User.is_active == True)
        .order_by(User.green_credits_balance.desc())
        .limit(limit)
    )
    users = result.scalars().all()
    return [
        {"rank": i + 1, "name": u.full_name or u.email, "credits": u.green_credits_balance}
        for i, u in enumerate(users)
    ]


class RedeemRequest(BaseModel):
    credits: int


@router.post("/redeem")
async def redeem_credits(
    req: RedeemRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if req.credits > user.green_credits_balance:
        raise HTTPException(status_code=400, detail="Insufficient credits")
    if req.credits < 100:
        raise HTTPException(status_code=400, detail="Minimum redemption is 100 credits")

    discount_value = req.credits * 0.5  # 100 credits = Rs.50
    user.green_credits_balance -= req.credits

    tx = GreenCreditTransaction(
        user_id=user.id,
        amount=-req.credits,
        reason="REDEEMED_DISCOUNT",
        balance_after=user.green_credits_balance
    )
    db.add(tx)
    await db.commit()

    return {
        "redeemed": req.credits,
        "discount_value": discount_value,
        "new_balance": user.green_credits_balance
    }