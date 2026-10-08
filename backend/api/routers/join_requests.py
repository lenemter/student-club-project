from fastapi import APIRouter, HTTPException, status

import api.db
import api.dependencies
import api.schemas

router = APIRouter(prefix="/join-requests", tags=["join_requests"])


@router.get("/", response_model=list[api.schemas.JoinRequestPublic])
async def get_join_requests(
    current_user: api.dependencies.CurrentUserDep,
    club_id: int | None = None,
    status_filter: str | None = None,
):
    if club_id is not None:
        club = api.db.get_club_by_id(club_id)
        if club is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Club not found")
        # If user is not leader, they can only see their own requests
        if club.leader_id != current_user.id:
            return api.db.get_join_requests(
                club_id=club_id, user_id=current_user.id, status=status_filter
            )
        return api.db.get_join_requests(club_id=club_id, status=status_filter)

    # If no club_id provided, return current user's requests
    return api.db.get_join_requests(user_id=current_user.id, status=status_filter)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=api.schemas.JoinRequestPublic)
async def create_join_request(
    current_user: api.dependencies.CurrentUserDep,
    request_data: api.schemas.JoinRequestCreate,
):
    club = api.db.get_club_by_id(request_data.club_id)
    if club is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Club not found")

    if club.leader_id == current_user.id:
        raise HTTPException(status.HTTP_409_CONFLICT, "You are already the leader of this club")

    assert club.id is not None
    assert current_user.id is not None

    if api.db.is_club_member(club.id, current_user.id):
        raise HTTPException(status.HTTP_409_CONFLICT, "You are already a member of this club")

    new_req = api.db.create_join_request(
        user_id=current_user.id, club_id=request_data.club_id
    )

    # Notify club leader
    user_name = f"{current_user.first_name} {current_user.last_name}"
    api.db.create_notification(
        user_id=club.leader_id,
        title="Новая заявка на вступление",
        description=f"{user_name} подал(а) заявку на вступление в кружок «{club.name}»",
        type="info",
    )

    return new_req


@router.get("/{request_id}", response_model=api.schemas.JoinRequestPublic)
async def get_join_request(
    request_id: int,
    current_user: api.dependencies.CurrentUserDep,
):
    req = api.db.get_join_request_by_id(request_id)
    if req is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Join request not found")

    club = api.db.get_club_by_id(req.club_id)
    if req.user_id != current_user.id and (club is None or club.leader_id != current_user.id):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not enough permissions")

    return req


@router.patch("/{request_id}", response_model=api.schemas.JoinRequestPublic)
async def update_join_request(
    request_id: int,
    request_update: api.schemas.JoinRequestUpdate,
    current_user: api.dependencies.CurrentUserDep,
    session: api.dependencies.SessionDep,
):
    req = api.db.get_join_request_by_id(request_id)
    if req is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Join request not found")

    club = api.db.get_club_by_id(req.club_id)
    if club is None or club.leader_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Only club leader can approve or reject requests")

    updated_req = api.db.update_join_request(
        session, req, {"status": request_update.status}
    )

    if request_update.status == "approved":
        assert club.id is not None
        assert req.user_id is not None

        api.db.add_member(club.id, req.user_id)
        api.db.create_notification(
            user_id=req.user_id,
            title="Заявка одобрена",
            description=f"Вы приняты в кружок «{club.name}»",
            type="success",
        )
    elif request_update.status == "rejected":
        api.db.create_notification(
            user_id=req.user_id,
            title="Заявка отклонена",
            description=f"Ваша заявка в кружок «{club.name}» была отклонена",
            type="warning",
        )

    return updated_req


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_join_request(
    request_id: int,
    current_user: api.dependencies.CurrentUserDep,
    session: api.dependencies.SessionDep,
) -> None:
    req = api.db.get_join_request_by_id(request_id)
    if req is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Join request not found")

    club = api.db.get_club_by_id(req.club_id)
    if req.user_id != current_user.id and (club is None or club.leader_id != current_user.id):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not enough permissions")

    api.db.delete_join_request(session, req)
