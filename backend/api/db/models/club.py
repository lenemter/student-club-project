from sqlmodel import Field, SQLModel


class Club(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: str = Field(default="")
    image_url: str = Field(default="")
    schedule: str = Field(default="")
    leader_id: int = Field(foreign_key="user.id")
