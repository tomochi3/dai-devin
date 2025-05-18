from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime
from typing import List

from app.models.models import Appointment, CreateAppointmentRequest, AppointmentStatus
from app.services.database import (
    create_appointment, get_appointment, get_user_appointments,
    get_counselor, get_user, count_professional_appointments
)
from app.services.google_meet import generate_meeting_link

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.post("/", response_model=Appointment)
async def create_new_appointment(request: CreateAppointmentRequest):
    client = get_user(request.client_id)
    if client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    
    counselor = get_counselor(request.counselor_id)
    if counselor is None:
        raise HTTPException(status_code=404, detail="Counselor not found")
    
    if request.is_professional:
        current_month = datetime.now().month
        current_year = datetime.now().year
        monthly_count = count_professional_appointments(
            request.client_id, current_month, current_year
        )
        
        if monthly_count >= 4:
            raise HTTPException(
                status_code=400, 
                detail="Monthly limit for professional counseling sessions reached"
            )
    
    meeting_link = generate_meeting_link()
    
    appointment_id = str(uuid.uuid4())
    new_appointment = Appointment(
        id=appointment_id,
        client_id=request.client_id,
        counselor_id=request.counselor_id,
        start_time=request.start_time,
        end_time=request.end_time,
        status=AppointmentStatus.CONFIRMED,
        meeting_link=meeting_link,
        is_professional=request.is_professional
    )
    
    return create_appointment(new_appointment)

@router.get("/{appointment_id}", response_model=Appointment)
async def read_appointment(appointment_id: str):
    appointment = get_appointment(appointment_id)
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.get("/user/{user_id}", response_model=List[Appointment])
async def read_user_appointments(user_id: str):
    user = get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return get_user_appointments(user_id)
