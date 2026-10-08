from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import jwt
from pydantic import BaseModel

import api.db
import api.schemas
import api.utils

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


def authenticate_user(email: str, password: str) -> api.db.User | None:
    user = api.db.get_user_by_email(email)
    if user is None:
        return None
    if not api.utils.verify_password(password, user.hashed_password):
        return None

    return user


def create_access_token(data: dict, expires_delta: timedelta) -> api.schemas.Token:
    expire = datetime.now(timezone.utc) + expires_delta

    to_encode = data.copy()
    to_encode.update({"exp": expire})

    secret_key = api.utils.read_secret("SECRET_KEY") or "default_secret_key_student_clubs"
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=api.utils.HASH_ALGORITHM)

    return api.schemas.Token(access_token=encoded_jwt, token_type="bearer")


@router.post("/token", response_model=api.schemas.Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> api.schemas.Token:
    # OAuth2 form uses 'username' field, which maps to user email
    user = authenticate_user(form_data.username, form_data.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )


@router.post("/login", response_model=api.schemas.Token)
async def login_json(login_data: LoginRequest) -> api.schemas.Token:
    user = authenticate_user(login_data.email, login_data.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=api.schemas.Token)
async def register(user_create: api.schemas.UserCreate) -> api.schemas.Token:
    if api.db.get_user_by_email(user_create.email) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "User with this email already exists")

    new_user = api.db.register_user(
        email=user_create.email,
        first_name=user_create.first_name,
        last_name=user_create.last_name,
        about_me=user_create.about_me or "",
        avatar_url=user_create.avatar_url or "",
        hashed_password=api.utils.get_password_hash(user_create.password),
    )

    return create_access_token(
        data={"sub": new_user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
