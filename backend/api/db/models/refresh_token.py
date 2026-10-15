from datetime import datetime, timezone
from sqlmodel import Field, SQLModel


class RefreshToken(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    token: str = Field(unique=True, index=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    expires_at: datetime = Field()
    revoked: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
