from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from .unset_type import Unset, UnsetType


class AttendanceBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class AttendanceRecordPublic(AttendanceBase):
    id: int
    club_id: int
    date: datetime
    attended_user_ids: list[int] = Field(default_factory=list)


class AttendanceRecordCreate(AttendanceBase):
    club_id: int
    date: datetime | None = None
    attended_user_ids: list[int] = Field(default_factory=list)


class AttendanceRecordUpdate(AttendanceBase):
    date: UnsetType | datetime = Unset
    attended_user_ids: UnsetType | list[int] = Unset
