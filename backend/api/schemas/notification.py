from datetime import datetime
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from .unset_type import Unset, UnsetType


class NotificationBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class NotificationPublic(NotificationBase):
    id: int
    user_id: int
    title: str
    description: str
    created_at: datetime
    is_read: bool
    type: str


class NotificationCreate(NotificationBase):
    user_id: int
    title: str
    description: str = ""
    type: str = "info"


class NotificationUpdate(NotificationBase):
    is_read: UnsetType | bool = Unset
