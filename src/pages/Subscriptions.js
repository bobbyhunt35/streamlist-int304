import React, { useState } from "react";
import catalog from "../data/catalog";
import { useCart } from "../context/CartContext";

function Icon({ name }) {
  return (
    <span className="material-symbols-rounded" aria-hidden="true">
      {name}
    </span>
  );
}

function ProductCard({ product, disabled, buttonLabel, onAdd }) {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        onError={(event) => {
          event.target.style.display = "none";
        }}
      />
      <h3>{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-price">
        ${product.price.toFixed(2)}
        {product.category === "subscription" ? "/mo" : ""}
      </p>
      <button type="button" onClick={onAdd} disabled={disabled}>
        <Icon name={disabled ? "check_circle" : "add_shopping_cart"} />
        {buttonLabel}
      </button>
    </div>
  );
}

function Subscriptions() {
  const { addItem, cartItems } = useCart();
  const [warning, setWarning] = useState("");

  const subscriptions = catalog.filter((p) => p.category === "subscription");
  const accessories = catalog.filter((p) => p.category === "accessory");

  const activeSubscriptionId = cartItems.find(
    (item) => item.category === "subscription"
  )?.id;

  function handleAdd(product) {
    const result = addItem(product);
    setWarning(result.ok ? "" : result.message);
  }

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-header">
        <Icon name="workspace_premium" />
        <h1>Subscriptions &amp; Accessories</h1>
        <p>Choose a plan and grab some EZTechMovie gear.</p>
      </div>

      {warning && (
        <div className="warning-banner" role="alert">
          <Icon name="warning" />
          {warning}
        </div>
      )}

      <section className="product-section">
        <h2>Subscription Plans</h2>
        <div className="product-grid">
          {subscriptions.map((product) => {
            const inCart = activeSubscriptionId === product.id;
            return (
              <ProductCard
                key={product.id}
                product={product}
                disabled={inCart}
                buttonLabel={inCart ? "In Cart" : "Add to Cart"}
                onAdd={() => handleAdd(product)}
              />
            );
          })}
        </div>
      </section>

      <section className="product-section">
        <h2>Accessories</h2>
        <div className="product-grid">
          {accessories.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              disabled={false}
              buttonLabel="Add to Cart"
              onAdd={() => handleAdd(product)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Subscriptions;
