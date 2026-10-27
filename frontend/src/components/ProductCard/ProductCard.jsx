import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, formatPrice } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// Карточка товара в списке.
// isFavorite - товар уже в избранном, onToggleFavorite - что делать при клике на сердечко.
function ProductCard({ product, isFavorite, onToggleFavorite }) {
    const { user } = useAuth();
    const { refreshCart } = useCart();
    const navigate = useNavigate();
    const [added, setAdded] = useState(false);

    async function addToCart() {
        if (!user) {
            navigate('/login');
            return;
        }
        await api('/cart', { method: 'POST', body: { product_id: product.id, quantity: 1 } });
        refreshCart(); // обновляем значок на корзине в шапке

        // на 2 секунды показываем "Добавлено"
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-link">
                <img src={product.image} alt={product.name} className="product-image" />
                <p className="product-brand">{product.brand}</p>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{formatPrice(product.price)}</p>
            </Link>

            <div className="product-card-buttons">
                <button className="button" onClick={addToCart}>
                    {added ? 'Добавлено ✓' : 'В корзину'}
                </button>
                <button
                    className="button button-light favorite-button"
                    onClick={() => onToggleFavorite(product.id)}
                    title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                    aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                >
                    {isFavorite ? '♥' : '♡'}
                </button>
            </div>
        </div>
    )
}

export default ProductCard;
