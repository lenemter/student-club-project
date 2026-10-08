from fastapi import APIRouter, HTTPException, status

import api.db
import api.dependencies
import api.schemas

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/", response_model=list[api.schemas.NotificationPublic])
async def get_my_notifications(current_user: api.dependencies.CurrentUserDep):
    return api.db.get_user_notifications(current_user.id)  # type: ignore


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=api.schemas.NotificationPublic)
async def create_notification(
    notification_create: api.schemas.NotificationCreate,
    current_user: api.dependencies.CurrentUserDep,
):
    return api.db.create_notification(**notification_create.model_dump())


@router.patch("/{notification_id}", response_model=api.schemas.NotificationPublic)
async def update_notification(
    notification_id: int,
    notification_update: api.schemas.NotificationUpdate,
    current_user: api.dependencies.CurrentUserDep,
    session: api.dependencies.SessionDep,
):
    notif = api.db.get_notification_by_id(notification_id)
    if notif is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found")

    if notif.user_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not allowed to modify this notification")

    return api.db.update_notification(
        session, notif, notification_update.model_dump(exclude_unset=True)
    )


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: int,
    current_user: api.dependencies.CurrentUserDep,
    session: api.dependencies.SessionDep,
) -> None:
    notif = api.db.get_notification_by_id(notification_id)
    if notif is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found")

    if notif.user_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not allowed to delete this notification")

    api.db.delete_notification(session, notif)
