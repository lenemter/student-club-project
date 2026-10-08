from typing import Any, Union

from sqlmodel import Session, select

from ..db import engine
from ..models.join_request import JoinRequest


def get_join_requests(
    club_id: int | None = None,
    user_id: int | None = None,
    status: str | None = None,
) -> list[JoinRequest]:
    with Session(engine) as session:
        query = select(JoinRequest)
        if club_id is not None:
            query = query.where(JoinRequest.club_id == club_id)
        if user_id is not None:
            query = query.where(JoinRequest.user_id == user_id)
        if status is not None:
            query = query.where(JoinRequest.status == status)

        return list(session.exec(query).all())


def get_join_request_by_id(request_id: int) -> Union[JoinRequest, None]:
    with Session(engine) as session:
        return session.get(JoinRequest, request_id)


def create_join_request(user_id: int, club_id: int) -> JoinRequest:
    with Session(engine) as session:
        existing = session.exec(
            select(JoinRequest).where(
                JoinRequest.user_id == user_id,
                JoinRequest.club_id == club_id,
                JoinRequest.status == "pending",
            )
        ).first()

        if existing is not None:
            return existing

        new_request = JoinRequest(user_id=user_id, club_id=club_id, status="pending")
        session.add(new_request)
        session.commit()
        session.refresh(new_request)

        return new_request


def update_join_request(
    session: Session, join_request: JoinRequest, update: dict[str, Any]
) -> JoinRequest:
    join_request.sqlmodel_update(update)
    session.add(join_request)
    session.commit()
    session.refresh(join_request)

    return join_request


def delete_join_request(session: Session, join_request: JoinRequest) -> None:
    session.delete(join_request)
    session.commit()
