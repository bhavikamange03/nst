import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import products from '../data/product.js';
import { useAuth } from './AuthContext'

const WishlistContext = createContext();

function loadLocalWishlist(){
  try {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function useWishlist(){
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }){
  const [items, setItems] = useState(loadLocalWishlist);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!isLoggedIn) {
      setItems([]);
      localStorage.removeItem('wishlist');
      return;
    }

    async function syncWishlist() {
      const localItems = loadLocalWishlist();
      try {
        const response = await axios.get('/wishlist/');
        const serverItems = response.data || [];
        const merged = Array.from(new Set([...serverItems, ...localItems]));

        const toAdd = localItems.filter(id => !serverItems.includes(id));
        await Promise.all(toAdd.map(id => axios.post('/wishlist/', { product_id: id })));
        setItems(merged);
      } catch (error) {
        console.error('Failed to sync wishlist:', error);
      }
    }

    syncWishlist();
  }, [isLoggedIn]);

  async function add(product){
    if (items.includes(product.id)) return;
    setItems(prev => [...prev, product.id]);

    if (isLoggedIn) {
      try {
        await axios.post('/wishlist/', { product_id: product.id });
      } catch (error) {
        console.error('Failed to add wishlist item:', error);
      }
    }
  }

  async function remove(product){
    setItems(prev => prev.filter(id => id !== product.id));

    if (isLoggedIn) {
      try {
        await axios.delete(`/wishlist/${product.id}`);
      } catch (error) {
        console.error('Failed to remove wishlist item:', error);
      }
    }
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
