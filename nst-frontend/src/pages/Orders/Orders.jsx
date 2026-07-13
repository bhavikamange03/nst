import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => {
        setError(err?.response?.data?.detail || 'Could not load your orders.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="orders-page"><p>Loading orders…</p></div>;
  }

  if (error) {
    return <div className="orders-page"><p className="orders-error">{error}</p></div>;
  }

  if (!orders.length) {
    return (
      <div className="orders-page">
        <h2>Your Orders</h2>
        <p>You have not placed any orders yet.</p>
        <Link to="/products" className="btn">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>Order #{order.id}</div>
              <div>Status: {order.status}</div>
            </div>
            <div className="order-body">
              <div>Total: ₹{order.total_amount}</div>
              <div>Items: {order.items.length}</div>
              <div>Payment: {order.payment?.payment_method || 'N/A'}</div>
              <div>Txn: {order.payment?.transaction_id || 'N/A'}</div>
            </div>
            <div className="order-actions">
              <Link to={`/orders/${order.id}`} className="btn">
                View details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
