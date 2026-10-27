import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(Number(id));
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  // загружаем товар
  useEffect(() => {
    api(`/products/${id}`)
      .then((data) => setProduct(data))
      .catch(() => setNotFound(true));
  }, [id]);

  async function addToCart() {
    if (!user) {
      navigate('/login');
      return;
    }
    await api('/cart', { method: 'POST', body: { product_id: product.id, quantity: quantity } });
    refreshCart(); // обновляем значок на корзине в шапке
    setMessage('Товар добавлен в корзину');
  }

  if (notFound) {
    return <p className="page">Товар не найден. <Link to="/" className="back-link">На главную</Link></p>;
  }

  if (!product) {
    return <p className="page">Загрузка...</p>;
  }

  return (
    <section className="page">
      <Link to="/" className="back-link">← На главную</Link>

      <div className="product-page">
        <img src={product.image} alt={product.name} className="product-page-image" />

        <div className="product-page-info">
          <p className="product-brand">{product.brand} · {product.category_title}</p>
          <h1 className="page-title">{product.name}</h1>
          <p className="product-page-price">{formatPrice(product.price)}</p>
          <p className="product-page-description">{product.description}</p>

          <div className="product-page-actions">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
              className="input quantity-input"
              aria-label="Количество"
            />
            <button className="button" onClick={addToCart}>В корзину</button>
            <button className="button button-light" onClick={() => toggleFavorite(product.id)}>
              {isFavorite ? '♥ В избранном' : '♡ В избранное'}
            </button>
          </div>

          {message && (
            <p className="success">
              {message}. <Link to="/cart" className="back-link">Перейти в корзину</Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductPage;
