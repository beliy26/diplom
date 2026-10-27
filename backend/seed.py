# Начальные данные, чтобы на сайте было что показать
import os

from auth import hash_password
from models import Category, Product, User


def fill_database(db):
    create_admin(db)
    create_products(db)


def create_admin(db):
    """Создаёт администратора, если его ещё нет.
    Логин и пароль можно поменять в docker-compose.yml."""
    email = os.getenv("ADMIN_EMAIL", "admin@shop.ru")
    password = os.getenv("ADMIN_PASSWORD", "admin123")

    if db.query(User).filter(User.email == email).first():
        return

    admin = User(
        email=email,
        name="Администратор",
        password_hash=hash_password(password),
        is_admin=True,
    )
    db.add(admin)
    db.commit()


def create_products(db):
    # Если категории уже есть - ничего не делаем
    if db.query(Category).count() > 0:
        return

    snowboards = Category(
        slug="snowboards",
        title="Сноуборды",
        description="Лучшие модели\nдля каждого стиля катания",
    )
    bindings = Category(
        slug="bindings",
        title="Крепления",
        description="Надежность и контроль\nв каждом спуске",
    )
    db.add_all([snowboards, bindings])
    db.commit()

    products = [
        Product(
            name="Capita DOA", brand="CAPiTA", price=64990,
            image="/images/snowboard1.png", category_id=snowboards.id,
            description="Универсальная доска для парка и трасс. "
                        "Подходит райдерам среднего и продвинутого уровня.",
        ),
        Product(
            name="Capita Mercury", brand="CAPiTA", price=72990,
            image="/images/snowboard1.png", category_id=snowboards.id,
            description="Жёсткая доска для быстрого катания по склону "
                        "и уверенной езды по любому снегу.",
        ),
        Product(
            name="Union Force", brand="UNION", price=34990,
            image="/images/bindings.png", category_id=bindings.id,
            description="Самые популярные крепления Union. "
                        "Надёжные и подходят для любого стиля катания.",
        ),
        Product(
            name="Union Strata", brand="UNION", price=39990,
            image="/images/bindings.png", category_id=bindings.id,
            description="Мягкие и отзывчивые крепления для фристайла и парка.",
        ),
    ]
    db.add_all(products)
    db.commit()
