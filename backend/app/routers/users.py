from fastapi import APIRouter, HTTPException
import uuid
from typing import List

from app.models.models import User, UserBase
from app.services.database import get_all_users, get_user, create_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[User])
async def read_users():
    return get_all_users()

@router.get("/{user_id}", response_model=User)
async def read_user(user_id: str):
    user = get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=User)
async def create_new_user(user: UserBase):
    user_id = str(uuid.uuid4())
    new_user = User(id=user_id, **user.dict())
    return create_user(new_user)
