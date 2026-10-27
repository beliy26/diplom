# Таблицы базы данных
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class Category(Base):
    """Категория товаров: сноуборды, крепления."""

    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    slug = Column(String(50), unique=True)  # короткое имя латиницей, например "snowboards"
    title = Column(String(100))
    description = Column(Text)

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "description": self.description,
        }


class Product(Base):
    """Товар в магазине."""

    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String(200))
    brand = Column(String(100))
    price = Column(Integer)  # цена в рублях
    image = Column(String(200))
    description = Column(Text, default="")
    category_id = Column(Integer, ForeignKey("categories.id"))

    category = relationship("Category")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "brand": self.brand,
            "price": self.price,
            "image": self.image,
            "description": self.description,
            "category_id": self.category_id,
            "category_title": self.category.title if self.category else "",
        }


class User(Base):
    """Пользователь сайта."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(200), unique=True)
    name = Column(String(100))
    password_hash = Column(String(200))  # сам пароль не храним, только его хэш
    token = Column(String(100), unique=True, nullable=True)  # токен входа
    is_admin = Column(Boolean, default=False)

    def to_dict(self):
        # пароль и токен наружу не отдаём
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "is_admin": self.is_admin,
        }


class Favorite(Base):
    """Товар в избранном у пользователя."""

    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))

    product = relationship("Product")


class CartItem(Base):
    """Товар в корзине у пользователя."""

    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)

    product = relationship("Product")


class Order(Base):
    """Заказ."""

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.now)
    status = Column(String(50), default="Новый")
    address = Column(String(300))
    phone = Column(String(50))
    total = Column(Integer)

    user = relationship("User")
    items = relationship("OrderItem")

    def to_dict(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat(),
            "status": self.status,
            "address": self.address,
            "phone": self.phone,
            "total": self.total,
            "user_email": self.user.email if self.user else "",
            "items": [item.to_dict() for item in self.items],
        }


class OrderItem(Base):
    """Товар внутри заказа. Название и цену копируем сюда,
    чтобы заказ не поменялся, если товар потом изменят или удалят."""

    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer)
    product_name = Column(String(200))
    price = Column(Integer)
    quantity = Column(Integer)

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "product_name": self.product_name,
            "price": self.price,
            "quantity": self.quantity,
        }
