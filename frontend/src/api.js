// Одна функция для всех запросов к бэкенду.
// Сама добавляет токен входа и превращает ответ в объект.
export async function api(url, options = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api' + url, {
    method: options.method || 'GET',
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // бэкенд присылает текст ошибки в поле detail
    const message = typeof data?.detail === 'string' ? data.detail : 'Проверьте введённые данные';
    throw new Error(message);
  }
  return data;
}

// Загрузка картинки на сервер (только для админа).
// Файл отправляем не как JSON, а как форму (FormData).
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: formData,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(typeof data?.detail === 'string' ? data.detail : 'Не удалось загрузить файл');
  }
  return data.url;
}

// Цена красиво: 64990 -> "64 990 ₽"
export function formatPrice(price) {
  return price.toLocaleString('ru-RU') + ' ₽';
}
