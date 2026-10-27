import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from './AuthContext';

// Контекст хранит id избранных товаров.
// Он общий для всего сайта: шапка показывает их количество,
// а карточки товаров - закрашенное или пустое сердечко.
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favoriteIds, setFavoriteIds] = useState([]);

  // При входе и выходе пользователя заново загружаем избранное
  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }
    api('/favorites').then((products) => setFavoriteIds(products.map((p) => p.id)));
  }, [user]);

  // Добавить товар в избранное или убрать из него
  async function toggleFavorite(productId) {
    // без входа избранного нет - отправляем на страницу входа
    if (!user) {
      navigate('/login');
      return;
    }

    if (favoriteIds.includes(productId)) {
      await api(`/favorites/${productId}`, { method: 'DELETE' });
      setFavoriteIds(favoriteIds.filter((id) => id !== productId));
    } else {
      await api(`/favorites/${productId}`, { method: 'POST' });
      setFavoriteIds([...favoriteIds, productId]);
    }
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Использование: const { favoriteIds, toggleFavorite } = useFavorites();
export function useFavorites() {
  return useContext(FavoritesContext);
}
