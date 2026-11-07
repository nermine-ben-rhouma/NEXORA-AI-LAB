
import sqlite3
from pathlib import Path

# Chemin de la base de données
BASE_DIR = Path(__file__).resolve().parents[2]
DATABASE_PATH = BASE_DIR / "lingua_ai.db"


def get_connection():
    """Créer une connexion SQLite."""
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    """Initialiser la base de données sans supprimer les anciennes données."""
    connection = get_connection()

    try:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS translations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                original_text TEXT NOT NULL,
                translated_text TEXT NOT NULL,
                source_language TEXT NOT NULL,
                target_language TEXT NOT NULL,
                tone TEXT NOT NULL,
                model TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER
            )
        """)

        # Migration pour les anciennes bases de données
        columns = connection.execute(
            "PRAGMA table_info(translations)"
        ).fetchall()

        column_names = [column["name"] for column in columns]

        if "user_id" not in column_names:
            connection.execute("""
                ALTER TABLE translations
                ADD COLUMN user_id INTEGER
            """)

        connection.execute("""
            CREATE INDEX IF NOT EXISTS idx_translations_created_at
            ON translations(created_at)
        """)

        connection.commit()

    finally:
        connection.close()


def save_translation(
    original_text,
    translated_text,
    source_language,
    target_language,
    tone,
    model,
    user_id=None
):
    """Enregistrer une traduction sans compte obligatoire."""
    connection = get_connection()

    try:
        cursor = connection.execute("""
            INSERT INTO translations (
                original_text,
                translated_text,
                source_language,
                target_language,
                tone,
                model,
                user_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            original_text,
            translated_text,
            source_language,
            target_language,
            tone,
            model,
            user_id
        ))

        connection.commit()
        return cursor.lastrowid

    finally:
        connection.close()


def get_translations(user_id=None):
    """Récupérer l'historique global ou celui d'un utilisateur."""
    connection = get_connection()

    try:
        if user_id is None:
            cursor = connection.execute("""
                SELECT *
                FROM translations
                ORDER BY created_at DESC, id DESC
            """)
        else:
            cursor = connection.execute("""
                SELECT *
                FROM translations
                WHERE user_id = ?
                ORDER BY created_at DESC, id DESC
            """, (user_id,))

        return [dict(row) for row in cursor.fetchall()]

    finally:
        connection.close()


def delete_translation(translation_id, user_id=None):
    """Supprimer une traduction."""
    connection = get_connection()

    try:
        if user_id is None:
            cursor = connection.execute("""
                DELETE FROM translations
                WHERE id = ?
            """, (translation_id,))
        else:
            cursor = connection.execute("""
                DELETE FROM translations
                WHERE id = ? AND user_id = ?
            """, (translation_id, user_id))

        connection.commit()
        return cursor.rowcount > 0

    finally:
        connection.close()


def get_translation_statistics(user_id=None):
    """Calculer les statistiques globales ou celles d'un utilisateur."""
    connection = get_connection()

    try:
        if user_id is None:
            where_clause = ""
            params = ()
        else:
            where_clause = "WHERE user_id = ?"
            params = (user_id,)

        total = connection.execute(
            f"""
            SELECT COUNT(*) AS total
            FROM translations
            {where_clause}
            """,
            params
        ).fetchone()["total"]

        languages = connection.execute(
            f"""
            SELECT target_language, COUNT(*) AS count
            FROM translations
            {where_clause}
            GROUP BY target_language
            ORDER BY count DESC
            """,
            params
        ).fetchall()

        tones = connection.execute(
            f"""
            SELECT tone, COUNT(*) AS count
            FROM translations
            {where_clause}
            GROUP BY tone
            ORDER BY count DESC
            """,
            params
        ).fetchall()

        activity_filter = (
            "AND user_id = ?" if user_id is not None else ""
        )

        recent_activity = connection.execute(
            f"""
            SELECT DATE(created_at) AS date, COUNT(*) AS count
            FROM translations
            WHERE created_at >= DATE('now', '-6 days')
            {activity_filter}
            GROUP BY DATE(created_at)
            ORDER BY date ASC
            """,
            params
        ).fetchall()

        return {
            "total_translations": total,
            "languages": [dict(row) for row in languages],
            "tones": [dict(row) for row in tones],
            "recent_activity": [
                dict(row) for row in recent_activity
            ]
        }

    finally:
        connection.close()


def initialize_users_table():
    """Conserver la table utilisateurs existante sans l'utiliser."""
    connection = get_connection()

    try:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)

        connection.commit()

    finally:
        connection.close()
