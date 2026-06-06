import React, { createContext, useContext, useState } from 'react';
import products from '../data/product.js';

const CartContext = createContext();

export function useCart(){
  return useContext(CartContext);
}

export function CartProvider({ children }){
  // initialize inventory from product list
  const initialInventory = {};
  products.forEach(p => {
    initialInventory[p.id] = p.stock ?? 0;
  });

  const [inventory, setInventory] = useState(initialInventory);
  const [cartItems, setCartItems] = useState([]); // {id, qty, product}

  const totalCount = cartItems.reduce((s, it) => s + it.qty, 0);

  function addToCart(product, qty){
    const available = inventory[product.id] ?? 0;
    if (available <= 0) {
      return { success: false, message: 'Product is out of stock' };
    }
    if (qty > available){
      return { success: false, message: `Only ${available} item${available>1? 's' : ''} are available` };
    }

    // reduce inventory
    setInventory(prev => ({ ...prev, [product.id]: prev[product.id] - qty }));

    // add to cart (merge if exists)
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx >= 0){
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { id: product.id, qty, product }];
    });

    return { success: true, message: 'Item added to cart' };
  }

  const value = {
    inventory,
    cartItems,
    totalCount,
    addToCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
