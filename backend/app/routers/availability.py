from fastapi import APIRouter
from datetime import datetime, timedelta
from typing import List, Optional

from app.models.models import AvailabilitySlot
from app.services.database import get_available_slots

router = APIRouter(prefix="/availability", tags=["availability"])

@router.get("/", response_model=List[AvailabilitySlot])
async def read_available_slots(
    start_date: Optional[datetime] = None, 
    end_date: Optional[datetime] = None
):
    if start_date is None:
        start_date = datetime.now()
    if end_date is None:
        end_date = start_date + timedelta(days=7)
    
    return get_available_slots(start_date, end_date)
