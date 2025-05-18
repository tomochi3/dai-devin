from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from typing import List, Optional

from app.models.models import CounselorProfile, AvailabilitySlot
from app.services.database import get_all_counselors, get_counselor, get_counselor_available_slots

router = APIRouter(prefix="/counselors", tags=["counselors"])

@router.get("/", response_model=List[CounselorProfile])
async def read_counselors():
    return get_all_counselors()

@router.get("/{counselor_id}", response_model=CounselorProfile)
async def read_counselor(counselor_id: str):
    counselor = get_counselor(counselor_id)
    if counselor is None:
        raise HTTPException(status_code=404, detail="Counselor not found")
    return counselor

@router.get("/{counselor_id}/availability", response_model=List[AvailabilitySlot])
async def read_counselor_availability(
    counselor_id: str, 
    start_date: Optional[datetime] = None, 
    end_date: Optional[datetime] = None
):
    counselor = get_counselor(counselor_id)
    if counselor is None:
        raise HTTPException(status_code=404, detail="Counselor not found")
    
    if start_date is None:
        start_date = datetime.now()
    if end_date is None:
        end_date = start_date + timedelta(days=7)
    
    return get_counselor_available_slots(counselor_id, start_date, end_date)
