import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), default="")
    role = Column(String(20), default="buyer")
    green_credits_balance = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ReturnItem(Base):
    __tablename__ = "return_items"
    id = Column(String, primary_key=True, default=gen_uuid)
    return_id = Column(String(50), unique=True, nullable=False, index=True)
    seller_id = Column(String, nullable=True)
    product_name = Column(String(255), default="Returned Product")
    category = Column(String(100), default="Electronics")
    original_price = Column(Float, nullable=False)
    suggested_price = Column(Float, nullable=True)
    assigned_grade = Column(String(50), nullable=True)
    routing_decision = Column(String(50), nullable=True)
    green_credits_earned = Column(Integer, default=0)
    damage_score = Column(Float, default=0.0)
    image_keys = Column(Text, default="")
    vision_data = Column(JSON, nullable=True)
    status = Column(String(20), default="processing", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class WaitlistEntry(Base):
    __tablename__ = "waitlist_entries"
    id = Column(String, primary_key=True, default=gen_uuid)
    buyer_id = Column(String, nullable=True)
    buyer_email = Column(String(255), nullable=False)
    requested_grade = Column(String(50), nullable=False)
    requested_category = Column(String(100), nullable=True)
    max_price = Column(Float, nullable=True)
    status = Column(String(20), default="waiting", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    notified_at = Column(DateTime, nullable=True)


class Order(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True, default=gen_uuid)
    buyer_id = Column(String, nullable=False)
    item_id = Column(String, nullable=False)
    item_type = Column(String(20), default="return")
    purchase_price = Column(Float, nullable=False)
    credits_applied = Column(Integer, default=0)
    final_price = Column(Float, nullable=False)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)


class P2PListing(Base):
    __tablename__ = "p2p_listings"
    id = Column(String, primary_key=True, default=gen_uuid)
    seller_id = Column(String, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, default="")
    category = Column(String(100), default="Electronics")
    asking_price = Column(Float, nullable=False)
    condition_grade = Column(String(50), default="Good")
    image_keys = Column(Text, default="")
    ai_verified = Column(Boolean, default=False)
    status = Column(String(20), default="active", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class GreenCreditTransaction(Base):
    __tablename__ = "green_credit_transactions"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, nullable=False, index=True)
    amount = Column(Integer, nullable=False)
    reason = Column(String(100), nullable=False)
    reference_id = Column(String, nullable=True)
    balance_after = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ReturnPrediction(Base):
    __tablename__ = "return_predictions"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, nullable=True)
    product_name = Column(String(255), default="")
    category = Column(String(100), default="")
    predicted_return_probability = Column(Float, default=0.0)
    risk_factors = Column(JSON, nullable=True)
    recommendation = Column(Text, default="")
    outcome = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)