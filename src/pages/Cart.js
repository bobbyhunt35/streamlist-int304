import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Icon({ name }) {
  return (
    <span className="material-symbols-rounded" aria-hidden="true">
      {name}
    </span>
  );
}

function Cart() {
  const { cartItems, removeItem, updateQuantity, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="placeholder-page">
        <Icon name="shopping_cart" />
        <h1>Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/subscriptions" className="link-button">
          Browse subscriptions &amp; accessories
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>
        <Icon name="shopping_cart" /> Your Cart
      </h1>

      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-unit-price">
                ${item.price.toFixed(2)} each
              </span>
            </div>

            <div className="quantity-control">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Icon name="remove" />
              </button>
              <span className="quantity-value">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                aria-label={`Increase quantity of ${item.name}`}
                disabled={
                  typeof item.stock === "number" && item.quantity >= item.stock
                }
              >
                <Icon name="add" />
              </button>
            </div>

            <span className="cart-item-line-total">
              ${(item.price * item.quantity).toFixed(2)}
            </span>

            <button
              type="button"
              className="btn-delete"
              onClick={() => removeItem(item.id)}
              title={`Remove ${item.name}`}
            >
              <Icon name="delete" /> Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>Total</span>
        <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
      </div>

      <div className="cart-checkout">
        <Link to="/credit-card" className="checkout-action">Checkout →</Link>
      </div>
    </div>
  );
}

export default Cart;
