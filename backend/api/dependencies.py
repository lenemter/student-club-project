from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlmodel import Session

import api.db
import api.utils

# --- Session ---


def get_session():
    with Session(api.db.engine, expire_on_commit=False) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

# --- User Validation ---

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="auth/token", auto_error=False)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> api.db.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        secret_key = api.utils.read_secret("SECRET_KEY") or "default_secret_key_student_clubs"
        payload = jwt.decode(token, secret_key, algorithms=[api.utils.HASH_ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.InvalidTokenError:
        raise credentials_exception

    user = api.db.get_user_by_email(email)
    if user is None:
        raise credentials_exception
    if user.id is None:
        raise credentials_exception

    return user


CurrentUserDep = Annotated[api.db.User, Depends(get_current_user)]


async def get_current_user_optional(
    token: Annotated[str | None, Depends(oauth2_scheme_optional)],
) -> api.db.User | None:
    if not token:
        return None
    try:
        secret_key = api.utils.read_secret("SECRET_KEY") or "default_secret_key_student_clubs"
        payload = jwt.decode(token, secret_key, algorithms=[api.utils.HASH_ALGORITHM])
        email = payload.get("sub")
        if email is None:
            return None
        return api.db.get_user_by_email(email)
    except jwt.InvalidTokenError:
        return None


CurrentUserOptionalDep = Annotated[api.db.User | None, Depends(get_current_user_optional)]

# --- Club Permissions ---


def leader_get_club(club_id: int, current_user: CurrentUserDep, session: SessionDep) -> api.db.Club:
    club = session.get(api.db.Club, club_id)
    if club is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Club not found")
    if club.leader_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Only the club leader can perform this action")

    return club


ClubLeaderAccessDep = Annotated[api.db.Club, Depends(leader_get_club)]


def get_club(club_id: int, session: SessionDep) -> api.db.Club:
    club = session.get(api.db.Club, club_id)
    if club is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Club not found")
    return club


ClubDep = Annotated[api.db.Club, Depends(get_club)]
