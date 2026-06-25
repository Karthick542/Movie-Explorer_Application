import React, { useEffect, useState, useRef } from "react";
import { getImageUrl, getMovieDetails } from "../utils/tmdb";

export default function MovieModal({ movie, onClose, onSelectMovie, favorites, onToggleFavorite }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  // Fetch full details when the movie ID changes
  useEffect(() => {
    let isMounted = true;
    
    async function fetchDetails() {
      setLoading(true);
      setError(null);
      try {
        const fullData = await getMovieDetails(movie.id);
        if (isMounted) {
          setDetails(fullData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load movie details.");
          setLoading(false);
        }
      }
    }

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [movie.id]);

  // Handle Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    
    // Disable scrolling on the main document when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Handle click outside modal content to close
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const isFav = favorites.some((fav) => fav.id === movie.id);
  
  const backdropUrl = details ? getImageUrl(details.backdrop_path, "original") : getImageUrl(movie.backdrop_path, "original");
  const posterUrl = details ? getImageUrl(details.poster_path, "w500") : getImageUrl(movie.poster_path, "w500");
  const releaseYear = (details ? details.release_date : movie.release_date)?.split("-")[0] || "";
  const rating = (details ? details.vote_average : movie.vote_average)?.toFixed(1) || "0.0";

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="detail-modal" ref={modalRef}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Hero Backdrop Banner inside Modal */}
        <div
          className="modal-backdrop-banner"
          style={{
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none",
            backgroundColor: "var(--bg-secondary)"
          }}
        >
          <div className="modal-backdrop-overlay" />
          <div className="modal-backdrop-content">
            {/* Poster Image */}
            <div className="modal-poster-wrapper">
              {posterUrl ? (
                <img src={posterUrl} alt={movie.title} className="modal-poster-img" />
              ) : (
                <div className="poster-placeholder" style={{ height: "100%" }}>
                  <span>{movie.title}</span>
                </div>
              )}
            </div>

            <div className="modal-header-info">
              <h2 className="modal-title">{movie.title}</h2>
              {details?.tagline && <p className="modal-tagline">"{details.tagline}"</p>}
              
              <div className="modal-meta-row">
                <span className="hero-rating" style={{ background: "rgba(var(--accent-rgb), 0.15)", border: "1px solid var(--accent-color)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ fill: "var(--accent-color)" }}>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                  </svg>
                  {rating}
                </span>
                {releaseYear && <span>{releaseYear}</span>}
                {details?.runtime ? <span>{details.runtime} min</span> : movie.runtime ? <span>{movie.runtime} min</span> : null}
                
                <button 
                  className={`tab-btn ${isFav ? "active" : ""}`} 
                  onClick={() => onToggleFavorite(movie)}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "6px", 
                    padding: "6px 12px", 
                    fontSize: "0.8rem",
                    backgroundColor: isFav ? "var(--heart-color)" : "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    border: "none"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {isFav ? "Favorited" : "Add to Favorites"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Main Body Content */}
        <div className="modal-body-layout">
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3rem" }}>
              <div className="spinner" />
              <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Loading detailed profile...</p>
            </div>
          ) : error ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--heart-color)" }}>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Detailed Columns */}
              <div className="modal-grid-details">
                {/* Left Column: Synopsis, Trailer */}
                <div className="modal-main-info">
                  <div className="modal-section">
                    <h3 className="modal-section-title">Overview</h3>
                    <p className="modal-overview-text">{details.overview || "No overview available."}</p>
                  </div>

                  {details.genres && details.genres.length > 0 && (
                    <div className="modal-section">
                      <h3 className="modal-section-title">Genres</h3>
                      <div className="modal-genre-tags">
                        {details.genres.map((g) => (
                          <span key={g.id} className="modal-genre-badge">{g.name}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YouTube Trailer Video */}
                  {details.trailer_key && (
                    <div className="modal-section">
                      <h3 className="modal-section-title">Official Trailer</h3>
                      <div className="trailer-container">
                        <iframe
                          src={`https://www.youtube.com/embed/${details.trailer_key}`}
                          title={`${details.title} Official Trailer`}
                          className="trailer-iframe"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Cast and Metadata */}
                <div className="modal-sidebar-info">
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <span className="info-val">{details.status || "Released"}</span>
                  </div>
                  {details.release_date && (
                    <div className="info-item">
                      <span className="info-label">Release Date</span>
                      <span className="info-val">{new Date(details.release_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>
                  )}
                  {details.budget > 0 && (
                    <div className="info-item">
                      <span className="info-label">Budget</span>
                      <span className="info-val">${details.budget.toLocaleString()}</span>
                    </div>
                  )}
                  {details.revenue > 0 && (
                    <div className="info-item">
                      <span className="info-label">Revenue</span>
                      <span className="info-val">${details.revenue.toLocaleString()}</span>
                    </div>
                  )}

                  {details.cast && details.cast.length > 0 && (
                    <div className="modal-section" style={{ marginTop: "0.5rem" }}>
                      <span className="info-label" style={{ marginBottom: "8px" }}>Key Cast</span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {details.cast.map((c, i) => (
                          <div className="cast-member" key={i}>
                            <span className="cast-name">{c.name}</span>
                            <span className="cast-char">{c.character}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar Recommendations Section */}
              {details.recommendations?.results && details.recommendations.results.length > 0 && (
                <div className="modal-section" style={{ marginTop: "1rem" }}>
                  <h3 className="modal-section-title">You Might Also Like</h3>
                  <div className="modal-recommendations">
                    {details.recommendations.results.slice(0, 4).map((rec) => {
                      const recPoster = getImageUrl(rec.poster_path, "w500");
                      return (
                        <div
                          className="rec-card"
                          key={rec.id}
                          onClick={() => onSelectMovie(rec)}
                          title={`View details for ${rec.title}`}
                        >
                          <div className="rec-poster">
                            {recPoster ? (
                              <img src={recPoster} alt={rec.title} />
                            ) : (
                              <div className="poster-placeholder" style={{ height: "100%" }}>
                                <span>{rec.title}</span>
                              </div>
                            )}
                          </div>
                          <div className="rec-info">
                            <h4 className="rec-title">{rec.title}</h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
