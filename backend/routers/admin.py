# Админка: управление товарами, заказами и просмотр пользователей.
# Каждый адрес проверяет, что пользователь - администратор (get_admin).
import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from auth import get_admin
from database import get_db
from models import CartItem, Category, Favorite, Order, Product, User
from schemas import OrderStatusData, ProductData

router = APIRouter(prefix="/api/admin")

ORDER_STATUSES = ["Новый", "В работе", "Доставлен", "Отменён"]

# Папка, куда сохраняем загруженные фото товаров
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 МБ


# ---------- Загрузка фото ----------

@router.post("/upload")
def upload_image(file: UploadFile = File(...), admin: User = Depends(get_admin)):
    # Проверяем, что это картинка
    extension = os.path.splitext(file.filename)[1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Можно загружать только картинки: jpg, png, webp, gif")

    content = file.file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Файл больше 5 МБ")

    # Придумываем файлу уникальное имя, чтобы файлы с одинаковыми именами не перезаписали друг друга
    filename = uuid.uuid4().hex + extension
    with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
        f.write(content)

    # Возвращаем адрес, по которому картинку можно открыть
    return {"url": f"/uploads/{filename}"}


def check_product_data(data, db):
    if not data.name.strip():
        raise HTTPException(status_code=400, detail="Введите название")
    if data.price <= 0:
        raise HTTPException(status_code=400, detail="Цена должна быть больше 0")
    if db.query(Category).filter(Category.id == data.category_id).first() is None:
        raise HTTPException(status_code=400, detail="Нет такой категории")


# ---------- Товары ----------

@router.post("/products")
def create_product(data: ProductData, admin: User = Depends(get_admin), db: Session = Depends(get_db)):
    check_product_data(data, db)
    product = Product(
        name=data.name,
        brand=data.brand,
        price=data.price,
        image=data.image,
        description=data.description,
        category_id=data.category_id,
    )
    db.add(product)
    db.commit()
    return product.to_dict()


@router.put("/products/{product_id}")
def update_product(product_id: int, data: ProductData,
                   admin: User = Depends(get_admin), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")
    check_product_data(data, db)

    product.name = data.name
    product.brand = data.brand
    product.price = data.price
    product.image = data.image
    product.description = data.description
    product.category_id = data.category_id
    db.commit()
    return product.to_dict()


@router.delete("/products/{product_id}")
def delete_product(product_id: int, admin: User = Depends(get_admin), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")

    # Сначала убираем товар из корзин и избранного, потом удаляем сам товар
    db.query(CartItem).filter(CartItem.product_id == product_id).delete()
    db.query(Favorite).filter(Favorite.product_id == product_id).delete()
    db.delete(product)
    db.commit()
    return {"status": "ok"}


# ---------- Заказы ----------

@router.get("/orders")
def get_all_orders(admin: User = Depends(get_admin), db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.id.desc()).all()
    return [o.to_dict() for o in orders]


@router.put("/orders/{order_id}")
def change_order_status(order_id: int, data: OrderStatusData,
                        admin: User = Depends(get_admin), db: Session = Depends(get_db)):
    if data.status not in ORDER_STATUSES:
        raise HTTPException(status_code=400, detail="Неверный статус")
    order = db.query(Order).filter(Order.id == order_id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    order.status = data.status
    db.commit()
    return order.to_dict()


# ---------- Пользователи ----------

@router.get("/users")
def get_users(admin: User = Depends(get_admin), db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.id).all()
    return [u.to_dict() for u in users]
