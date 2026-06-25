import React from "react";
import { getImageUrl } from "../utils/tmdb";

export default function MovieCard({ movie, onSelect, isFavorite, onToggleFavorite }) {
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "0.0";

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent opening the details modal
    onToggleFavorite(movie);
  };

  return (
    <div className="movie-card" onClick={onSelect}>
      {/* Poster Image Container */}
      <div className="poster-container">
        {/* Rating Badge */}
        <div className="card-rating-badge" title={`Rating: ${rating}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
          </svg>
          {rating}
        </div>

        {/* Favorite Heart Toggle Button */}
        <button
          className={`fav-btn ${isFavorite ? "is-fav" : ""}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          aria-label="Toggle favorite"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="poster-img"
            loading="lazy"
          />
        ) : (
          <div className="poster-placeholder">
            {/* Camera / Movie Roll Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
            <span>{movie.title}</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="card-info">
        <h3 className="card-title" title={movie.title}>{movie.title}</h3>
        <div className="card-meta">
          <span>{releaseYear}</span>
        </div>
      </div>
    </div>
  );
}
