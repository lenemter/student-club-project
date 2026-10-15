from datetime import datetime

from sqlmodel import Session, select

from ..db import engine
from ..models.refresh_token import RefreshToken


def create_refresh_token(token: str, user_id: int, expires_at: datetime) -> RefreshToken:
    with Session(engine) as session:
        record = RefreshToken(
            token=token,
            user_id=user_id,
            expires_at=expires_at,
            revoked=False,
        )
        session.add(record)
        session.commit()
        session.refresh(record)
        return record


def get_refresh_token(token: str) -> RefreshToken | None:
    with Session(engine) as session:
        return session.exec(
            select(RefreshToken).where(RefreshToken.token == token)
        ).first()


def revoke_refresh_token(token: str) -> bool:
    with Session(engine) as session:
        record = session.exec(
            select(RefreshToken).where(RefreshToken.token == token)
        ).first()
        if record is None:
            return False
        record.revoked = True
        session.add(record)
        session.commit()
        return True


def revoke_user_refresh_tokens(user_id: int) -> None:
    with Session(engine) as session:
        records = session.exec(
            select(RefreshToken).where(
                RefreshToken.user_id == user_id,
                RefreshToken.revoked == False,
            )
        ).all()
        for record in records:
            record.revoked = True
            session.add(record)
        session.commit()
