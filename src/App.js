import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { CartProvider } from "./context/CartContext";
import Navigation from "./components/Navigation";
import StreamList from "./pages/StreamList";
import Movies from "./pages/Movies";
import Subscriptions from "./pages/Subscriptions";
import Cart from "./pages/Cart";
import About from "./pages/About";
import SharedList from "./pages/SharedList";

function App() {
  return (
    <CartProvider>
      <Navigation />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/streamlist" replace />} />
          <Route path="/streamlist" element={<StreamList />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/shared/:shareId" element={<SharedList />} />
          <Route path="*" element={<Navigate to="/streamlist" replace />} />
        </Routes>
      </main>
    </CartProvider>
  );
}

export default App;
