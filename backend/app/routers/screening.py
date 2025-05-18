from fastapi import APIRouter, HTTPException
import uuid
from typing import Dict

from app.models.models import InitialScreening, ScreeningRequest, ScreeningResult
from app.services.database import create_screening, get_user, get_user_screening
from app.services.ai_screening import perform_screening

router = APIRouter(prefix="/screening", tags=["screening"])

@router.post("/", response_model=InitialScreening)
async def perform_initial_screening(request: ScreeningRequest):
    user = get_user(request.user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    existing_screening = get_user_screening(request.user_id)
    if existing_screening is not None:
        return existing_screening
    
    result, notes = perform_screening(request.answers)
    
    screening_id = str(uuid.uuid4())
    screening = InitialScreening(
        id=screening_id,
        user_id=request.user_id,
        result=result,
        notes=notes
    )
    
    return create_screening(screening)

@router.get("/{user_id}", response_model=InitialScreening)
async def get_screening_result(user_id: str):
    user = get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    screening = get_user_screening(user_id)
    if screening is None:
        raise HTTPException(status_code=404, detail="Screening not found for this user")
    
    return screening
