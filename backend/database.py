# Подключение к базе данных PostgreSQL
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Адрес базы берём из переменной окружения (её задаёт docker-compose).
# Если переменной нет - используем адрес по умолчанию для локального запуска.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5433/shop",
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


def get_db():
    """Открывает соединение с базой на время одного запроса."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
