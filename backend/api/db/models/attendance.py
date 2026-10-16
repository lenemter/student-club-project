from datetime import datetime, timezone
from sqlmodel import Field, SQLModel


class AttendanceRecord(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    club_id: int = Field(foreign_key="club.id", ondelete="CASCADE")
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AttendanceUser(SQLModel, table=True):
    attendance_id: int = Field(foreign_key="attendancerecord.id", primary_key=True, ondelete="CASCADE")
    user_id: int = Field(foreign_key="user.id", primary_key=True, ondelete="CASCADE")
