import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navigation from "./components/Navigation";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import StreamList from "./pages/StreamList";
import Movies from "./pages/Movies";
import Subscriptions from "./pages/Subscriptions";
import Cart from "./pages/Cart";
import CreditCard from "./pages/CreditCard";
import About from "./pages/About";
import SharedList from "./pages/SharedList";

// Shell for every signed-in page: navigation bar plus the routed page.
function AppLayout() {
  return (
    <>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* The only page reachable without signing in (FR-1). */}
          <Route path="/login" element={<Login />} />

          {/* Everything else requires a Google sign-in (FR-2). */}
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Navigate to="/streamlist" replace />} />
            <Route path="/streamlist" element={<StreamList />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/credit-card" element={<CreditCard />} />
            <Route path="/about" element={<About />} />
            <Route path="/shared/:shareId" element={<SharedList />} />
            <Route path="*" element={<Navigate to="/streamlist" replace />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
