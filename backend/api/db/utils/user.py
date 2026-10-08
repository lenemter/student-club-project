from typing import TYPE_CHECKING, Any, Union

from sqlmodel import Session, select

if TYPE_CHECKING:
    from .. import User


def get_user_by_id(user_id: int | None) -> Union["User", None]:
    from .. import User, engine

    if user_id is None:
        return None

    with Session(engine) as session:
        return session.get(User, user_id)


def get_user_by_email(email: str) -> Union["User", None]:
    from .. import User, engine

    with Session(engine) as session:
        return session.exec(select(User).where(User.email == email)).first()


def register_user(**kwargs) -> "User":
    from .. import User, engine

    with Session(engine) as session:
        new_user = User(**kwargs)
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        return new_user


def update_user(session: Session, user: "User", update: dict[str, Any]) -> "User":
    user.sqlmodel_update(update)
    session.add(user)
    session.commit()
    session.refresh(user)

    return user


def get_all_users() -> list["User"]:
    from .. import User, engine

    with Session(engine) as session:
        return list(session.exec(select(User)).all())
