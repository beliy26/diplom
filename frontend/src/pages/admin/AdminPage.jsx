import { useState } from 'react';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

// Главная страница админки с тремя вкладками
function AdminPage() {
  const [tab, setTab] = useState('products');

  return (
    <section className="page">
      <h1 className="page-title">Админка</h1>

      <div className="tabs">
        <button className={tab === 'products' ? 'button' : 'button button-light'} onClick={() => setTab('products')}>
          Товары
        </button>
        <button className={tab === 'orders' ? 'button' : 'button button-light'} onClick={() => setTab('orders')}>
          Заказы
        </button>
        <button className={tab === 'users' ? 'button' : 'button button-light'} onClick={() => setTab('users')}>
          Пользователи
        </button>
      </div>

      {tab === 'products' && <AdminProducts />}
      {tab === 'orders' && <AdminOrders />}
      {tab === 'users' && <AdminUsers />}
    </section>
  );
}

export default AdminPage;
