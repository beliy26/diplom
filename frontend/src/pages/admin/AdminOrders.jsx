import { useEffect, useState } from 'react';
import { api, formatPrice } from '../../api';

const STATUSES = ['Новый', 'В работе', 'Доставлен', 'Отменён'];

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  function loadOrders() {
    api('/admin/orders').then((data) => setOrders(data));
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function changeStatus(orderId, status) {
    await api(`/admin/orders/${orderId}`, { method: 'PUT', body: { status } });
    loadOrders();
  }

  if (orders.length === 0) {
    return <p>Заказов пока нет.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>№</th>
            <th>Дата</th>
            <th>Покупатель</th>
            <th>Товары</th>
            <th>Адрес и телефон</th>
            <th>Сумма</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.created_at).toLocaleString('ru-RU')}</td>
              <td>{order.user_email}</td>
              <td>
                {order.items.map((item) => (
                  <div key={item.product_id}>{item.product_name} × {item.quantity}</div>
                ))}
              </td>
              <td>{order.address}<br />{order.phone}</td>
              <td>{formatPrice(order.total)}</td>
              <td>
                <select
                  className="input"
                  value={order.status}
                  onChange={(event) => changeStatus(order.id, event.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;
