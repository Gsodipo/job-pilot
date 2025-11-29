from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.cv_routes import router as cv_router  # 👈 NEW


app = FastAPI()

# allowed frontends (we'll use these later)
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",  # CRA default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "app": "JobPilot backend is running 🎯"}


# 👇 NEW: include CV routes
app.include_router(cv_router, tags=["CV"])