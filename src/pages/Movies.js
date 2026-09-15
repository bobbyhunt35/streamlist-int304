import React, { useState } from "react";

const SEARCH_STORAGE_KEY = "streamlist.movieSearch";
const TMDB_API_URL = "https://api.themoviedb.org/3/search/movie";
const POSTER_URL = "https://image.tmdb.org/t/p/w500";

function loadSavedSearch() {
  try {
    const saved = window.localStorage.getItem(SEARCH_STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : { query: "", results: [], hasSearched: false };
  } catch {
    return { query: "", results: [], hasSearched: false };
  }
}

function saveSearch(query, results) {
  try {
    window.localStorage.setItem(
      SEARCH_STORAGE_KEY,
      JSON.stringify({ query, results, hasSearched: true })
    );
  } catch {
    // The search still works if browser storage is unavailable.
  }
}

function Movies() {
  const savedSearch = loadSavedSearch();
  const [query, setQuery] = useState(savedSearch.query);
  const [results, setResults] = useState(savedSearch.results);
  const [hasSearched, setHasSearched] = useState(savedSearch.hasSearched);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchTerm = query.trim();

    if (!searchTerm) return;

    if (!apiKey) {
      setError(
        "TMDB API key is missing. Add REACT_APP_TMDB_API_KEY to your .env.local file and restart the app."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${TMDB_API_URL}?api_key=${apiKey}&query=${encodeURIComponent(
          searchTerm
        )}&include_adult=false&language=en-US&page=1`
      );

      if (!response.ok) {
        throw new Error("TMDB could not complete the search.");
      }

      const data = await response.json();
      const movieResults = (data.results || []).slice(0, 12);

      setResults(movieResults);
      setHasSearched(true);
      saveSearch(searchTerm, movieResults);
    } catch (requestError) {
      setError(`${requestError.message} Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setError("");

    try {
      window.localStorage.removeItem(SEARCH_STORAGE_KEY);
    } catch {
      // The screen can still be cleared if browser storage is unavailable.
    }
  };

  return (
    <section className="movies-page">
      <div className="movies-header">
        <span className="material-symbols-rounded" aria-hidden="true">
          movie_search
        </span>
        <h1>Movie Search</h1>
        <p>Search TMDB for movie details, ratings, and release dates.</p>
      </div>

      <form className="movie-search-form" onSubmit={handleSearch}>
        <label className="sr-only" htmlFor="movie-search">
          Search for a movie
        </label>
        <input
          id="movie-search"
          type="search"
          placeholder="Search for a movie title"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit" disabled={!query.trim() || loading}>
          <span className="material-symbols-rounded" aria-hidden="true">
            search
          </span>
          {loading ? "Searching..." : "Search"}
        </button>
        {(query || results.length > 0) && (
          <button type="button" className="clear-search" onClick={clearSearch}>
            Clear
          </button>
        )}
      </form>

      {error && (
        <p className="search-message error-message" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && hasSearched && results.length === 0 && (
        <p className="search-message">No movies matched your search.</p>
      )}

      {results.length > 0 && (
        <div className="movie-results" aria-live="polite">
          {results.map((movie) => (
            <article className="movie-card" key={movie.id}>
              {movie.poster_path ? (
                <img
                  src={`${POSTER_URL}${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                />
              ) : (
                <div className="poster-placeholder" aria-label="No poster available">
                  <span className="material-symbols-rounded" aria-hidden="true">
                    image_not_supported
                  </span>
                </div>
              )}

              <div className="movie-details">
                <h2>{movie.title}</h2>
                <p className="movie-meta">
                  <span>
                    <strong>Release:</strong> {movie.release_date || "Not available"}
                  </span>
                  <span>
                    <strong>Rating:</strong>{" "}
                    {movie.vote_average
                      ? `${movie.vote_average.toFixed(1)}/10`
                      : "Not rated"}
                  </span>
                </p>
                <p className="movie-overview">
                  {movie.overview || "No summary is available for this movie."}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Movies;
