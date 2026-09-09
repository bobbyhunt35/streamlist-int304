import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import StreamList from "./pages/StreamList";
import Movies from "./pages/Movies";
import Cart from "./pages/Cart";
import About from "./pages/About";

function App() {
  return (
    <>
      <Navigation />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/streamlist" replace />} />
          <Route path="/streamlist" element={<StreamList />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/streamlist" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
