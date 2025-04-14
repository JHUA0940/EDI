from fastapi import APIRouter
from app.api import cargo

router = APIRouter()
router.include_router(cargo.router, tags=["Cargo"])
