from datetime import datetime, timezone
from sqlmodel import Field, SQLModel


class Notification(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    title: str = Field()
    description: str = Field(default="")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_read: bool = Field(default=False)
    type: str = Field(default="info")  # "success" | "info" | "warning"
