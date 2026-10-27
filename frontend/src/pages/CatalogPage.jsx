import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import { useFavorites } from '../context/FavoritesContext';

function CatalogPage() {
  const { favoriteIds, toggleFavorite } = useFavorites();
  // slug берём из адреса, например /catalog/snowboards -> "snowboards"
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // сначала узнаём название категории, потом загружаем её товары
    fetch(`/api/categories/${slug}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        setCategory(data);
        return fetch(`/api/products?category=${slug}`);
      })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <p className="page">Загрузка...</p>;
  }

  if (!category) {
    return (
      <p className="page">
        Категория не найдена. <Link to="/" className="back-link">На главную</Link>
      </p>
    );
  }

  return (
    <section className="page">
      <Link to="/" className="back-link">← На главную</Link>
      <h1 className="page-title">{category.title}</h1>
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

export default CatalogPage;
