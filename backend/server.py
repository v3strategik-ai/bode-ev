from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# AI-powered Lead Scoring Models
class LeadData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    contact_email: str
    contact_phone: Optional[str] = None
    industry: str
    company_size: str  # "1-10", "11-50", "51-200", "201-1000", "1000+"
    estimated_budget: float
    location: str
    current_ev_infrastructure: str  # "none", "basic", "advanced"
    timeline: str  # "immediate", "3-6 months", "6-12 months", "1+ years"
    lead_source: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
class LeadScoreResult(BaseModel):
    lead_id: str
    score: int  # 0-100
    priority: str  # "high", "medium", "low"
    reasoning: str
    recommended_actions: List[str]
    estimated_value: float

# Dynamic Pricing Models
class PricingRequest(BaseModel):
    product_id: str
    customer_type: str  # "commercial", "residential", "government"
    quantity: int
    location: str
    installation_complexity: str  # "simple", "moderate", "complex"
    timeline: str
    competitor_pricing: Optional[float] = None

class PricingRecommendation(BaseModel):
    base_price: float
    recommended_price: float
    discount_percentage: float
    pricing_strategy: str
    confidence_level: float
    reasoning: str

# Seasonal Forecasting Models
class ForecastRequest(BaseModel):
    product_category: str
    region: str
    time_horizon: str  # "3_months", "6_months", "12_months"

class DemandForecast(BaseModel):
    period: str
    predicted_demand: int
    confidence_interval: Dict[str, int]  # {"low": 80, "high": 120}
    seasonal_factors: List[str]
    recommended_inventory: int

# Customer Lifetime Value Models
class CustomerData(BaseModel):
    customer_id: str
    acquisition_cost: float
    monthly_revenue: float
    customer_segment: str
    tenure_months: int
    support_tickets: int
    expansion_purchases: int

class CLVPrediction(BaseModel):
    customer_id: str
    predicted_clv: float
    risk_score: float  # 0-1 (churn risk)
    recommended_actions: List[str]
    value_drivers: List[str]

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
