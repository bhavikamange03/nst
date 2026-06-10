import React, { createContext, useContext, useState } from 'react';
import products from '../data/product.js';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const initialInventory = {};

  products.forEach((product) => {
    initialInventory[product.id] = product.stock ?? 0;
  });

  const [inventory, setInventory] = useState(initialInventory);

  const [cartItems, setCartItems] = useState([]);

  const totalCount = cartItems.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  function addToCart(product, qty) {
    const available = inventory[product.id] ?? 0;

    if (available <= 0) {
      return {
        success: false,
        message: 'Product is out of stock'
      };
    }

    if (qty > available) {
      return {
        success: false,
        message: `Only ${available} item${
          available > 1 ? 's' : ''
        } available`
      };
    }

    setInventory((prev) => ({
      ...prev,
      [product.id]: prev[product.id] - qty
    }));

    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + qty
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          qty,
          product
        }
      ];
    });

    return {
      success: true,
      message: 'Item added to cart'
    };
  }

  function removeFromCart(productId) {
    setCartItems((prev) => {
      const item = prev.find(
        (item) => item.id === productId
      );

      if (!item) return prev;

      setInventory((inv) => ({
        ...inv,
        [productId]:
          (inv[productId] ?? 0) + item.qty
      }));

      return prev.filter(
        (item) => item.id !== productId
      );
    });
  }

  function updateQuantity(productId, newQty) {
    if (newQty <= 0) {
      removeFromCart(productId);

      return {
        success: true,
        message: 'Item removed'
      };
    }

    const item = cartItems.find(
      (item) => item.id === productId
    );

    if (!item) {
      return {
        success: false,
        message: 'Item not found in cart'
      };
    }

    const currentQty = item.qty;
    const delta = newQty - currentQty;

    const available =
      inventory[productId] ?? 0;

    if (delta > 0) {
      if (available < delta) {
        return {
          success: false,
          message: `Only ${available} more item${
            available > 1 ? 's' : ''
          } available`
        };
      }

      setInventory((prev) => ({
        ...prev,
        [productId]:
          (prev[productId] ?? 0) - delta
      }));
    } else if (delta < 0) {
      setInventory((prev) => ({
        ...prev,
        [productId]:
          (prev[productId] ?? 0) + Math.abs(delta)
      }));
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              qty: newQty
            }
          : item
      )
    );

    return {
      success: true,
      message: 'Quantity updated'
    };
  }

  const value = {
    inventory,
    cartItems,
    totalCount,
    addToCart,
    removeFromCart,
    updateQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}