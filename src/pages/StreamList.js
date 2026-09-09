import React, { useEffect, useState } from "react";
import { FaFilm } from "react-icons/fa";

const STORAGE_KEY = "streamlist.items";

// Icons come from the Google Fonts Material Symbols library, loaded in
// public/index.html. Rendering one is just a span with the icon name inside.
function Icon({ name }) {
  return (
    <span className="material-symbols-rounded" aria-hidden="true">
      {name}
    </span>
  );
}

function loadItems() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function StreamList() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState(loadItems);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Keep the queue between visits so the list is not lost on refresh.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage blocked - the list still works for this session.
    }
  }, [items]);

  const completedCount = items.filter((item) => item.completed).length;
  const canAdd = input.trim() !== "";
  const canSave = editText.trim() !== "";

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canAdd) return;

    const newItem = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };

    setItems([newItem, ...items]);
    setInput("");
  };

  // A disabled default button suppresses the browser's implicit form
  // submission, so handle Enter explicitly to keep the keyboard path working.
  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const handleComplete = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDelete = (id) => {
    if (editingId === id) handleCancel();
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleSave = (id) => {
    if (!canSave) return;

    setItems(
      items.map((item) =>
        item.id === id ? { ...item, text: editText.trim() } : item
      )
    );

    setEditingId(null);
    setEditText("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleEditKeyDown = (event, id) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSave(id);
    }

    if (event.key === "Escape") {
      handleCancel();
    }
  };

  const handleClearCompleted = () => {
    setItems(items.filter((item) => !item.completed));
  };

  return (
    <div className="app-container">
      <h1>
        <FaFilm aria-hidden="true" /> StreamList
      </h1>

      <p>Add and manage your favorite movies and shows.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a movie or show"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleInputKeyDown}
          aria-label="Movie or show title"
        />

        <button type="submit" disabled={!canAdd}>
          <Icon name="add" /> Add
        </button>
      </form>

      <div className="list-summary">
        <span>
          {items.length} {items.length === 1 ? "item" : "items"} in your queue
          {items.length > 0 && ` \u2022 ${completedCount} watched`}
        </span>

        {completedCount > 0 && (
          <button
            type="button"
            className="link-button"
            onClick={handleClearCompleted}
          >
            <Icon name="cleaning_services" /> Clear watched
          </button>
        )}
      </div>

      <div className="list-container">
        {items.length === 0 ? (
          <div className="empty-state">
            <Icon name="playlist_add" />
            <p>Your queue is empty. Add a title above to get started.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`list-item ${item.completed ? "completed" : ""}`}
            >
              {editingId === item.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(event) => setEditText(event.target.value)}
                    onKeyDown={(event) => handleEditKeyDown(event, item.id)}
                    aria-label={`Edit ${item.text}`}
                    autoFocus
                  />

                  <div className="button-group">
                    <button
                      className="btn-save"
                      onClick={() => handleSave(item.id)}
                      disabled={!canSave}
                      title="Save changes (Enter)"
                    >
                      <Icon name="save" /> Save
                    </button>

                    <button
                      className="btn-cancel"
                      onClick={handleCancel}
                      title="Cancel editing (Esc)"
                    >
                      <Icon name="close" /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{item.text}</span>

                  <div className="button-group">
                    <button
                      className="btn-complete"
                      onClick={() => handleComplete(item.id)}
                      aria-pressed={item.completed}
                      title={
                        item.completed ? "Mark as unwatched" : "Mark as watched"
                      }
                    >
                      <Icon
                        name={
                          item.completed ? "check_circle" : "radio_button_unchecked"
                        }
                      />
                      {item.completed ? "Watched" : "Complete"}
                    </button>

                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(item)}
                      title={`Edit ${item.text}`}
                    >
                      <Icon name="edit" /> Edit
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                      title={`Delete ${item.text}`}
                    >
                      <Icon name="delete" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StreamList;
