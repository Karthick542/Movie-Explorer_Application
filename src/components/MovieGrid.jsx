import React from "react";
import MovieCard from "./MovieCard";

export default function MovieGrid({
  movies,
  loading,
  error,
  favorites,
  onSelectMovie,
  onToggleFavorite,
  onClearFilters,
  searchQuery
}) {
  // Render loading skeleton cards
  if (loading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton-poster skeleton" />
            <div className="skeleton-info">
              <div className="skeleton-text title skeleton" />
              <div className="skeleton-text skeleton" />
              <div className="skeleton-text meta skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render error message
  if (error) {
    return (
      <div className="error-container">
        {/* Warning Triangle Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-desc">{error}</p>
        <button className="btn-primary" onClick={onClearFilters}>
          Reset Settings / Filters
        </button>
      </div>
    );
  }

  // Render empty state
  if (movies.length === 0) {
    return (
      <div className="empty-container">
        {/* Search Film Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
        </svg>
        <h3 className="empty-title">No movies found</h3>
        <p className="empty-desc">
          {searchQuery
            ? `We couldn't find any matches for "${searchQuery}". Try checking for spelling errors or search for another title.`
            : "No movies fit your selected criteria. Try resetting the active genre filter."}
        </p>
        <button className="btn-secondary" onClick={onClearFilters}>
          Clear Search & Filters
        </button>
      </div>
    );
  }

  // Render grid of movies
  return (
    <div className="movie-grid">
      {movies.map((movie) => {
        const isFav = favorites.some((fav) => fav.id === movie.id);
        return (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={isFav}
            onToggleFavorite={onToggleFavorite}
            onSelect={() => onSelectMovie(movie)}
          />
        );
      })}
    </div>
  );
}
