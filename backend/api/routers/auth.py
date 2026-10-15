from datetime import datetime, timedelta, timezone
from typing import Annotated
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import jwt
from pydantic import BaseModel

import api.db
import api.dependencies
import api.schemas
import api.utils

ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

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


def create_access_token(data: dict, expires_delta: timedelta) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "access", "jti": uuid.uuid4().hex})

    secret_key = api.utils.read_secret("SECRET_KEY") or "default_secret_key_student_clubs"
    return jwt.encode(to_encode, secret_key, algorithm=api.utils.HASH_ALGORITHM)


def create_refresh_token(data: dict, expires_delta: timedelta) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "refresh", "jti": uuid.uuid4().hex})

    secret_key = api.utils.read_secret("SECRET_KEY") or "default_secret_key_student_clubs"
    return jwt.encode(to_encode, secret_key, algorithm=api.utils.HASH_ALGORITHM)


def issue_tokens(user: api.db.User) -> api.schemas.Token:
    assert user.id is not None

    access_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_delta = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_delta,
    )
    refresh_token = create_refresh_token(
        data={"sub": user.email},
        expires_delta=refresh_delta,
    )

    api.db.create_refresh_token(
        token=refresh_token,
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + refresh_delta,
    )

    return api.schemas.Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )


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

    return issue_tokens(user)


@router.post("/login", response_model=api.schemas.Token)
async def login_json(login_data: LoginRequest) -> api.schemas.Token:
    user = authenticate_user(login_data.email, login_data.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return issue_tokens(user)


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

    return issue_tokens(new_user)


@router.post("/refresh", response_model=api.schemas.Token)
async def refresh_access_token(token_request: api.schemas.RefreshTokenRequest) -> api.schemas.Token:
    secret_key = api.utils.read_secret("SECRET_KEY") or "default_secret_key_student_clubs"

    try:
        payload = jwt.decode(
            token_request.refresh_token,
            secret_key,
            algorithms=[api.utils.HASH_ALGORITHM],
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type, refresh token expected",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_record = api.db.get_refresh_token(token_request.refresh_token)
    if token_record is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found or invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if token_record.revoked:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )

    now = datetime.now(timezone.utc)
    record_exp = token_record.expires_at
    if record_exp.tzinfo is None:
        record_exp = record_exp.replace(tzinfo=timezone.utc)
    if record_exp < now:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = payload.get("sub")
    user = api.db.get_user_by_email(email) if email else None
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Revoke old refresh token (rotation) and issue fresh pair
    api.db.revoke_refresh_token(token_request.refresh_token)
    return issue_tokens(user)


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    logout_data: api.schemas.LogoutRequest | None = None,
    current_user: api.dependencies.CurrentUserOptionalDep = None,
):
    if logout_data and logout_data.refresh_token:
        api.db.revoke_refresh_token(logout_data.refresh_token)
    elif current_user and current_user.id:
        api.db.revoke_user_refresh_tokens(current_user.id)

    return {"detail": "Successfully logged out"}
