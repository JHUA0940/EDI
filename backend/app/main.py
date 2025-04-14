from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import routers as api_router
app = FastAPI(title="EDI Message Handler")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.mount("/", StaticFiles(directory="static", html=True), name="static")
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "EDI Message Handler API"} 