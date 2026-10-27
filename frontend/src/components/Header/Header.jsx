import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

function Header() {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const { favoriteIds } = useFavorites();
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    // при отправке формы переходим на страницу поиска
    function handleSubmit(event) {
        event.preventDefault();
        navigate(`/search?q=${encodeURIComponent(query)}`);
    }

    return (
        <header className="header-container">
            <Link to="/" className="header-logo">
                <img src="/images/logo.png" alt="Логотип" width={160} height={160}/>
            </Link>
            <ul className="header-right">
                <li>
                    <search>
                        <form role="search" className="search-form" onSubmit={handleSubmit}>
                            <label htmlFor="board-search" className="visually-hidden">Поиск</label>
                            <input
                                className="search-form-input"
                                type="search"
                                id="board-search"
                                name="q"
                                placeholder="Поиск..."
                                autoComplete="off"
                                required
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                            <button type="submit" aria-label="Найти" className="header-button">
                                <img src="/images/search.png" alt="" width={40} height={40}/>
                            </button>
                        </form>
                    </search>
                </li>
                <li>
                    {/* профиль: если вошли - ведём в профиль и показываем имя, если нет - на страницу входа */}
                    <Link
                        to={user ? '/profile' : '/login'}
                        className="header-button header-profile"
                        title={user ? 'Профиль' : 'Вход/Зарегистрироваться'}
                    >
                        <img src="/images/inter.png" alt="" aria-hidden="true" width={40} height={40}/>
                        <span className="header-profile-name">{user ? user.name : 'Войти'}</span>
                    </Link>
                </li>
                {user && user.is_admin && (
                    <li>
                        <Link to="/admin" className="header-admin-link">Админка</Link>
                    </li>
                )}
                <li>
                    <Link to="/favorites" className="header-button badge-link" title="Избранное">
                        <img src="/images/izbranoe.png" alt="Избранное" width={40} height={40}/>
                        {/* значок с количеством избранных товаров */}
                        {favoriteIds.length > 0 && <span className="badge">{favoriteIds.length}</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/cart" className="header-button badge-link" title="Корзина">
                        <img src="/images/card.png" alt="Корзина" width={50} height={50}/>
                        {/* значок с количеством товаров, если корзина не пустая */}
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </Link>
                </li>
            </ul>
        </header>
    )
}

export default Header;
