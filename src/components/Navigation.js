import React from "react";
import { NavLink } from "react-router-dom";
import { FaFilm } from "react-icons/fa";

const NAV_ITEMS = [
  { to: "/streamlist", label: "StreamList", icon: "playlist_add_check" },
  { to: "/movies", label: "Movies", icon: "movie" },
  { to: "/cart", label: "Cart", icon: "shopping_cart" },
  { to: "/about", label: "About", icon: "info" },
];

function Navigation() {
  return (
    <nav className="navigation">
      <div className="logo">
        <FaFilm aria-hidden="true" /> StreamList
      </div>

      <div className="nav-links">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <span className="material-symbols-rounded" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
