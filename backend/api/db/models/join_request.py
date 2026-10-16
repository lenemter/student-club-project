from datetime import datetime, timezone
from sqlmodel import Field, SQLModel


class JoinRequest(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    club_id: int = Field(foreign_key="club.id", ondelete="CASCADE")
    status: str = Field(default="pending")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
