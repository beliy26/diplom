import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import OrderList from '../components/OrderList/OrderList';

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api('/orders').then((data) => setOrders(data));
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <section className="page">
      <h1 className="page-title">Профиль</h1>
      <p>Имя: <b>{user.name}</b></p>
      <p>Email: <b>{user.email}</b></p>

      <div className="profile-buttons">
        {user.is_admin && <Link to="/admin" className="button">Админка</Link>}
        <button className="button button-light" onClick={handleLogout}>Выйти</button>
      </div>

      <h2>Мои заказы</h2>
      <OrderList orders={orders} />
    </section>
  );
}

export default ProfilePage;
