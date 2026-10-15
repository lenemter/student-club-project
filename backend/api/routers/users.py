import os
import shutil
from typing import Annotated
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile, status

import api.db
import api.dependencies
import api.schemas
import api.utils

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=api.schemas.UserPublic)
async def get_user_me(current_user: api.dependencies.CurrentUserDep):
    return current_user


@router.patch("/me", response_model=api.schemas.UserPublic)
async def edit_user_me(
    current_user: api.dependencies.CurrentUserDep,
    user_update: api.schemas.UserUpdate,
    session: api.dependencies.SessionDep,
):
    to_update = user_update.model_dump(exclude_unset=True, exclude={"password"})

    if not isinstance(user_update.password, api.schemas.UnsetType):
        to_update["hashed_password"] = api.utils.get_password_hash(user_update.password)

    # Check if email is updated and is already taken
    if "email" in to_update and to_update["email"] != current_user.email:
        existing = api.db.get_user_by_email(to_update["email"])
        if existing is not None:
            raise HTTPException(status.HTTP_409_CONFLICT, "Email already in use")

    return api.db.update_user(session, current_user, to_update)


@router.post("/me/avatar", response_model=api.schemas.UserPublic)
async def upload_user_avatar(
    current_user: api.dependencies.CurrentUserDep,
    session: api.dependencies.SessionDep,
    file: Annotated[UploadFile, File()],
):
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Allowed: JPEG, PNG, WebP, GIF",
        )

    ext = os.path.splitext(file.filename or "")[1] or ".png"
    filename = f"{uuid.uuid4().hex}{ext}"
    avatars_dir = os.path.join(api.utils.UPLOAD_DIR, "avatars")
    os.makedirs(avatars_dir, exist_ok=True)
    filepath = os.path.join(avatars_dir, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    avatar_url = f"/static/avatars/{filename}"
    return api.db.update_user(session, current_user, {"avatar_url": avatar_url})


@router.get("/{user_id}", response_model=api.schemas.UserPublic)
async def get_user(user_id: int):
    user = api.db.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    return user


@router.get("/", response_model=list[api.schemas.UserPublic])
async def get_users():
    return api.db.get_all_users()
