import React, { useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "streamlist.creditCards.demo";
const readCards = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch { return []; }
};
const formatNumber = (value) => (value.replace(/\D/g, "").slice(0, 16).match(/.{1,4}/g) || []).join(" ");

function CreditCard() {
  const [cards, setCards] = useState(readCards);
  const [form, setForm] = useState({ name: "", number: "", expiry: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const saveCard = (event) => {
    event.preventDefault();
    setError(""); setMessage("");
    if (!form.name.trim()) return setError("Enter the name on the card.");
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(form.number)) return setError("Enter 16 digits in the format 1234 5678 9012 3456.");
    const expiry = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(form.expiry);
    if (!expiry) return setError("Enter expiration as MM/YY.");
    if (new Date(2000 + Number(expiry[2]), Number(expiry[1]), 0, 23, 59, 59) < new Date()) return setError("The card has expired.");
    const next = [...cards, { id: `${Date.now()}-${Math.random()}`, ...form, name: form.name.trim() }];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setCards(next); setForm({ name: "", number: "", expiry: "" });
      setMessage("Card saved in this browser. No payment was processed.");
    } catch { setError("Browser storage is unavailable. Enable it and try again."); }
  };
  const removeCard = (id) => {
    const next = cards.filter((card) => card.id !== id);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setCards(next); }
    catch { setError("Could not update browser storage."); }
  };

  return (
    <section className="checkout-page">
      <p className="checkout-kicker">STREAMLIST / CARD DETAILS</p>
      <h1>Credit card checkout</h1>
      <p className="checkout-intro">Add a card to your StreamList account.</p>
      <div className="checkout-grid">
        <div className="checkout-panel">
          <h2>Add a credit card</h2>
          <p className="demo-notice">Classroom demo: use an invented card number. This stores the full number in this browser only. Do not enter a real card; no payment is processed.</p>
          <form className="card-form" onSubmit={saveCard} noValidate>
            <label htmlFor="card-name">Name on card</label>
            <input id="card-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Morgan" autoComplete="off" maxLength="80" />
            <label htmlFor="card-number">Card number</label>
            <input id="card-number" value={form.number} onChange={(e) => setForm({ ...form, number: formatNumber(e.target.value) })} placeholder="1234 5678 9012 3456" inputMode="numeric" autoComplete="off" maxLength="19" />
            <small>Digits are grouped automatically into four sets of four.</small>
            <label htmlFor="card-expiry">Expiration date</label>
            <input id="card-expiry" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} placeholder="MM/YY" inputMode="numeric" autoComplete="off" maxLength="5" />
            {error && <p className="card-error" role="alert">{error}</p>}
            {message && <p className="card-success" role="status">{message}</p>}
            <button className="checkout-action" type="submit">Save card →</button>
          </form>
        </div>
        <aside className="checkout-panel saved-panel">
          <h2>Saved cards ({cards.length})</h2>
          {!cards.length && <p>No cards saved yet.</p>}
          {cards.map((card) => <div className="saved-card" key={card.id}>
            <strong>•••• {card.number.slice(-4)}</strong>
            <small>{card.name} · Expires {card.expiry}</small>
            <button onClick={() => removeCard(card.id)} aria-label={`Delete card ending ${card.number.slice(-4)}`}>Delete</button>
          </div>)}
          <Link to="/cart">← Back to cart</Link>
        </aside>
      </div>
    </section>
  );
}

export default CreditCard;
