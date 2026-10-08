from datetime import datetime
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class MembershipBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class MembershipPublic(MembershipBase):
    id: int
    user_id: int
    club_id: int
    joined_at: datetime


class MembershipCreate(MembershipBase):
    user_id: int
    club_id: int
