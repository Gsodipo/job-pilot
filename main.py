from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()


from app.api.cv_routes import router as cv_router  
from app.api.auth_routes import router as auth_router
from app.api.job_routes import router as job_router 
from app.api.cover_letter_routes import router as cover_letter_router
from app.core.auth import get_current_user_id


app = FastAPI()

# allowed frontends (we'll use these later)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",

    # ✅ Vercel frontend
    "https://job-pilot-beta.vercel.app",

    # ✅ JobPilot Chrome Extension
    "chrome-extension://kdnjioofncjahajjofjokjcekldeac",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://job-pilot-beta.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "chrome-extension://kdnjioofncjahajjofjokjcekldeac",
    ],
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "app": "JobPilot backend is running 🎯"}


@app.get("/me")
def me(user_id: str = Depends(get_current_user_id)):
    return {"user_id": user_id}

# 👇 NEW: include CV routes
app.include_router(cv_router, tags=["CV"])
app.include_router(job_router)
app.include_router(cover_letter_router) 
app.include_router(auth_router, tags=["Auth"])