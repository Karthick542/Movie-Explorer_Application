import { MOCK_MOVIES, MOCK_GENRES } from "./mockData";

const STORAGE_KEY = "tmdb_api_key";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Helper to check if token is v4 JWT (usually long and starts with ey)
const isV4Token = (token) => {
  return token && token.length > 50 && token.startsWith("ey");
};

// Retrieve the token/key from localStorage
export const getApiKey = () => {
  return localStorage.getItem(STORAGE_KEY) || "6dacd6dded24eea030458787a011b6ea";
};

// Save the token/key to localStorage
export const setApiKey = (key) => {
  if (key) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Check if we are running in Live Mode
export const isLiveMode = () => {
  return !!getApiKey();
};

// Construct headers/query parameters based on token type
const getRequestConfig = () => {
  const key = getApiKey();
  if (!key) return null;

  if (isV4Token(key)) {
    return {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json;charset=utf-8"
      },
      params: ""
    };
  } else {
    return {
      headers: {},
      params: `api_key=${key}`
    };
  }
};

// Fetch helper with error handling
const fetchFromApi = async (endpoint, queryParams = "") => {
  const config = getRequestConfig();
  if (!config) {
    throw new Error("API key not configured.");
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}${config.params}${queryParams ? `&${queryParams}` : ""}`;

  const response = await fetch(url, { headers: config.headers });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized. Please check your TMDB API Key.");
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Unified API Interface

// Fetch list of genres
export const getGenres = async () => {
  if (!isLiveMode()) {
    return MOCK_GENRES;
  }
  try {
    const data = await fetchFromApi("/genre/movie/list");
    return data.genres || MOCK_GENRES;
  } catch (error) {
    console.error("Failed to fetch live genres, using mock genres:", error);
    return MOCK_GENRES;
  }
};

// Fetch popular movies
export const getPopularMovies = async () => {
  if (!isLiveMode()) {
    return MOCK_MOVIES;
  }
  try {
    const data = await fetchFromApi("/movie/popular");
    return data.results || MOCK_MOVIES;
  } catch (error) {
    console.error("Failed to fetch live popular movies, using mock data:", error);
    throw error;
  }
};

// Search movies by query string
export const searchMovies = async (query) => {
  if (!query || query.trim() === "") {
    return getPopularMovies();
  }

  if (!isLiveMode()) {
    const term = query.toLowerCase();
    return MOCK_MOVIES.filter(
      (movie) =>
        movie.title.toLowerCase().includes(term) ||
        movie.overview.toLowerCase().includes(term) ||
        movie.tagline?.toLowerCase().includes(term)
    );
  }

  try {
    const data = await fetchFromApi("/search/movie", `query=${encodeURIComponent(query)}`);
    return data.results || [];
  } catch (error) {
    console.error("Failed to search movies on TMDB, falling back to mock search:", error);
    throw error;
  }
};

// Fetch full details of a specific movie
export const getMovieDetails = async (id) => {
  const numericId = Number(id);

  if (!isLiveMode()) {
    const mockMovie = MOCK_MOVIES.find((m) => m.id === numericId);
    if (!mockMovie) {
      throw new Error("Movie not found in mock database.");
    }
    // Simulate API response for similar/recommendations and videos
    return {
      ...mockMovie,
      videos: {
        results: mockMovie.trailer_key ? [{ key: mockMovie.trailer_key, site: "YouTube", type: "Trailer" }] : []
      },
      recommendations: {
        results: MOCK_MOVIES.filter((m) => mockMovie.recommendations?.includes(m.id))
      }
    };
  }

  try {
    // Append videos and recommendations to reduce round-trips
    const data = await fetchFromApi(`/movie/${id}`, "append_to_response=videos,recommendations,credits");
    
    // Format the response to fit our component expectations
    const trailer = data.videos?.results?.find(
      (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    );
    
    return {
      ...data,
      trailer_key: trailer ? trailer.key : "",
      cast: data.credits?.cast?.slice(0, 5).map(c => ({ name: c.name, character: c.character })) || [],
      recommendations: {
        results: data.recommendations?.results?.slice(0, 4) || []
      }
    };
  } catch (error) {
    console.error(`Failed to fetch movie details for ID ${id}:`, error);
    throw error;
  }
};

// Helper to construct TMDB image URLs
export const getImageUrl = (path, size = "w500") => {
  if (!path) return "";
  if (path.startsWith("http")) return path; // Support absolute URLs if any
  return `${IMAGE_BASE_URL}/${size}${path}`;
};
