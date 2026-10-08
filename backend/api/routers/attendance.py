from fastapi import APIRouter, HTTPException, status

import api.db
import api.dependencies
import api.schemas

router = APIRouter(tags=["attendance"])


@router.get("/clubs/{club_id}/attendance/", response_model=list[api.schemas.AttendanceRecordPublic])
async def get_club_attendance(club: api.dependencies.ClubDep):
    records_with_users = api.db.get_club_attendance(club.id)  # type: ignore
    result = []
    for record, user_ids in records_with_users:
        assert record.id is not None
        result.append(
            api.schemas.AttendanceRecordPublic(
                id=record.id,
                club_id=record.club_id,
                date=record.date,
                attended_user_ids=user_ids,
            )
        )
    return result


@router.post(
    "/clubs/{club_id}/attendance/",
    status_code=status.HTTP_201_CREATED,
    response_model=api.schemas.AttendanceRecordPublic,
)
async def create_attendance(
    club: api.dependencies.ClubLeaderAccessDep,
    attendance_create: api.schemas.AttendanceRecordCreate,
):
    record, user_ids = api.db.create_attendance(
        club_id=club.id,  # type: ignore
        date=attendance_create.date,
        attended_user_ids=attendance_create.attended_user_ids,
    )
    assert record.id is not None
    return api.schemas.AttendanceRecordPublic(
        id=record.id,
        club_id=record.club_id,
        date=record.date,
        attended_user_ids=user_ids,
    )


@router.get("/attendance/{record_id}", response_model=api.schemas.AttendanceRecordPublic)
async def get_attendance(record_id: int):
    item = api.db.get_attendance_by_id(record_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Attendance record not found")

    record, user_ids = item
    assert record.id is not None
    return api.schemas.AttendanceRecordPublic(
        id=record.id,
        club_id=record.club_id,
        date=record.date,
        attended_user_ids=user_ids,
    )


@router.patch("/attendance/{record_id}", response_model=api.schemas.AttendanceRecordPublic)
async def update_attendance(
    record_id: int,
    attendance_update: api.schemas.AttendanceRecordUpdate,
    current_user: api.dependencies.CurrentUserDep,
    session: api.dependencies.SessionDep,
):
    item = api.db.get_attendance_by_id(record_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Attendance record not found")

    record, _ = item
    club = api.db.get_club_by_id(record.club_id)
    if club is None or club.leader_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Only club leader can update attendance")

    date_val = None
    if not isinstance(attendance_update.date, api.schemas.UnsetType):
        date_val = attendance_update.date

    attended_ids_val = None
    if not isinstance(attendance_update.attended_user_ids, api.schemas.UnsetType):
        attended_ids_val = attendance_update.attended_user_ids

    updated_record, user_ids = api.db.update_attendance(
        session, record, date=date_val, attended_user_ids=attended_ids_val
    )
    assert updated_record.id is not None
    return api.schemas.AttendanceRecordPublic(
        id=updated_record.id,
        club_id=updated_record.club_id,
        date=updated_record.date,
        attended_user_ids=user_ids,
    )


@router.delete("/attendance/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_attendance(
    record_id: int,
    current_user: api.dependencies.CurrentUserDep,
    session: api.dependencies.SessionDep,
) -> None:
    item = api.db.get_attendance_by_id(record_id)
    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Attendance record not found")

    record, _ = item
    club = api.db.get_club_by_id(record.club_id)
    if club is None or club.leader_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Only club leader can delete attendance")

    api.db.delete_attendance(session, record)
