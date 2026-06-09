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

  function removeFromCart(productId){
    setCartItems(prev => {
      const item = prev.find(i => i.id === productId);
      if (!item) return prev;
      // restore inventory
      setInventory(inv => ({ ...inv, [productId]: (inv[productId] ?? 0) + item.qty }));
      return prev.filter(i => i.id !== productId);
    });
  }

  function updateQuantity(productId, newQty){
    if (newQty <= 0) {
      removeFromCart(productId);
      return { success: true, message: 'Item removed' };
    }

    const item = cartItems.find(i => i.id === productId);
    if (!item) return { success: false, message: 'Item not found in cart' };

    const currentQty = item.qty;
    const delta = newQty - currentQty;
    const available = inventory[productId] ?? 0;

    if (delta > 0){
      if (available < delta){
        return { success: false, message: `Only ${available} more item${available>1? 's' : ''} available` };
      }
      setInventory(prev => ({ ...prev, [productId]: (prev[productId] ?? 0) - delta }));
    } else if (delta < 0){
      // returning items to inventory
      setInventory(prev => ({ ...prev, [productId]: (prev[productId] ?? 0) - delta }));
    }

    setCartItems(prev => prev.map(i => i.id === productId ? { ...i, qty: newQty } : i));
    return { success: true, message: 'Quantity updated' };
  }

  const value = {
    inventory,
    cartItems,
    totalCount,
    addToCart,
    removeFromCart,
    updateQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
