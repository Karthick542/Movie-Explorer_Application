import React from "react";
import { getImageUrl } from "../utils/tmdb";

export default function Hero({ movie, onSelectMovie, onWatchTrailer }) {
  if (!movie) return null;

  const backdropUrl = getImageUrl(movie.backdrop_path, "original");
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <section className="hero">
      <div
        className="hero-backdrop"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none"
        }}
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-tag">Spotlight Movie</span>
        <h1 className="hero-title">{movie.title}</h1>
        
        <div className="hero-meta">
          <span className="hero-rating">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
            </svg>
            {rating}
          </span>
          {releaseYear && <span>{releaseYear}</span>}
          {movie.runtime && <span>{movie.runtime} min</span>}
        </div>

        <p className="hero-overview">{movie.overview}</p>

        <div className="hero-actions">
          {movie.trailer_key && (
            <button className="btn-primary" onClick={() => onWatchTrailer(movie)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M8 5v14l11-7z"></path>
              </svg>
              Watch Trailer
            </button>
          )}
          <button className="btn-secondary" onClick={() => onSelectMovie(movie)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            More Info
          </button>
        </div>
      </div>
    </section>
  );
}
