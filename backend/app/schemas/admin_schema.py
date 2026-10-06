from pydantic import BaseModel
from typing import List, Dict, Any

class AdminDashboardKPI(BaseModel):
    total_customers: int
    total_workers: int
    verified_workers: int
    pending_verifications: int
    total_bookings: int
    completed_bookings: int
    total_revenue: float
    paid_revenue: float = 0.0
    pending_revenue: float = 0.0
    recent_bookings: List[Dict[str, Any]]
    category_distribution: Dict[str, int]
