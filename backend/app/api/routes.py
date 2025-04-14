from fastapi import APIRouter
from app.api import edi

router = APIRouter()
router.include_router(edi.router, tags=["Cargo"])
