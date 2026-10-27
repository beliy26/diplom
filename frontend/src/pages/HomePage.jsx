import { useEffect, useState } from 'react';
import Banner from '../components/Banner/Banner';
import CategoryCard from '../components/CategoryCard/CategoryCard';

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);

  // Загружаем категории с бэкенда при открытии страницы
  useEffect(() => {
    fetch('/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch(() => setError(true));
  }, []);

  return (
    <>
      <Banner />
      <section className="catalog-preview">
        {error && <p>Не удалось загрузить категории</p>}
        <div className="preview-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              slug={category.slug}
              title={category.title}
              text={category.description}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
