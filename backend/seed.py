"""Seed script to populate initial mock data into the database."""
from datetime import datetime
import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from sqlmodel import Session, select
import api.db as db
import api.utils as utils


def seed():
    print("Creating tables if they don't exist...")
    db.create_db_and_tables()

    with Session(db.engine) as session:
        # Check if already seeded
        existing_users = session.exec(select(db.User)).all()
        if existing_users:
            print(f"Database already contains {len(existing_users)} users. Skipping seed.")
            return

        print("Seeding users...")
        users_data = [
            {
                "id": 1,
                "email": "lenemter@gmail.com",
                "first_name": "Леонид",
                "last_name": "Копылов",
                "about_me": "3 курс",
                "avatar_url": "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
                "password": "password123",
            },
            {
                "id": 2,
                "email": "ivanov@example.com",
                "first_name": "Андрей",
                "last_name": "Иванов",
                "about_me": "",
                "avatar_url": "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
                "password": "password123",
            },
            {
                "id": 3,
                "email": "smirnov@example.com",
                "first_name": "Борис",
                "last_name": "Смирнов",
                "about_me": "",
                "avatar_url": "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
                "password": "password123",
            },
            {
                "id": 4,
                "email": "popov@example.com",
                "first_name": "Владимир",
                "last_name": "Попов",
                "about_me": "",
                "avatar_url": "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
                "password": "password123",
            },
            {
                "id": 5,
                "email": "kuznetsov@example.com",
                "first_name": "Максим",
                "last_name": "Кузнецов",
                "about_me": "",
                "avatar_url": "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
                "password": "password123",
            },
        ]

        for u in users_data:
            pwd = u.pop("password")
            user = db.User(**u, hashed_password=utils.get_password_hash(pwd))
            session.add(user)
        session.commit()

        print("Seeding clubs...")
        clubs_data = [
            {
                "id": 1,
                "name": "Баскетбол",
                "description": "Баскетболим",
                "image_url": "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg",
                "schedule": "Понедельник, четверг в 17:00",
                "leader_id": 1,
            },
            {
                "id": 2,
                "name": "Настольный теннис",
                "description": "Теннисим",
                "image_url": "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg",
                "schedule": "Понедельник, четверг в 17:00",
                "leader_id": 2,
            },
            {
                "id": 3,
                "name": "Теннис",
                "description": "Пока что нет описания",
                "image_url": "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg",
                "schedule": "Понедельник, четверг в 17:00",
                "leader_id": 2,
            },
            {
                "id": 4,
                "name": "Футбол",
                "description": "Пока что нет описания",
                "image_url": "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg",
                "schedule": "Понедельник, четверг в 17:00",
                "leader_id": 2,
            },
        ]

        for c in clubs_data:
            club = db.Club(**c)
            session.add(club)
        session.commit()

        print("Seeding memberships...")
        memberships_data = [
            {"user_id": 1, "club_id": 2},
            {"user_id": 2, "club_id": 1},
            {"user_id": 3, "club_id": 3},
            {"user_id": 3, "club_id": 2},
            {"user_id": 4, "club_id": 4},
            {"user_id": 4, "club_id": 1},
        ]
        for m in memberships_data:
            membership = db.Membership(**m)
            session.add(membership)
        session.commit()

        print("Seeding join requests...")
        requests_data = [
            {"user_id": 1, "club_id": 3, "status": "pending"},
            {"user_id": 1, "club_id": 4, "status": "rejected"},
            {"user_id": 3, "club_id": 1, "status": "pending"},
            {"user_id": 4, "club_id": 2, "status": "approved"},
        ]
        for r in requests_data:
            req = db.JoinRequest(**r)
            session.add(req)
        session.commit()

        print("Seeding attendance...")
        attendance_records = [
            {"club_id": 1, "attended_user_ids": [2, 3]},
            {"club_id": 2, "attended_user_ids": [1, 3, 4]},
            {"club_id": 1, "attended_user_ids": [2, 1, 4]},
        ]
        for item in attendance_records:
            rec = db.AttendanceRecord(club_id=item["club_id"], date=datetime.utcnow())
            session.add(rec)
            session.commit()
            session.refresh(rec)
            for uid in item["attended_user_ids"]:
                session.add(db.AttendanceUser(attendance_id=rec.id, user_id=uid))
            session.commit()

        print("Seeding notifications...")
        notifications_data = [
            {
                "user_id": 1,
                "title": "Заявка одобрена",
                "description": "Вы приняты в кружок «Теннис»",
                "type": "success",
                "is_read": False,
            },
            {
                "user_id": 1,
                "title": "Заявка одобрена",
                "description": "Вы приняты в кружок «Баскетбол»",
                "type": "success",
                "is_read": False,
            },
        ]
        for n in notifications_data:
            session.add(db.Notification(**n))
        session.commit()

        # Update sequences so subsequent inserts without explicit ID work properly
        session.execute(text('SELECT setval(\'user_id_seq\', COALESCE((SELECT MAX(id) FROM "user"), 1));'))
        session.execute(text('SELECT setval(\'club_id_seq\', COALESCE((SELECT MAX(id) FROM "club"), 1));'))
        session.commit()

        print("Seeding completed successfully!")


if __name__ == "__main__":
    seed()
