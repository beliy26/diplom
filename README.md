# AllianceBoardShop

Интернет-магазин сноубордов Capita и креплений Union (дипломный проект).

## Из чего состоит

- **Фронтенд** — React + Vite + React Router (папка `frontend`)
- **Бэкенд** — Python + FastAPI + SQLAlchemy (папка `backend`)
- **База данных** — PostgreSQL

## Структура проекта

```
diplom/
├── backend/              бэкенд на Python
│   ├── routers/          адреса API
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/             фронтенд на React
│   ├── public/           картинки
│   ├── src/              код страниц и компонентов
│   ├── Dockerfile
│   ├── nginx.conf        настройки nginx (отдаёт сайт и передаёт /api в бэкенд)
│   └── package.json
├── docker-compose.yml    запуск всего проекта одной командой
└── README.md
```

## Что умеет сайт

- каталог по категориям и поиск товаров;
- полная карточка товара;
- регистрация, вход и выход;
- избранное и корзина (после входа);
- оформление заказа и история заказов в профиле;
- админка: добавление, изменение и удаление товаров, смена статуса заказов, список пользователей.

## Запуск через Docker

```bash
docker compose up --build
```

После запуска:

- сайт: http://localhost:3000
- API: http://localhost:8000/api/categories
- документация API: http://localhost:8000/docs

**Администратор:** `admin@shop.ru` / `admin123` (меняется в `docker-compose.yml`).

Остановить: `docker compose down`
Остановить и удалить базу (начать с чистыми данными): `docker compose down -v`

## Запуск без Docker (для разработки)

1. Запустить только базу: `docker compose up db` (она будет доступна на порту **5433**)
2. Бэкенд:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
3. Фронтенд (в другом терминале):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Сайт откроется на http://localhost:5173

## Структура бэкенда

| Файл | Что внутри |
|---|---|
| `main.py` | создание приложения, подключение роутеров |
| `database.py` | подключение к PostgreSQL |
| `models.py` | таблицы базы данных |
| `schemas.py` | какие данные приходят в POST/PUT запросах |
| `auth.py` | хэширование паролей, проверка токена |
| `seed.py` | стартовые данные и администратор |
| `routers/products.py` | каталог |
| `routers/auth_routes.py` | регистрация и вход |
| `routers/shop.py` | избранное, корзина, заказы |
| `routers/admin.py` | админка |

## Как работает вход

1. Пользователь отправляет email и пароль на `/api/login`.
2. Бэкенд проверяет пароль (в базе хранится только хэш) и выдаёт случайный **токен**.
3. Фронтенд сохраняет токен в `localStorage` и отправляет его в каждом запросе
   в заголовке `Authorization: Bearer <токен>`.
4. При выходе токен стирается в базе и больше не работает.

## API

| Запрос | Что делает | Доступ |
|---|---|---|
| `GET /api/categories` | список категорий | все |
| `GET /api/products?category=&q=` | товары (фильтр и поиск) | все |
| `GET /api/products/{id}` | один товар | все |
| `POST /api/register` | регистрация | все |
| `POST /api/login` | вход | все |
| `GET /api/me` | текущий пользователь | вошедшие |
| `POST /api/logout` | выход | вошедшие |
| `GET/POST/DELETE /api/favorites/...` | избранное | вошедшие |
| `GET/POST/PUT/DELETE /api/cart/...` | корзина | вошедшие |
| `POST /api/orders` | оформить заказ | вошедшие |
| `GET /api/orders` | мои заказы | вошедшие |
| `POST/PUT/DELETE /api/admin/products/...` | управление товарами | админ |
| `GET /api/admin/orders`, `PUT /api/admin/orders/{id}` | заказы и статусы | админ |
| `GET /api/admin/users` | пользователи | админ |
