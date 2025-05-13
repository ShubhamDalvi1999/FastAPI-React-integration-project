from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..auth.auth_handler import get_current_active_user
from ..database import get_db
from ..models import User
from pydantic import BaseModel

# In-memory storage for demo purposes
# In a real app, you would use a database table
FRUITS = [
    {"id": 1, "name": "Apple"},
    {"id": 2, "name": "Banana"},
    {"id": 3, "name": "Orange"}
]

router = APIRouter()

class FruitBase(BaseModel):
    name: str

class FruitCreate(FruitBase):
    pass

class Fruit(FruitBase):
    id: int

    class Config:
        orm_mode = True

class FruitsResponse(BaseModel):
    fruits: List[Fruit]
    success: bool
    message: Optional[str] = None


@router.get("/fruits", response_model=FruitsResponse)
async def get_fruits(
    skip: int = 0, 
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all fruits - requires authentication
    """
    return {
        "fruits": FRUITS[skip : skip + limit],
        "success": True
    }


@router.post("/fruits", response_model=FruitsResponse)
async def add_fruit(
    fruit: FruitCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Add a new fruit - requires authentication
    """
    # Find next available ID
    next_id = max([f["id"] for f in FRUITS]) + 1 if FRUITS else 1
    
    # Create new fruit
    new_fruit = {"id": next_id, "name": fruit.name}
    
    # Add to in-memory list
    FRUITS.append(new_fruit)
    
    return {
        "fruits": [new_fruit],
        "success": True,
        "message": f"Fruit '{fruit.name}' added successfully"
    } 