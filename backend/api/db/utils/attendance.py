from datetime import datetime
from typing import TYPE_CHECKING, Union

from sqlmodel import Session, select

if TYPE_CHECKING:
    from .. import AttendanceRecord, AttendanceUser


def get_attended_user_ids(session: Session, record_id: int) -> list[int]:
    from .. import AttendanceUser

    return list(
        session.exec(
            select(AttendanceUser.user_id).where(AttendanceUser.attendance_id == record_id)
        ).all()
    )


def get_club_attendance(club_id: int) -> list[tuple["AttendanceRecord", list[int]]]:
    from .. import AttendanceRecord, engine

    with Session(engine, expire_on_commit=False) as session:
        records = session.exec(
            select(AttendanceRecord).where(AttendanceRecord.club_id == club_id)
        ).all()

        result = []
        for r in records:
            assert r.id is not None
            user_ids = get_attended_user_ids(session, r.id)
            result.append((r, user_ids))
        return result


def get_attendance_by_id(record_id: int) -> Union[tuple["AttendanceRecord", list[int]], None]:
    from .. import AttendanceRecord, engine

    with Session(engine, expire_on_commit=False) as session:
        record = session.get(AttendanceRecord, record_id)
        if record is None:
            return None
        assert record.id is not None
        user_ids = get_attended_user_ids(session, record.id)
        return record, user_ids


def create_attendance(
    club_id: int, date: datetime | None, attended_user_ids: list[int]
) -> tuple["AttendanceRecord", list[int]]:
    from .. import AttendanceRecord, AttendanceUser, engine

    with Session(engine, expire_on_commit=False) as session:
        record = AttendanceRecord(
            club_id=club_id,
            date=date if date is not None else datetime.utcnow(),
        )
        session.add(record)
        session.commit()
        session.refresh(record)

        assert record.id is not None
        for user_id in attended_user_ids:
            au = AttendanceUser(attendance_id=record.id, user_id=user_id)
            session.add(au)
        session.commit()
        session.refresh(record)

        return record, attended_user_ids


def update_attendance(
    session: Session,
    record: "AttendanceRecord",
    date: datetime | None = None,
    attended_user_ids: list[int] | None = None,
) -> tuple["AttendanceRecord", list[int]]:
    from .. import AttendanceUser

    assert record.id is not None

    if date is not None:
        record.date = date
        session.add(record)

    if attended_user_ids is not None:
        existing = session.exec(
            select(AttendanceUser).where(AttendanceUser.attendance_id == record.id)
        ).all()
        for item in existing:
            session.delete(item)

        for user_id in attended_user_ids:
            au = AttendanceUser(attendance_id=record.id, user_id=user_id)
            session.add(au)

    session.commit()
    session.refresh(record)

    current_user_ids = get_attended_user_ids(session, record.id)
    return record, current_user_ids


def delete_attendance(session: Session, record: "AttendanceRecord") -> None:
    session.delete(record)
    session.commit()
