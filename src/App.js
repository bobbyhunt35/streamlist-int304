import React, { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import { Routes, Route, Navigate } from "react-router-dom";
import Movies from "./pages/Movies";
import Cart from "./pages/Cart";
import About from "./pages/About";

import {
  FaCheck,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilm
} from "react-icons/fa";
function App() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim() === "") return;

    const newItem = {
      id: Date.now(),
      text: input,
      completed: false,
    };

    setItems([...items, newItem]);
    setInput("");
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleComplete = (id) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleSave = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, text: editText } : item
      )
    );

    setEditingId(null);
    setEditText("");
  };

  return (
  <>
    <Navigation />

    <Routes>
      <Route path="/" element={<Navigate to="/streamlist" replace />} />

      <Route
        path="/streamlist"
        element={
          <div className="app-container">
            <h1>
              <FaFilm /> StreamList
            </h1>

            <p>Add and manage your favorite movies and shows.</p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter a movie or show"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <button type="submit">
                <FaPlus /> Add
              </button>
            </form>

            <div className="list-container">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`list-item ${
                    item.completed ? "completed" : ""
                  }`}
                >
                  {editingId === item.id ? (
                    <>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />

                      <button onClick={() => handleSave(item.id)}>
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{item.text}</span>

                      <div className="button-group">
                        <button onClick={() => handleComplete(item.id)}>
                          <FaCheck /> Complete
                        </button>

                        <button onClick={() => handleEdit(item)}>
                          <FaEdit /> Edit
                        </button>

                        <button onClick={() => handleDelete(item.id)}>
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        }
      />

      <Route path="/movies" element={<Movies />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </>
);
}

export default App;
