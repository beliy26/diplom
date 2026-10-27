import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import { useFavorites } from '../context/FavoritesContext';

function SearchPage() {
  const { favoriteIds, toggleFavorite } = useFavorites();
  // текст поиска берём из адреса: /search?q=union
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`/api/products?q=${encodeURIComponent(q)}`)
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, [q]);

  return (
    <section className="page">
      <Link to="/" className="back-link">← На главную</Link>
      <h1 className="page-title">Поиск: «{q}»</h1>
      {products.length === 0 && <p>Ничего не найдено</p>}
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favoriteIds.includes(product.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}

export default SearchPage;
