import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

// Контекст хранит, сколько товаров в корзине, чтобы показать значок в шапке
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Заново узнаём у бэкенда, сколько товаров в корзине
  function refreshCart() {
    if (!user) {
      setCartCount(0);
      return;
    }
    api('/cart').then((cart) => {
      let count = 0;
      for (const item of cart.items) {
        count += item.quantity;
      }
      setCartCount(count);
    });
  }

  // При входе и выходе пользователя обновляем счётчик
  useEffect(() => {
    refreshCart();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Использование: const { cartCount, refreshCart } = useCart();
export function useCart() {
  return useContext(CartContext);
}
