import os
import shutil
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile, status

import api.db
import api.dependencies
import api.schemas
import api.utils

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


@router.post("/upload-image", response_model=dict[str, str])
async def upload_club_image(
    current_user: api.dependencies.CurrentUserDep,
    file: UploadFile = File(...),
):
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Allowed: JPEG, PNG, WebP, GIF",
        )

    ext = os.path.splitext(file.filename or "")[1] or ".png"
    filename = f"{uuid.uuid4().hex}{ext}"
    clubs_dir = os.path.join(api.utils.UPLOAD_DIR, "clubs")
    os.makedirs(clubs_dir, exist_ok=True)
    filepath = os.path.join(clubs_dir, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/static/clubs/{filename}"
    return {"imageUrl": image_url, "image_url": image_url}


@router.post("/{club_id}/image", response_model=api.schemas.ClubPublic)
async def upload_existing_club_image(
    club: api.dependencies.ClubLeaderAccessDep,
    session: api.dependencies.SessionDep,
    file: UploadFile = File(...),
):
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Allowed: JPEG, PNG, WebP, GIF",
        )

    ext = os.path.splitext(file.filename or "")[1] or ".png"
    filename = f"{uuid.uuid4().hex}{ext}"
    clubs_dir = os.path.join(api.utils.UPLOAD_DIR, "clubs")
    os.makedirs(clubs_dir, exist_ok=True)
    filepath = os.path.join(clubs_dir, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/static/clubs/{filename}"
    return api.db.update_club(session, club, {"image_url": image_url})

