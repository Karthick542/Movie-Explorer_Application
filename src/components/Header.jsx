import React from "react";

export default function Header({
  activeTab,
  setActiveTab,
  isDarkTheme,
  setIsDarkTheme,
  isLive,
  onOpenSettings,
  favoritesCount
}) {
  return (
    <header className="header">
      <div className="logo" onClick={() => setActiveTab("home")} style={{ cursor: "pointer" }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.0003 4H20.0003C20.5526 4 21.0003 4.44772 21.0003 5V19C21.0003 19.5523 20.5526 20 20.0003 20H18.0003V18H19.0003V6H18.0003V4ZM16.0003 4V20H8.0003V4H16.0003ZM6.0003 4H4.0003C3.44801 4 3.0003 4.44772 3.0003 5V19C3.0003 19.5523 3.44801 20 4.0003 20H6.0003V18H5.0003V6H6.0003V4ZM10.0003 6H14.0003V9H10.0003V6ZM10.0003 11H14.0003V14H10.0003V11ZM10.0003 16H14.0003V19H10.0003V16Z"></path>
        </svg>
        <span>MovieExplorer</span>
      </div>

      <div className="nav-controls">
        <div className="nav-tabs">
          <button
            className={`tab-btn ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={`tab-btn ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            Favorites {favoritesCount > 0 && `(${favoritesCount})`}
          </button>
        </div>

        {isLive ? (
          <span className="live-badge" title="Connected to Live TMDB API">Live</span>
        ) : (
          <span className="demo-badge" title="Running in offline Demo Mode with mock data">Demo</span>
        )}

        <button
          className="action-btn"
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
          aria-label="Toggle theme"
        >
          {isDarkTheme ? (
            // Sun Icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            // Moon Icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>

        <button
          className="action-btn"
          onClick={onOpenSettings}
          title="Configure TMDB API Settings"
          aria-label="API settings"
        >
          {/* Settings / Gear Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}
