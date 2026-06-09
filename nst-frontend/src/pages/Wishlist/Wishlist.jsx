import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './Wishlist.css';

export default function Wishlist(){
  const { wishlistProducts, remove } = useWishlist();
  const { addToCart } = useCart();

  function handleAddToCart(product){
    const res = addToCart(product, 1);
    // ignore result here; cart context shows messages elsewhere
    if (res && res.success){
      remove(product);
    }
  }

  if (!wishlistProducts || wishlistProducts.length === 0) {
    return <div style={{padding:20}}>Your wishlist is empty.</div>
  }

  return (
    <div className="wishlist-page">
      <h2>Your Wishlist</h2>
      <div className="wishlist-grid">
        {wishlistProducts.map(p => (
          <div key={p.id} className="wishlist-card">
            <Link to={`/products/${p.id}`}>
              <img src={p.images && p.images[0]} alt={p.title} />
            </Link>
            <div className="wishlist-info">
              <Link to={`/products/${p.id}`} className="wishlist-title">{p.title}</Link>
              <div className="wishlist-price">₹{p.price}</div>
              <div className="wishlist-actions">
                <button onClick={() => handleAddToCart(p)} className="btn">Add to cart</button>
                <button onClick={() => remove(p)} className="btn btn-ghost">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
