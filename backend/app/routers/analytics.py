from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models import ReturnItem, Order, P2PListing, GreenCreditTransaction, User

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])


@router.get("/summary")
async def get_summary(db: AsyncSession = Depends(get_db)):
    items_result = await db.execute(select(func.count(ReturnItem.id)))
    total_items = items_result.scalar() or 0

    value_result = await db.execute(select(func.sum(ReturnItem.suggested_price)).where(ReturnItem.status == "sold"))
    total_value = value_result.scalar() or 0

    credits_result = await db.execute(select(func.sum(ReturnItem.green_credits_earned)))
    total_credits = credits_result.scalar() or 0

    orders_result = await db.execute(select(func.count(Order.id)).where(Order.item_type == "return"))
    marketplace_sales = orders_result.scalar() or 0

    p2p_result = await db.execute(select(func.count(Order.id)).where(Order.item_type == "p2p"))
    p2p_sales = p2p_result.scalar() or 0

    # Environmental estimates
    co2_saved = total_items * 2.5  # ~2.5 kg CO2 per item diverted from landfill

    return {
        "total_items_processed": total_items,
        "total_value_recovered": round(total_value, 2),
        "total_green_credits_issued": total_credits,
        "marketplace_sales": marketplace_sales,
        "p2p_sales": p2p_sales,
        "co2_prevented_kg": round(co2_saved, 1),
        "items_diverted_from_landfill": total_items
    }


@router.get("/environmental")
async def environmental_impact(db: AsyncSession = Depends(get_db)):
    routing_counts = {}
    for route in ["RESELL", "REFURBISH", "DONATE", "RECYCLE"]:
        result = await db.execute(
            select(func.count(ReturnItem.id)).where(ReturnItem.routing_decision == route)
        )
        routing_counts[route.lower()] = result.scalar() or 0

    total = sum(routing_counts.values()) or 1
    return {
        "routing_distribution": routing_counts,
        "routing_percentages": {k: round(v / total * 100, 1) for k, v in routing_counts.items()},
        "total_processed": total,
        "co2_saved_kg": total * 2.5,
        "water_saved_liters": total * 15,
        "waste_diverted_kg": total * 1.2
    }