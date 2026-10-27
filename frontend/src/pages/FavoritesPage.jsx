import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard/ProductCard';
import { useFavorites } from '../context/FavoritesContext';

function FavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [products, setProducts] = useState([]);

  // загружаем полные данные избранных товаров
  useEffect(() => {
    api('/favorites').then((data) => setProducts(data));
  }, []);

  // показываем только те товары, которые всё ещё в избранном
  // (если нажать на сердечко, товар сразу пропадёт из списка)
  const visibleProducts = products.filter((product) => favoriteIds.includes(product.id));

  return (
    <section className="page">
      <Link to="/" className="back-link">← На главную</Link>
      <h1 className="page-title">Избранное</h1>

      {visibleProducts.length === 0 && <p>В избранном пока ничего нет.</p>}

      <div className="products-grid">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={true}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}

export default FavoritesPage;
