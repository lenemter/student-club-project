from fastapi import APIRouter, HTTPException, status

import api.db
import api.dependencies
import api.schemas

router = APIRouter(tags=["memberships"])


@router.get("/clubs/{club_id}/memberships/", response_model=list[api.schemas.MembershipPublic])
async def get_club_memberships(club: api.dependencies.ClubDep):
    assert club.id is not None
    return api.db.get_club_memberships(club.id)


@router.get("/users/me/memberships", response_model=list[api.schemas.MembershipPublic])
async def get_my_memberships(current_user: api.dependencies.CurrentUserDep):
    assert current_user.id is not None
    return api.db.get_user_memberships(current_user.id)


@router.post(
    "/clubs/{club_id}/members/",
    status_code=status.HTTP_201_CREATED,
    response_model=api.schemas.MembershipPublic,
)
async def add_member(
    club: api.dependencies.ClubLeaderAccessDep,
    user_id: int,
):
    if club.leader_id == user_id:
        raise HTTPException(status.HTTP_409_CONFLICT, "User is already the leader of this club")

    if api.db.get_user_by_id(user_id) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    assert club.id is not None
    return api.db.add_member(club.id, user_id)


@router.delete("/clubs/{club_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_member(
    club: api.dependencies.ClubDep,
    user_id: int,
    current_user: api.dependencies.CurrentUserDep,
) -> None:
    # Only club leader or the member themselves can remove
    if current_user.id != club.leader_id and current_user.id != user_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not allowed to remove this member")

    if club.leader_id == user_id:
        raise HTTPException(status.HTTP_409_CONFLICT, "Cannot remove the leader from the club")

    assert club.id is not None
    api.db.remove_member(club.id, user_id)
