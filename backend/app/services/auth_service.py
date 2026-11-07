
from passlib.context import CryptContext
from app.database.connection import get_connection

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def register_user(full_name: str, email: str, password: str):
    connection = get_connection()

    try:
        existing_user = connection.execute(
            "SELECT id FROM users WHERE email = ?",
            (email.strip().lower(),)
        ).fetchone()

        if existing_user:
            raise ValueError("This email is already registered.")

        password_hash = hash_password(password)

        cursor = connection.execute(
            """
            INSERT INTO users (full_name, email, password_hash)
            VALUES (?, ?, ?)
            """,
            (
                full_name.strip(),
                email.strip().lower(),
                password_hash
            )
        )

        connection.commit()

        return {
            "id": cursor.lastrowid,
            "full_name": full_name.strip(),
            "email": email.strip().lower()
        }

    finally:
        connection.close()


def authenticate_user(email: str, password: str):
    connection = get_connection()

    try:
        user = connection.execute(
            """
            SELECT id, full_name, email, password_hash
            FROM users
            WHERE email = ?
            """,
            (email.strip().lower(),)
        ).fetchone()

        if not user:
            return None

        if not verify_password(password, user["password_hash"]):
            return None

        return {
            "id": user["id"],
            "full_name": user["full_name"],
            "email": user["email"]
        }

    finally:
        connection.close()
