# Регистрация, вход и выход
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import check_password, create_token, get_current_user, hash_password
from database import get_db
from models import User
from schemas import LoginData, RegisterData

router = APIRouter(prefix="/api")


@router.post("/register")
def register(data: RegisterData, db: Session = Depends(get_db)):
    email = data.email.strip().lower()

    # Простые проверки данных
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Неверный email")
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Пароль должен быть не короче 6 символов")
    if not data.name.strip():
        raise HTTPException(status_code=400, detail="Введите имя")
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже есть")

    user = User(
        email=email,
        name=data.name.strip(),
        password_hash=hash_password(data.password),
        token=create_token(),
    )
    db.add(user)
    db.commit()
    return {"token": user.token, "user": user.to_dict()}


@router.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    email = data.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()

    if user is None or not check_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    # При каждом входе выдаём новый токен
    user.token = create_token()
    db.commit()
    return {"token": user.token, "user": user.to_dict()}


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return user.to_dict()


@router.post("/logout")
def logout(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Стираем токен - старый больше не подойдёт
    user.token = None
    db.commit()
    return {"status": "ok"}
