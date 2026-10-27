# Главный файл бэкенда. Запуск: uvicorn main:app --reload
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import Base, SessionLocal, engine
from routers import admin, auth_routes, products, shop
from seed import fill_database

app = FastAPI(title="AllianceBoardShop API")

# Загруженные админом фото лежат в папке uploads
# и открываются по адресу /uploads/имя_файла
os.makedirs(admin.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=admin.UPLOAD_DIR), name="uploads")

# Разрешаем фронтенду (Vite на порту 5173) обращаться к бэкенду
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем адреса API из папки routers
app.include_router(products.router)
app.include_router(auth_routes.router)
app.include_router(shop.router)
app.include_router(admin.router)


@app.on_event("startup")
def startup():
    # Создаём таблицы, если их ещё нет, и заполняем тестовыми данными
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    fill_database(db)
    db.close()


@app.get("/api/health")
def health():
    return {"status": "ok"}
