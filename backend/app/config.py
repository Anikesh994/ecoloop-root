import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-secret")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRY_MINUTES: int = int(os.getenv("JWT_EXPIRY_MINUTES", "60"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./ecoloop.db")
    S3_BUCKET: str = os.getenv("S3_BUCKET", "ecoloop-media-local")
    AWS_REGION: str = os.getenv("AWS_REGION", "ap-south-1")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()