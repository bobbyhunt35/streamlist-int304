import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaFilm } from "react-icons/fa";
import {
  REACTIONS,
  MAX_COMMENT_LENGTH,
  MAX_NAME_LENGTH,
  getShare,
  getViewerId,
  addComment,
  toggleReaction,
} from "../utils/sharing";

function Icon({ name }) {
  return (
    <span className="material-symbols-rounded" aria-hidden="true">
      {name}
    </span>
  );
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// FR-13: a viewer can react to and comment on a shared StreamList.
function SharedList() {
  const { shareId } = useParams();
  const [share, setShare] = useState(() => getShare(shareId));
  const [viewerId] = useState(getViewerId);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  if (!share) {
    return (
      <div className="app-container">
        <h1>
          <FaFilm aria-hidden="true" /> Shared StreamList
        </h1>
        <div className="empty-state">
          <Icon name="link_off" />
          <p>
            We could not find this shared list. It may have been removed, or it
            was shared from a different browser.
          </p>
          <Link to="/streamlist">Back to your StreamList</Link>
        </div>
      </div>
    );
  }

  const canPost = text.trim() !== "";

  const handleReaction = (key) => {
    const updated = toggleReaction(shareId, key, viewerId);
    if (updated) setShare(updated);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canPost) return;

    const updated = addComment(shareId, author, text);
    if (updated) {
      setShare(updated);
      setText("");
    }
  };

  return (
    <div className="app-container shared-page">
      <h1>
        <FaFilm aria-hidden="true" /> {share.title}
      </h1>
      <p>
        {share.items.length} {share.items.length === 1 ? "title" : "titles"}{" "}
        shared with you. Last updated {formatTime(share.updatedAt)}.
      </p>

      <div className="list-container">
        {share.items.length === 0 ? (
          <div className="empty-state">
            <Icon name="playlist_add" />
            <p>This list is empty right now.</p>
          </div>
        ) : (
          share.items.map((item) => (
            <div
              key={item.id}
              className={`list-item ${item.completed ? "completed" : ""}`}
            >
              <span>{item.text}</span>
              {item.completed && <span className="watched-tag">Watched</span>}
            </div>
          ))
        )}
      </div>

      <div className="reaction-bar" role="group" aria-label="Reactions">
        {REACTIONS.map((reaction) => {
          const people = share.reactions[reaction.key] || [];
          const active = people.includes(viewerId);

          return (
            <button
              key={reaction.key}
              type="button"
              className={`btn-reaction ${active ? "active" : ""}`}
              aria-pressed={active}
              onClick={() => handleReaction(reaction.key)}
              title={reaction.label}
            >
              <Icon name={reaction.icon} />
              {reaction.label} <span className="reaction-count">{people.length}</span>
            </button>
          );
        })}
      </div>

      <section className="comments" aria-labelledby="comments-heading">
        <h2 id="comments-heading">
          Comments ({share.comments.length})
        </h2>

        {share.comments.length === 0 ? (
          <p className="share-note">No comments yet. Be the first to say something.</p>
        ) : (
          <ul className="comment-list">
            {share.comments.map((comment) => (
              <li key={comment.id} className="comment">
                <div className="comment-meta">
                  <strong>{comment.author}</strong>
                  <span>{formatTime(comment.createdAt)}</span>
                </div>
                <p>{comment.text}</p>
              </li>
            ))}
          </ul>
        )}

        <form className="comment-form" onSubmit={handleSubmit}>
          <label htmlFor="comment-author">Your name (optional)</label>
          <input
            id="comment-author"
            type="text"
            value={author}
            maxLength={MAX_NAME_LENGTH}
            onChange={(event) => setAuthor(event.target.value)}
          />

          <label htmlFor="comment-text">Comment</label>
          <textarea
            id="comment-text"
            rows={3}
            value={text}
            maxLength={MAX_COMMENT_LENGTH}
            onChange={(event) => setText(event.target.value)}
          />

          <div className="comment-form-footer">
            <span className="share-fineprint">
              {text.length}/{MAX_COMMENT_LENGTH}
            </span>
            <button type="submit" disabled={!canPost}>
              <Icon name="send" /> Post comment
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default SharedList;
