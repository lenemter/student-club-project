import os
import dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import api.db
import api.routers

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

app.include_router(api.routers.auth_router)
app.include_router(api.routers.users_router)
app.include_router(api.routers.clubs_router)
app.include_router(api.routers.memberships_router)
app.include_router(api.routers.join_requests_router)
app.include_router(api.routers.attendance_router)
app.include_router(api.routers.notifications_router)
