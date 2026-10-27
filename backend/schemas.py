# Описание данных, которые приходят от фронтенда (тело POST/PUT запросов).
# FastAPI сам проверит, что все поля на месте и нужного типа.
from pydantic import BaseModel


class RegisterData(BaseModel):
    email: str
    name: str
    password: str


class LoginData(BaseModel):
    email: str
    password: str


class CartAddData(BaseModel):
    product_id: int
    quantity: int = 1


class CartUpdateData(BaseModel):
    quantity: int


class OrderData(BaseModel):
    address: str
    phone: str


class ProductData(BaseModel):
    name: str
    brand: str
    price: int
    image: str
    description: str = ""
    category_id: int


class OrderStatusData(BaseModel):
    status: str
