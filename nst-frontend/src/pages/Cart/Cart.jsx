import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

export default function Cart(){
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((s, it) => s + (it.qty * (it.product.price || 0)), 0);

  if (!cartItems || cartItems.length === 0){
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <div className="cart-empty-actions">
          <Link to="/products" className="btn">Go shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      <div className="cart-list">
        {cartItems.map(item => (
          <div className="cart-item" key={item.id}>
            <img src={item.product.images && item.product.images[0]} alt={item.product.name} />
            <div className="cart-item-info">
              <Link to={`/products/${item.id}`} className="cart-item-title">{item.product.name}</Link>
              <div className="cart-item-price">Price: ₹{item.product.price}</div>
              <div className="cart-item-qty">
                Quantity: 
                <input
                  className="qty-input"
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => {
                    const v = Number(e.target.value) || 0;
                    updateQuantity(item.id, v);
                  }}
                />
              </div>
              <div className="cart-item-sub">Subtotal: ₹{item.qty * (item.product.price || 0)}</div>
              <div style={{marginTop:8}}>
                <button className="btn btn-ghost" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">Total: <strong>₹{total}</strong></div>
        <div className="cart-actions">
          <button className="btn" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
          <Link to="/products" className="btn btn-ghost">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
