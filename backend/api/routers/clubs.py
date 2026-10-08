from fastapi import APIRouter, HTTPException, status

import api.db
import api.dependencies
import api.schemas

router = APIRouter(prefix="/clubs", tags=["clubs"])


@router.get("/", response_model=list[api.schemas.ClubPublic])
async def get_all_clubs():
    return api.db.get_all_clubs()


@router.get("/my", response_model=list[api.schemas.ClubPublic])
async def get_my_clubs(current_user: api.dependencies.CurrentUserDep):
    return api.db.get_user_clubs(current_user.id)


@router.get("/joinable", response_model=list[api.schemas.ClubPublic])
async def get_joinable_clubs(current_user: api.dependencies.CurrentUserDep):
    return api.db.get_joinable_clubs(current_user.id)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=api.schemas.ClubPublic)
async def create_club(
    current_user: api.dependencies.CurrentUserDep,
    club_create: api.schemas.ClubCreate,
):
    return api.db.create_club(current_user, **club_create.model_dump())


@router.get("/{club_id}", response_model=api.schemas.ClubPublic)
async def get_club(club: api.dependencies.ClubDep):
    return club


@router.patch("/{club_id}", response_model=api.schemas.ClubPublic)
async def update_club(
    club: api.dependencies.ClubLeaderAccessDep,
    club_update: api.schemas.ClubUpdate,
    session: api.dependencies.SessionDep,
):
    return api.db.update_club(session, club, club_update.model_dump(exclude_unset=True))


@router.delete("/{club_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_club(
    club: api.dependencies.ClubLeaderAccessDep,
    session: api.dependencies.SessionDep,
) -> None:
    api.db.delete_club(session, club)


@router.get("/{club_id}/members", response_model=list[api.schemas.UserPublic])
async def get_club_members(club: api.dependencies.ClubDep):
    assert club.id is not None
    return api.db.get_club_members(club.id)
