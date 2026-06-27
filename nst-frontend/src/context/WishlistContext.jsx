import React, { createContext, useContext, useState, useEffect } from 'react';
import products from '../data/product.js';
import { useAuth } from './AuthContext'

const WishlistContext = createContext();

export function useWishlist(){
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }){
  const [items, setItems] = useState(() => {
    // Load wishlist from localStorage on mount
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const { isLoggedIn } = useAuth();

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  // Optionally clear wishlist on logout (remove this if you want it to persist)
  // Commented out to keep wishlist after logout
  // useEffect(() => {
  //   if (!isLoggedIn) setItems([]);
  // }, [isLoggedIn]);

  function add(product){
    if (items.includes(product.id)) return;
    setItems(prev => [...prev, product.id]);
  }

  function remove(product){
    setItems(prev => prev.filter(id => id !== product.id));
  }

  function toggle(product){
    if (items.includes(product.id)) remove(product);
    else add(product);
  }

  function isInWishlist(product){
    return items.includes(product.id);
  }

  const wishlistProducts = items.map(id => products.find(p => p.id === id)).filter(Boolean);

  const value = {
    items,
    wishlistProducts,
    add,
    remove,
    toggle,
    isInWishlist,
    count: items.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistContext;
