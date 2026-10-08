from datetime import datetime
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from .unset_type import Unset, UnsetType


class JoinRequestBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class JoinRequestPublic(JoinRequestBase):
    id: int
    user_id: int
    club_id: int
    status: str
    created_at: datetime


class JoinRequestCreate(JoinRequestBase):
    club_id: int


class JoinRequestUpdate(JoinRequestBase):
    status: str
