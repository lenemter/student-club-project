from os import getenv

import sqlalchemy
from sqlmodel import SQLModel, create_engine

import api.utils

engine = create_engine(
    sqlalchemy.URL.create(
        drivername="postgresql+psycopg",
        username=api.utils.read_secret("POSTGRES_USER") or "postgres",
        password=api.utils.read_secret("POSTGRES_PASSWORD") or "postgrespassword",
        database=getenv("POSTGRES_DB") or "student_clubs",
        host=getenv("POSTGRES_HOST") or "localhost",
        port=int(getenv("POSTGRES_PORT") or 5432),
    ),
    echo=getenv("DEBUG") == "True",
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
