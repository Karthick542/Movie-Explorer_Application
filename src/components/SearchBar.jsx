import React from "react";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  genres,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy
}) {
  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="search-filter-section">
      {/* Search Input */}
      <div className="search-bar-wrapper">
        <svg
          className="search-icon-inside"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search movies by title, actors, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search-btn" onClick={handleClear} aria-label="Clear search">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Filters & Sorting */}
      <div className="filters-wrapper">
        {/* Genre Buttons Scroll */}
        <div className="genre-scroll">
          <button
            className={`genre-btn ${selectedGenre === "" ? "active" : ""}`}
            onClick={() => setSelectedGenre("")}
          >
            All Genres
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`genre-btn ${selectedGenre === genre.id ? "active" : ""}`}
              onClick={() => setSelectedGenre(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="sort-wrapper">
          <label htmlFor="sort-select" className="sort-label">Sort By:</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popularity.desc">Popularity</option>
            <option value="vote_average.desc">Rating</option>
            <option value="release_date.desc">Release Date</option>
            <option value="title.asc">Title (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
