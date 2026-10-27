# Всё, что связано с паролями и проверкой входа
import hashlib
import secrets

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User


def hash_password(password):
    """Превращает пароль в хэш. Соль - случайная строка, чтобы одинаковые
    пароли давали разные хэши."""
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000).hex()
    return f"{salt}${password_hash}"


def check_password(password, saved_hash):
    """Проверяет, что пароль подходит к сохранённому хэшу."""
    salt, password_hash = saved_hash.split("$")
    new_hash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000).hex()
    return secrets.compare_digest(new_hash, password_hash)


def create_token():
    """Случайная строка, по которой узнаём пользователя."""
    return secrets.token_hex(32)


def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Находит пользователя по токену из заголовка Authorization: Bearer <токен>.
    Если токена нет или он неверный - ошибка 401."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Нужно войти в аккаунт")

    token = authorization.replace("Bearer ", "")
    user = db.query(User).filter(User.token == token).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Нужно войти в аккаунт")
    return user


def get_admin(user: User = Depends(get_current_user)):
    """То же самое, но пускает только администратора."""
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Доступ только для администратора")
    return user
