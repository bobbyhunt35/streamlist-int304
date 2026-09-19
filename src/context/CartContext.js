import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "streamlist.cart";
const CartContext = createContext(null);

function loadCart() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  // Keep the cart between visits so it is not lost on refresh.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Storage blocked - the cart still works for this session.
    }
  }, [cartItems]);

  // Only one subscription plan may be in the cart at a time; accessories
  // (shirts, phone cases, ...) can be added any number of times, up to
  // whatever stock the catalog lists for that item.
  function addItem(product) {
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      if (
        typeof product.stock === "number" &&
        existing.quantity >= product.stock
      ) {
        return {
          ok: false,
          message: `Only ${product.stock} ${
            product.stock === 1 ? "unit is" : "units are"
          } in stock for "${product.name}".`,
        };
      }

      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      return { ok: true };
    }

    if (product.category === "subscription") {
      const hasSubscription = cartItems.some(
        (item) => item.category === "subscription"
      );

      if (hasSubscription) {
        return {
          ok: false,
          message:
            "Only one subscription plan can be in your cart at a time. Remove your current plan to switch.",
        };
      }
    }

    setCartItems([...cartItems, { ...product, quantity: 1 }]);
    return { ok: true };
  }

  function removeItem(id) {
    setCartItems(cartItems.filter((item) => item.id !== id));
  }

  function updateQuantity(id, quantity) {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setCartItems(
      cartItems.map((item) => {
        if (item.id !== id) return item;
        const capped =
          typeof item.stock === "number"
            ? Math.min(quantity, item.stock)
            : quantity;
        return { ...item, quantity: capped };
      })
    );
  }

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    itemCount,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
