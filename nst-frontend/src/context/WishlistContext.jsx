import React, { createContext, useContext, useState, useEffect } from 'react';
import products from '../data/product.js';
import { useAuth } from './AuthContext'

const WishlistContext = createContext();

export function useWishlist(){
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }){
  const [items, setItems] = useState([]); // store product ids
  const { isLoggedIn } = useAuth();

  // clear wishlist when user logs out
  useEffect(() => {
    if (!isLoggedIn) setItems([]);
  }, [isLoggedIn]);

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
