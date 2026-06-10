import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import './AddToCartButton.css';

export default function AddToCartButton({ product, initialQty = 1 }) {
  const {
    inventory,
    addToCart,
    cartItems
  } = useCart();

  const available = inventory[product.id] ?? product.stock ?? 0;

  const [qty, setQty] = useState(initialQty);
  const [message, setMessage] = useState('');

  const handleAdd = () => {
    const parsed = Math.max(1, Math.floor(Number(qty) || 1));

    const res = addToCart(product, parsed);

    setMessage(res.message);

    if (res.success) {
      setQty(1);
    }
  };

  useEffect(() => {
    setQty(initialQty);
  }, [initialQty]);

  return (
    <div className="add-to-cart-component">
      <div className="add-to-cart-row">
        <input
          className="act-qty-input"
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <button
          className="act-add-btn"
          onClick={handleAdd}
          disabled={available <= 0}
        >
          {available <= 0 ? 'Out of stock' : 'Add To Cart'}
        </button>
      </div>

      {message && (
        <div
          className={`act-message ${
            message.startsWith('Only') ||
            message.includes('out of stock')
              ? 'error'
              : 'success'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}