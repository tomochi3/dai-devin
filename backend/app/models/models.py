from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class UserRole(str, Enum):
    CLIENT = "client"
    COUNSELOR = "counselor"


class UserBase(BaseModel):
    name: str
    email: str
    role: UserRole


class User(UserBase):
    id: str
    created_at: datetime = Field(default_factory=datetime.now)


class CounselorSpecialty(str, Enum):
    GENERAL = "general"
    DEPRESSION = "depression"
    ANXIETY = "anxiety"
    RELATIONSHIPS = "relationships"
    CAREER = "career"
    STRESS = "stress"


class CounselorProfile(BaseModel):
    id: str
    user_id: str
    bio: str
    specialties: List[CounselorSpecialty]
    hourly_rate: Optional[float] = None
    is_professional: bool = False
    available_slots: List[datetime] = []


class AppointmentStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class Appointment(BaseModel):
    id: str
    client_id: str
    counselor_id: str
    start_time: datetime
    end_time: datetime
    status: AppointmentStatus = AppointmentStatus.PENDING
    meeting_link: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    is_professional: bool = False


class ScreeningResult(str, Enum):
    PASS = "pass"
    REFER = "refer"
    BLOCK = "block"


class InitialScreening(BaseModel):
    id: str
    user_id: str
    result: ScreeningResult
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)


class AvailabilitySlot(BaseModel):
    counselor_id: str
    start_time: datetime
    end_time: datetime
    is_booked: bool = False


class CreateAppointmentRequest(BaseModel):
    client_id: str
    counselor_id: str
    start_time: datetime
    end_time: datetime
    is_professional: bool = False


class ScreeningRequest(BaseModel):
    user_id: str
    answers: List[str]
