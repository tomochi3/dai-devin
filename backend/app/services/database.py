import uuid
from datetime import datetime, timedelta
import random
from typing import Dict, List, Optional

from app.models.models import (
    User, UserRole, CounselorProfile, Appointment, 
    InitialScreening, AvailabilitySlot, CounselorSpecialty,
    ScreeningResult, AppointmentStatus
)

users: Dict[str, User] = {}
counselor_profiles: Dict[str, CounselorProfile] = {}
appointments: Dict[str, Appointment] = {}
screenings: Dict[str, InitialScreening] = {}
availability_slots: List[AvailabilitySlot] = []

def seed_data():
    client_ids = []
    counselor_ids = []
    
    for i in range(5):
        user_id = str(uuid.uuid4())
        users[user_id] = User(
            id=user_id,
            name=f"Client {i+1}",
            email=f"client{i+1}@example.com",
            role=UserRole.CLIENT
        )
        client_ids.append(user_id)
    
    specialties = list(CounselorSpecialty)
    for i in range(5):
        user_id = str(uuid.uuid4())
        users[user_id] = User(
            id=user_id,
            name=f"Counselor {i+1}",
            email=f"counselor{i+1}@example.com",
            role=UserRole.COUNSELOR
        )
        counselor_ids.append(user_id)
        
        counselor_id = str(uuid.uuid4())
        is_professional = i < 3  # First 3 are professionals
        counselor_profiles[counselor_id] = CounselorProfile(
            id=counselor_id,
            user_id=user_id,
            bio=f"Experienced counselor specializing in various areas. Here to help!",
            specialties=random.sample(specialties, k=min(3, len(specialties))),
            hourly_rate=50.0 if is_professional else None,
            is_professional=is_professional,
            available_slots=[]
        )
        
        now = datetime.now()
        for day in range(7):
            day_date = now + timedelta(days=day)
            for hour in range(9, 18, 2):  # 9am to 6pm, 2-hour slots
                start_time = day_date.replace(hour=hour, minute=0, second=0, microsecond=0)
                end_time = start_time + timedelta(hours=1)
                
                if random.random() > 0.3:
                    slot = AvailabilitySlot(
                        counselor_id=counselor_id,
                        start_time=start_time,
                        end_time=end_time,
                        is_booked=False
                    )
                    availability_slots.append(slot)
    
    for i in range(3):
        if i < len(client_ids) and i < len(counselor_ids):
            counselor_id = list(counselor_profiles.keys())[i]
            start_time = datetime.now() + timedelta(days=i+1, hours=10)
            end_time = start_time + timedelta(hours=1)
            
            appointment_id = str(uuid.uuid4())
            appointments[appointment_id] = Appointment(
                id=appointment_id,
                client_id=client_ids[i],
                counselor_id=counselor_id,
                start_time=start_time,
                end_time=end_time,
                status=AppointmentStatus.CONFIRMED,
                meeting_link=f"https://meet.google.com/{uuid.uuid4().hex[:10]}",
                is_professional=counselor_profiles[counselor_id].is_professional
            )

seed_data()

def get_all_users():
    return list(users.values())

def get_user(user_id: str) -> Optional[User]:
    return users.get(user_id)

def create_user(user: User) -> User:
    users[user.id] = user
    return user

def get_all_counselors():
    return [profile for profile in counselor_profiles.values()]

def get_counselor(counselor_id: str) -> Optional[CounselorProfile]:
    return counselor_profiles.get(counselor_id)

def get_available_slots(start_date: datetime, end_date: datetime):
    return [
        slot for slot in availability_slots 
        if start_date <= slot.start_time <= end_date and not slot.is_booked
    ]

def get_counselor_available_slots(counselor_id: str, start_date: datetime, end_date: datetime):
    return [
        slot for slot in availability_slots 
        if slot.counselor_id == counselor_id and 
        start_date <= slot.start_time <= end_date and 
        not slot.is_booked
    ]

def create_appointment(appointment: Appointment) -> Appointment:
    for slot in availability_slots:
        if (slot.counselor_id == appointment.counselor_id and 
            slot.start_time == appointment.start_time and 
            not slot.is_booked):
            slot.is_booked = True
            break
    
    appointments[appointment.id] = appointment
    return appointment

def get_appointment(appointment_id: str) -> Optional[Appointment]:
    return appointments.get(appointment_id)

def get_user_appointments(user_id: str) -> List[Appointment]:
    return [
        appointment for appointment in appointments.values()
        if appointment.client_id == user_id or 
        counselor_profiles.get(appointment.counselor_id, {}).get('user_id') == user_id
    ]

def create_screening(screening: InitialScreening) -> InitialScreening:
    screenings[screening.id] = screening
    return screening

def get_user_screening(user_id: str) -> Optional[InitialScreening]:
    for screening in screenings.values():
        if screening.user_id == user_id:
            return screening
    return None

def count_professional_appointments(client_id: str, month: int, year: int) -> int:
    """Count the number of professional appointments for a client in a given month"""
    count = 0
    for appointment in appointments.values():
        if (appointment.client_id == client_id and 
            appointment.is_professional and 
            appointment.start_time.month == month and 
            appointment.start_time.year == year and
            appointment.status != AppointmentStatus.CANCELLED):
            count += 1
    return count
