from sqlmodel import Session, select

from ..db import engine
from ..models.membership import Membership


def get_club_memberships(club_id: int) -> list[Membership]:
    with Session(engine) as session:
        return list(
            session.exec(select(Membership).where(Membership.club_id == club_id)).all()
        )


def get_user_memberships(user_id: int) -> list[Membership]:
    with Session(engine) as session:
        return list(
            session.exec(select(Membership).where(Membership.user_id == user_id)).all()
        )


def is_club_member(club_id: int, user_id: int) -> bool:
    with Session(engine) as session:
        membership = session.exec(
            select(Membership).where(
                Membership.club_id == club_id, Membership.user_id == user_id
            )
        ).first()
        return membership is not None


def add_member(club_id: int, user_id: int) -> Membership:
    with Session(engine) as session:
        existing = session.exec(
            select(Membership).where(
                Membership.club_id == club_id, Membership.user_id == user_id
            )
        ).first()

        if existing is not None:
            return existing

        membership = Membership(club_id=club_id, user_id=user_id)
        session.add(membership)
        session.commit()
        session.refresh(membership)

        return membership


def remove_member(club_id: int, user_id: int) -> None:
    with Session(engine) as session:
        membership = session.exec(
            select(Membership).where(
                Membership.club_id == club_id, Membership.user_id == user_id
            )
        ).first()

        if membership is not None:
            session.delete(membership)
            session.commit()
