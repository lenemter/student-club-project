from typing import TYPE_CHECKING, Any, Union

from sqlmodel import Session, col, or_, select

if TYPE_CHECKING:
    from .. import Club, Membership, User


def get_all_clubs() -> list["Club"]:
    from .. import Club, engine

    with Session(engine) as session:
        return list(session.exec(select(Club)).all())


def get_club_by_id(club_id: int) -> Union["Club", None]:
    from .. import Club, engine

    with Session(engine) as session:
        return session.get(Club, club_id)


def get_user_clubs(user_id: int | None) -> list["Club"]:
    from .. import Club, Membership, engine

    if user_id is None:
        return []

    with Session(engine) as session:
        # User leads the club or user is a member
        member_club_ids = session.exec(
            select(Membership.club_id).where(Membership.user_id == user_id)
        ).all()

        clubs = session.exec(
            select(Club).where(
                or_(Club.leader_id == user_id, col(Club.id).in_(member_club_ids))
            )
        ).all()

        return list(clubs)


def get_joinable_clubs(user_id: int | None) -> list["Club"]:
    from .. import Club, Membership, engine

    if user_id is None:
        return get_all_clubs()

    with Session(engine) as session:
        member_club_ids = session.exec(
            select(Membership.club_id).where(Membership.user_id == user_id)
        ).all()

        all_user_club_ids = set(member_club_ids)

        clubs = session.exec(select(Club)).all()
        return [c for c in clubs if c.id not in all_user_club_ids and c.leader_id != user_id]


def create_club(leader: "User", **kwargs) -> "Club":
    from .. import Club, engine

    assert leader.id is not None

    with Session(engine) as session:
        new_club = Club(leader_id=leader.id, **kwargs)
        session.add(new_club)
        session.commit()
        session.refresh(new_club)

        return new_club


def update_club(session: Session, club: "Club", update: dict[str, Any]) -> "Club":
    club.sqlmodel_update(update)
    session.add(club)
    session.commit()
    session.refresh(club)

    return club


def delete_club(session: Session, club: "Club") -> None:
    session.delete(club)
    session.commit()


def get_club_members(club_id: int) -> list["User"]:
    from .. import Club, Membership, User, engine

    with Session(engine) as session:
        club = session.get(Club, club_id)
        if club is None:
            return []

        members: list[User] = []
        leader = session.get(User, club.leader_id)
        if leader:
            members.append(leader)

        memberships = session.exec(
            select(Membership).where(Membership.club_id == club_id)
        ).all()

        for m in memberships:
            u = session.get(User, m.user_id)
            if u and u.id != club.leader_id:
                members.append(u)

        return members
