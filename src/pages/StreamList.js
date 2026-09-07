import React, { useState } from "react";

function StreamList() {
  const [movie, setMovie] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (movie.trim() !== "") {
      console.log("Movie or Program Added:", movie);
      setMovie("");
    }
  };

  return (
    <section className="streamlist-page">
      <div className="hero">
        <h1>Welcome to StreamList</h1>

        <p>
          Create your personal list of movies and programs you want to watch.
        </p>

        <form onSubmit={handleSubmit} className="stream-form">
          <input
            type="text"
            placeholder="Enter a movie or program"
            value={movie}
            onChange={(event) => setMovie(event.target.value)}
          />

          <button type="submit">Add to List</button>
        </form>
      </div>
    </section>
  );
}

export default StreamList;