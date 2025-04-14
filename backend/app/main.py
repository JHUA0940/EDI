from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as edi_router
app = FastAPI(title="EDI Message Handler")

@app.on_event("startup")
async def print_routes():
    from fastapi.routing import APIRoute
    print("\n==== Registered Routes ====")
    for route in app.routes:
        if isinstance(route, APIRoute):
            methods = ",".join(route.methods)
            print(f"{methods:10s} -> {route.path}")
    print("==== End Routes ====\n")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(edi_router, prefix="/api")
app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/")
async def root():
    return {"message": "EDI Message Handler API"} 