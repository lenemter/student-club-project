from .attendance import router as attendance_router
from .auth import router as auth_router
from .clubs import router as clubs_router
from .join_requests import router as join_requests_router
from .memberships import router as memberships_router
from .notifications import router as notifications_router
from .users import router as users_router

__all__ = [
    "auth_router",
    "users_router",
    "clubs_router",
    "memberships_router",
    "join_requests_router",
    "attendance_router",
    "notifications_router",
]
