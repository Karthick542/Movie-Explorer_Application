import React, { useState, useEffect } from "react";
import "./App.css";

// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import MovieGrid from "./components/MovieGrid";
import MovieModal from "./components/MovieModal";
import SettingsModal from "./components/SettingsModal";

// Utilities & API
import { getGenres, getPopularMovies, searchMovies, isLiveMode, getApiKey } from "./utils/tmdb";

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState("home");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Theme State (Default to Dark)
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  // Data States
  const [rawMovies, setRawMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  // Favorites (Sync with LocalStorage)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("movie_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // API Configuration Key Status Tracker (triggers refetches)
  const [apiKeyStatus, setApiKeyStatus] = useState(getApiKey());

  // 1. Sync Theme with DOM
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkTheme]);

  // 2. Debounce Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 3. Fetch Genres on Mount/API Key Change
  useEffect(() => {
    async function fetchGenres() {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    }
    fetchGenres();
  }, [apiKeyStatus]);

  // 4. Fetch Movies based on Search/Popular
  useEffect(() => {
    let isMounted = true;

    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        let results = [];
        if (debouncedSearchQuery.trim() === "") {
          results = await getPopularMovies();
        } else {
          results = await searchMovies(debouncedSearchQuery);
        }
        
        if (isMounted) {
          setRawMovies(results);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch movie data.");
          setLoading(false);
        }
      }
    }

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchQuery, apiKeyStatus]);

  // 5. Save Favorites to LocalStorage
  useEffect(() => {
    localStorage.setItem("movie_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Favorite Toggling Handler
  const handleToggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === movie.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  // Reset/Clear Search & Filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setSortBy("popularity.desc");
    setError(null);
  };

  // Process, filter, and sort movies client-side for rapid response
  const getProcessedMovies = () => {
    const sourceMovies = activeTab === "favorites" ? favorites : rawMovies;
    
    // A. Filter by Genre
    let processed = [...sourceMovies];
    if (selectedGenre !== "") {
      processed = processed.filter(
        (movie) => movie.genre_ids && movie.genre_ids.includes(Number(selectedGenre))
      );
    }

    // B. Sort
    processed.sort((a, b) => {
      if (sortBy === "vote_average.desc") {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }
      if (sortBy === "release_date.desc") {
        const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
        const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
        return dateB - dateA;
      }
      if (sortBy === "title.asc") {
        return a.title.localeCompare(b.title);
      }
      // Default: Popularity (based on TMDB popularity score, vote_count, or index if unavailable)
      const popA = a.popularity || a.vote_count || 0;
      const popB = b.popularity || b.vote_count || 0;
      return popB - popA;
    });

    return processed;
  };

  const processedMovies = getProcessedMovies();
  
  // The Hero spotlight movie is the top-rated/first popular movie in the list
  const spotlightMovie = rawMovies.length > 0 ? rawMovies[0] : null;

  return (
    <div className="app">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        isLive={isLiveMode()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Hero Showcase (only on Home tab and when not actively searching) */}
      {activeTab === "home" && !searchQuery && spotlightMovie && !loading && !error && (
        <Hero
          movie={spotlightMovie}
          onSelectMovie={setSelectedMovie}
          onWatchTrailer={setSelectedMovie}
        />
      )}

      {/* Main Movie Catalog Section */}
      <main className="main-content" style={{ marginTop: activeTab === "home" && !searchQuery ? "0" : "2.5rem" }}>
        <div className="container">
          {/* Catalog Title */}
          {activeTab === "home" ? (
            <h2 className="section-title">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Popular & Trending Movies"}
            </h2>
          ) : (
            <h2 className="section-title">Your Favorite Movies</h2>
          )}

          {/* Search, Genre Filters, and Sorting controls */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            genres={genres}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Movie Grid */}
          <MovieGrid
            movies={processedMovies}
            loading={loading}
            error={error}
            favorites={favorites}
            onSelectMovie={setSelectedMovie}
            onToggleFavorite={handleToggleFavorite}
            onClearFilters={handleClearFilters}
            searchQuery={searchQuery}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} MovieExplorer. Powered by React and TMDB.
        </p>
      </footer>

      {/* Detailed Movie Profile Overlay Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSelectMovie={setSelectedMovie} // Allows navigating similar movies
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* API Key Configurations Modal */}
      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onKeySave={(newKey) => setApiKeyStatus(newKey)}
        />
      )}
    </div>
  );
}
