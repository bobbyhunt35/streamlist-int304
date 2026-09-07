import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav className="navigation">
      <div className="logo">StreamList</div>

      <div className="nav-links">
        <Link to="/">StreamList</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navigation;