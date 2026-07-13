import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';
import './OrderDetail.css';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch((err) => {
        setError(err?.response?.data?.detail || 'Could not load order details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="order-detail-page"><p>Loading order details…</p></div>;
  }

  if (error) {
    return <div className="order-detail-page"><p className="order-detail-error">{error}</p></div>;
  }

  if (!order) {
    return <div className="order-detail-page"><p>Order not found.</p></div>;
  }

  return (
    <div className="order-detail-page">
      <h2>Order #{order.id}</h2>
      <div className="order-detail-meta">
        <div>Status: {order.status}</div>
        <div>Total: ₹{order.total_amount}</div>
      </div>

      <div className="order-detail-section">
        <h3>Items</h3>
        <div className="order-detail-items">
          {order.items.map((item) => (
            <div key={`${item.product_id}-${item.quantity}`} className="order-detail-item">
              <div>Product ID: {item.product_id}</div>
              <div>Quantity: {item.quantity}</div>
              <div>Price: ₹{item.price}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-detail-section">
        <h3>Payment</h3>
        {order.payment ? (
          <div className="order-detail-payment">
            <div>Method: {order.payment.payment_method}</div>
            <div>Transaction ID: {order.payment.transaction_id}</div>
            <div>Amount: ₹{order.payment.amount}</div>
            <div>Status: {order.payment.status}</div>
          </div>
        ) : (
          <div>No payment details available.</div>
        )}
      </div>

      <Link to="/orders" className="btn">
        Back to orders
      </Link>
    </div>
  );
}
