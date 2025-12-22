from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()


from app.api.cv_routes import router as cv_router  # 👈 NEW
from app.api.job_routes import router as job_router 
from app.api.cover_letter_routes import router as cover_letter_router


app = FastAPI()

# allowed frontends (we'll use these later)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",

    # ✅ JobPilot Chrome Extension
    "chrome-extension://kdnjioofncjahajjofjokjcekldeac",
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
app.include_router(job_router)
app.include_router(cover_letter_router) 