import { formatPrice } from '../../api';

// Список заказов. Используется в профиле.
function OrderList({ orders }) {
    if (orders.length === 0) {
        return <p>Заказов пока нет.</p>;
    }

    return (
        <div className="orders">
            {orders.map((order) => (
                <div key={order.id} className="order">
                    <div className="order-header">
                        <b>Заказ №{order.id}</b>
                        <span>{new Date(order.created_at).toLocaleString('ru-RU')}</span>
                        <span className="order-status">{order.status}</span>
                    </div>
                    <ul>
                        {order.items.map((item) => (
                            <li key={item.product_id}>
                                {item.product_name} × {item.quantity} — {formatPrice(item.price * item.quantity)}
                            </li>
                        ))}
                    </ul>
                    <p>Адрес: {order.address}, телефон: {order.phone}</p>
                    <p><b>Итого: {formatPrice(order.total)}</b></p>
                </div>
            ))}
        </div>
    );
}

export default OrderList;
