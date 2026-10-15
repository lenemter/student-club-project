from typing import Any

from sqlmodel import Session, col, select

from ..db import engine
from ..models.notification import Notification


def get_user_notifications(user_id: int) -> list[Notification]:
    with Session(engine) as session:
        return list(
            session.exec(
                select(Notification)
                .where(Notification.user_id == user_id)
                .order_by(col(Notification.created_at).desc())
            ).all()
        )


def get_notification_by_id(notification_id: int) -> Notification | None:
    with Session(engine) as session:
        return session.get(Notification, notification_id)


def create_notification(**kwargs) -> Notification:
    with Session(engine) as session:
        notif = Notification(**kwargs)
        session.add(notif)
        session.commit()
        session.refresh(notif)

        return notif


def update_notification(
    session: Session, notification: Notification, update: dict[str, Any]
) -> Notification:
    notification.sqlmodel_update(update)
    session.add(notification)
    session.commit()
    session.refresh(notification)

    return notification


def delete_notification(session: Session, notification: Notification) -> None:
    session.delete(notification)
    session.commit()
