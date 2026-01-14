# app/api/auth_routes.py
from fastapi import APIRouter, Depends
from app.core.auth import get_current_user_id

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/me")
def me(user_id: str = Depends(get_current_user_id)):
    return {"user_id": user_id}
