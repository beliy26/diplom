import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import RequireAuth from './components/RequireAuth/RequireAuth';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/admin/AdminPage';
import InfoPage from './pages/InfoPage';

function App() {
  return (
    <div className="main-container">
      <Header />
      <main className="main-content">
        {/* какую страницу показать, зависит от адреса в браузере */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog/:slug" element={<CatalogPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* эти страницы только для вошедших пользователей */}
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/favorites" element={<RequireAuth><FavoritesPage /></RequireAuth>} />
          <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />

          {/* а эта только для администратора */}
          <Route path="/admin" element={<RequireAuth adminOnly><AdminPage /></RequireAuth>} />

          <Route path="*" element={<InfoPage title="Страница не найдена" text="Такой страницы нет." />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
