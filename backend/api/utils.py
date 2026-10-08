import os
import bcrypt

HASH_ALGORITHM = "HS256"

secrets_cache: dict[str, str] = dict()


def read_secret(secret_name: str) -> str | None:
    if secret_name in secrets_cache:
        return secrets_cache[secret_name]

    env_val = os.getenv(secret_name)
    if env_val:
        secrets_cache[secret_name] = env_val
        return env_val

    try:
        with open(f"secrets/{secret_name}") as file:
            secret_content = file.read().strip()
            secrets_cache[secret_name] = secret_content
            return secret_content
    except OSError:
        return None


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())
