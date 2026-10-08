from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from .unset_type import Unset, UnsetType


class ClubBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class ClubPublic(ClubBase):
    id: int
    name: str
    description: str
    image_url: str
    schedule: str
    leader_id: int


class ClubCreate(ClubBase):
    name: str
    description: str = ""
    image_url: str = ""
    schedule: str = ""


class ClubUpdate(ClubBase):
    name: UnsetType | str = Unset
    description: UnsetType | str = Unset
    image_url: UnsetType | str = Unset
    schedule: UnsetType | str = Unset
    leader_id: UnsetType | int = Unset
