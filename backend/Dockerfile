# Образ с Python
FROM python:3.12-slim

# Рабочая папка внутри контейнера
WORKDIR /app

# Сначала ставим библиотеки (так Docker кэширует этот шаг)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код бэкенда
COPY . .

EXPOSE 8000

# Запускаем сервер
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
