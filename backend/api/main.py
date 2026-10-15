import os
import dotenv
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import api.db
import api.routers
import api.utils

dotenv.load_dotenv()

api.db.create_db_and_tables()

app = FastAPI(
    title="Student Clubs API",
    description="Backend API for Student Clubs Management",
    version="1.0.0",
)

cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = api.utils.UPLOAD_DIR
os.makedirs(os.path.join(UPLOAD_DIR, "avatars"), exist_ok=True)
os.makedirs(os.path.join(UPLOAD_DIR, "clubs"), exist_ok=True)
app.mount("/static", StaticFiles(directory=UPLOAD_DIR), name="static")

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(api.routers.auth_router)
api_v1_router.include_router(api.routers.users_router)
api_v1_router.include_router(api.routers.clubs_router)
api_v1_router.include_router(api.routers.memberships_router)
api_v1_router.include_router(api.routers.join_requests_router)
api_v1_router.include_router(api.routers.attendance_router)
api_v1_router.include_router(api.routers.notifications_router)
app.include_router(api_v1_router)
