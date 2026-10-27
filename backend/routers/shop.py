# Избранное, корзина и заказы. Всё это только для вошедших пользователей.
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import CartItem, Favorite, Order, OrderItem, Product, User
from schemas import CartAddData, CartUpdateData, OrderData

router = APIRouter(prefix="/api")


def find_product(db, product_id):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return product


# ---------- Избранное ----------

@router.get("/favorites")
def get_favorites(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    favorites = db.query(Favorite).filter(Favorite.user_id == user.id).all()
    return [f.product.to_dict() for f in favorites]


@router.post("/favorites/{product_id}")
def add_favorite(product_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    find_product(db, product_id)
    exists = db.query(Favorite).filter(
        Favorite.user_id == user.id, Favorite.product_id == product_id
    ).first()
    if not exists:
        db.add(Favorite(user_id=user.id, product_id=product_id))
        db.commit()
    return {"status": "ok"}


@router.delete("/favorites/{product_id}")
def remove_favorite(product_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Favorite).filter(
        Favorite.user_id == user.id, Favorite.product_id == product_id
    ).delete()
    db.commit()
    return {"status": "ok"}


# ---------- Корзина ----------

@router.get("/cart")
def get_cart(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(CartItem).filter(CartItem.user_id == user.id).order_by(CartItem.id).all()
    result = []
    total = 0
    for item in items:
        result.append({"product": item.product.to_dict(), "quantity": item.quantity})
        total += item.product.price * item.quantity
    return {"items": result, "total": total}


@router.post("/cart")
def add_to_cart(data: CartAddData, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    find_product(db, data.product_id)
    if data.quantity < 1:
        raise HTTPException(status_code=400, detail="Количество должно быть больше 0")

    item = db.query(CartItem).filter(
        CartItem.user_id == user.id, CartItem.product_id == data.product_id
    ).first()
    if item:
        # товар уже в корзине - просто увеличиваем количество
        item.quantity += data.quantity
    else:
        db.add(CartItem(user_id=user.id, product_id=data.product_id, quantity=data.quantity))
    db.commit()
    return {"status": "ok"}


@router.put("/cart/{product_id}")
def update_cart(product_id: int, data: CartUpdateData,
                user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(
        CartItem.user_id == user.id, CartItem.product_id == product_id
    ).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Товара нет в корзине")

    if data.quantity < 1:
        db.delete(item)
    else:
        item.quantity = data.quantity
    db.commit()
    return {"status": "ok"}


@router.delete("/cart/{product_id}")
def remove_from_cart(product_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(CartItem).filter(
        CartItem.user_id == user.id, CartItem.product_id == product_id
    ).delete()
    db.commit()
    return {"status": "ok"}


# ---------- Заказы ----------

@router.post("/orders")
def create_order(data: OrderData, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not data.address.strip() or not data.phone.strip():
        raise HTTPException(status_code=400, detail="Укажите адрес и телефон")

    cart_items = db.query(CartItem).filter(CartItem.user_id == user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Корзина пуста")

    order = Order(user_id=user.id, address=data.address, phone=data.phone, total=0)
    db.add(order)
    db.commit()  # после commit у заказа появится id

    total = 0
    for item in cart_items:
        db.add(OrderItem(
            order_id=order.id,
            product_id=item.product.id,
            product_name=item.product.name,
            price=item.product.price,
            quantity=item.quantity,
        ))
        total += item.product.price * item.quantity
        db.delete(item)  # убираем товар из корзины

    order.total = total
    db.commit()
    return order.to_dict()


@router.get("/orders")
def get_my_orders(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == user.id).order_by(Order.id.desc()).all()
    return [o.to_dict() for o in orders]
