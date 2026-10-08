from fastapi import APIRouter, HTTPException, status

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


@router.get("/{user_id}", response_model=api.schemas.UserPublic)
async def get_user(user_id: int):
    user = api.db.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    return user


@router.get("/", response_model=list[api.schemas.UserPublic])
async def get_users():
    return api.db.get_all_users()
