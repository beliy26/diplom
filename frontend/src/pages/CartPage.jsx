import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { refreshCart } = useCart();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  function loadCart() {
    api('/cart').then((data) => setCart(data));
    refreshCart(); // при любом изменении корзины обновляем значок в шапке
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function changeQuantity(productId, quantity) {
    await api(`/cart/${productId}`, { method: 'PUT', body: { quantity } });
    loadCart();
  }

  async function removeItem(productId) {
    await api(`/cart/${productId}`, { method: 'DELETE' });
    loadCart();
  }

  async function makeOrder(event) {
    event.preventDefault();
    setError('');
    try {
      const order = await api('/orders', { method: 'POST', body: { address, phone } });
      setOrderId(order.id);
      loadCart();
    } catch (err) {
      setError(err.message);
    }
  }

  // заказ оформлен - показываем сообщение
  if (orderId) {
    return (
      <section className="page">
        <h1 className="page-title">Спасибо за заказ!</h1>
        <p className="success">Заказ №{orderId} оформлен. Мы скоро с вами свяжемся.</p>
        <p><Link to="/profile" className="back-link">Мои заказы</Link></p>
      </section>
    );
  }

  return (
    <section className="page">
      <Link to="/" className="back-link">← На главную</Link>
      <h1 className="page-title">Корзина</h1>

      {cart.items.length === 0 ? (
        <p>Корзина пуста.</p>
      ) : (
        <>
          <div className="cart">
            {cart.items.map(({ product, quantity }) => (
              <div key={product.id} className="cart-item">
                <img src={product.image} alt={product.name} className="cart-image" />
                <Link to={`/product/${product.id}`} className="cart-name">{product.name}</Link>
                <div className="cart-quantity">
                  <button className="button button-light" onClick={() => changeQuantity(product.id, quantity - 1)}>−</button>
                  <span>{quantity}</span>
                  <button className="button button-light" onClick={() => changeQuantity(product.id, quantity + 1)}>+</button>
                </div>
                <b>{formatPrice(product.price * quantity)}</b>
                <button className="button button-light" onClick={() => removeItem(product.id)}>Удалить</button>
              </div>
            ))}
          </div>

          <p className="cart-total">Итого: {formatPrice(cart.total)}</p>

          <h2>Оформление заказа</h2>
          <form className="form" onSubmit={makeOrder}>
            <label>
              Адрес доставки
              <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </label>
            <label>
              Телефон
              <input className="input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </label>
            {error && <p className="error">{error}</p>}
            <button className="button" type="submit">Оформить заказ</button>
          </form>
        </>
      )}
    </section>
  );
}

export default CartPage;
