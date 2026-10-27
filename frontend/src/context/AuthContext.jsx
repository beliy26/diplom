import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

// Контекст хранит вошедшего пользователя, чтобы он был доступен на любой странице
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // При открытии сайта проверяем, есть ли сохранённый токен
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }
    api('/me')
      .then((data) => setUser(data))
      .catch(() => localStorage.removeItem('token')) // токен устарел
      .finally(() => setLoading(false));
  }, []);

  // Вызываем после успешного входа или регистрации
  function saveLogin(data) {
    localStorage.setItem('token', data.token);
    setUser(data.user);
  }

  async function logout() {
    try {
      await api('/logout', { method: 'POST' });
    } catch {
      // даже если бэкенд не ответил, всё равно выходим
    }
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, saveLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Удобный способ получить пользователя: const { user } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
