import { useEffect, useState } from 'react';
import { api, formatPrice, uploadImage } from '../../api';

// пустая форма товара
const emptyForm = {
  name: '',
  brand: '',
  price: '',
  image: '', // адрес фото появится после загрузки файла
  description: '',
  category_id: '',
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // id товара, который редактируем
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  // поле выбора файла нельзя очистить через value, поэтому меняем key - React создаст поле заново
  const [fileInputKey, setFileInputKey] = useState(0);

  function loadProducts() {
    api('/products').then((data) => setProducts(data));
  }

  useEffect(() => {
    loadProducts();
    api('/categories').then((data) => setCategories(data));
  }, []);

  // одна функция для всех полей формы
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      description: product.description,
      category_id: product.category_id,
    });
    window.scrollTo(0, 0);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setFileInputKey(fileInputKey + 1); // очищаем поле выбора файла
  }

  // админ выбрал файл - сразу загружаем его на сервер
  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm({ ...form, image: url }); // в товаре сохраним адрес загруженной картинки
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!form.image) {
      setError('Загрузите фото товара');
      return;
    }

    const body = { ...form, price: Number(form.price), category_id: Number(form.category_id) };

    try {
      if (editingId) {
        await api(`/admin/products/${editingId}`, { method: 'PUT', body });
      } else {
        await api('/admin/products', { method: 'POST', body });
      }
      cancelEdit();
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Удалить товар «${product.name}»?`)) return;
    await api(`/admin/products/${product.id}`, { method: 'DELETE' });
    loadProducts();
  }

  return (
    <div>
      <h2>{editingId ? `Редактирование товара №${editingId}` : 'Новый товар'}</h2>
      <form className="form admin-form" onSubmit={handleSubmit}>
        <label>
          Название
          <input className="input" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Бренд
          <input className="input" name="brand" value={form.brand} onChange={handleChange} required />
        </label>
        <label>
          Цена, ₽
          <input className="input" name="price" type="number" min="1" value={form.price} onChange={handleChange} required />
        </label>
        <label>
          Категория
          <select className="input" name="category_id" value={form.category_id} onChange={handleChange} required>
            <option value="">— выберите —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </label>
        <label>
          Фото товара
          <input
            key={fileInputKey}
            className="input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        {uploading && <p>Загрузка фото...</p>}
        {form.image && !uploading && (
          <img src={form.image} alt="Фото товара" className="admin-image-preview" />
        )}
        <label>
          Описание
          <textarea className="input" name="description" rows="4" value={form.description} onChange={handleChange} />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="profile-buttons">
          <button className="button" type="submit" disabled={uploading}>
          {editingId ? 'Сохранить' : 'Добавить'}
        </button>
          {editingId && <button className="button button-light" type="button" onClick={cancelEdit}>Отмена</button>}
        </div>
      </form>

      <h2>Все товары</h2>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>№</th>
              <th>Название</th>
              <th>Бренд</th>
              <th>Категория</th>
              <th>Цена</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.category_title}</td>
                <td>{formatPrice(product.price)}</td>
                <td className="table-buttons">
                  <button className="button button-light" onClick={() => startEdit(product)}>Изменить</button>
                  <button className="button button-light" onClick={() => deleteProduct(product)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
