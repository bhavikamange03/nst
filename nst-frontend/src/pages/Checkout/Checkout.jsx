import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.qty * (item.product.price || 0),
    0
  );

  async function handleCheckout() {
    if (!isLoggedIn) {
      setError('Please login before checking out.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Cart is empty. Add items before checkout.');
      return;
    }
    if (!cardHolderName || !cardNumber || !expiryMonth || !expiryYear || !cvc) {
      setError('Please complete all payment fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
        })),
        payment: {
          payment_method: paymentMethod,
          card_holder_name: cardHolderName,
          card_number: cardNumber,
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
          cvc,
        },
      };
      await axios.post('/orders', payload);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(
        err?.response?.data?.detail || 'Checkout failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add items to your cart before checking out.</p>
        <Link to="/products" className="btn">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-summary">
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div className="checkout-item" key={item.id}>
              <div className="checkout-item-name">{item.product.name}</div>
              <div>Qty: {item.qty}</div>
              <div>Price: ₹{item.product.price}</div>
              <div>Subtotal: ₹{item.qty * (item.product.price || 0)}</div>
            </div>
          ))}
        </div>

        <div className="checkout-total">
          <div>Total:</div>
          <div className="checkout-total-amount">₹{total}</div>
        </div>

        <section className="payment-section">
          <h3>Payment details</h3>

          <label>
            Payment method
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="paypal">PayPal</option>
            </select>
          </label>

          <label>
            Card holder name
            <input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              placeholder="Name on card"
            />
          </label>

          <label>
            Card number
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
            />
          </label>

          <div className="payment-grid">
            <label>
              Expiry month
              <input
                type="text"
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
                placeholder="MM"
              />
            </label>
            <label>
              Expiry year
              <input
                type="text"
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
                placeholder="YY"
              />
            </label>
            <label>
              CVC
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
              />
            </label>
          </div>
        </section>

        {error && <div className="checkout-error">{error}</div>}

        <button
          className="btn checkout-button"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? 'Placing order...' : 'Pay & place order'}
        </button>
      </div>
    </div>
  );
}
