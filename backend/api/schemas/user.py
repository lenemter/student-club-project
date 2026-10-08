from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from .unset_type import Unset, UnsetType


class UserBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class UserPublic(UserBase):
    id: int
    email: str
    first_name: str
    last_name: str
    about_me: str | None = ""
    avatar_url: str | None = ""


class UserCreate(UserBase):
    email: str
    first_name: str
    last_name: str
    password: str
    about_me: str | None = ""
    avatar_url: str | None = ""


class UserUpdate(UserBase):
    email: UnsetType | str = Unset
    first_name: UnsetType | str = Unset
    last_name: UnsetType | str = Unset
    about_me: UnsetType | str = Unset
    avatar_url: UnsetType | str = Unset
    password: UnsetType | str = Unset
