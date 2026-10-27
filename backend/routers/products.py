# Каталог: категории и товары (доступно всем, без входа)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Category, Product

router = APIRouter(prefix="/api")


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return [c.to_dict() for c in categories]


@router.get("/categories/{slug}")
def get_category(slug: str, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.slug == slug).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    return category.to_dict()


@router.get("/products")
def get_products(category: str = None, q: str = None, db: Session = Depends(get_db)):
    """Список товаров. Можно отфильтровать по категории (?category=snowboards)
    или найти по названию (?q=union)."""
    query = db.query(Product)

    if category:
        query = query.join(Category).filter(Category.slug == category)
    if q:
        query = query.filter(Product.name.ilike(f"%{q}%"))

    products = query.order_by(Product.id).all()
    return [p.to_dict() for p in products]


@router.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product.to_dict()
