from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    first_name: str = Field()
    last_name: str = Field()
    about_me: str | None = Field(default="")
    avatar_url: str | None = Field(default="")
    hashed_password: str = Field()
