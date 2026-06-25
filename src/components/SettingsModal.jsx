import React, { useState, useEffect, useRef } from "react";
import { getApiKey, setApiKey } from "../utils/tmdb";

export default function SettingsModal({ onClose, onKeySave }) {
  const [keyInput, setKeyInput] = useState("");
  const modalRef = useRef(null);

  // Load active key into the input when opening
  useEffect(() => {
    setKeyInput(getApiKey());
  }, []);

  // Handle Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(keyInput);
    onKeySave(keyInput);
    onClose();
  };

  const handleClear = () => {
    setApiKey("");
    setKeyInput("");
    onKeySave("");
    onClose();
  };

  const hasKeyActive = !!keyInput.trim();

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="settings-modal" ref={modalRef}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close settings">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="settings-title">TMDB API Configuration</h2>
        
        <p className="settings-description">
          This application operates in a dual-mode engine. By default, it runs in <strong>Demo Mode</strong> using beautiful, curated mock data.
          To explore the live, global TMDB movie database, please configure your API Key.
        </p>

        <form className="settings-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="api-key-input" className="form-label">
              TMDB API Key (v3) or Read Access Token (v4)
            </label>
            <input
              id="api-key-input"
              type="password"
              className="settings-input"
              placeholder="Paste your TMDB API Key..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
            />
          </div>

          <p className="help-text">
            Don't have an API key? You can get one for free by signing up on{" "}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
              The Movie Database (TMDB)
            </a>{" "}
            and registering an application under your profile settings.
          </p>

          <div className="form-actions">
            {hasKeyActive && (
              <button
                type="button"
                className="btn-flat"
                style={{ color: "var(--heart-color)", borderColor: "rgba(239, 68, 68, 0.2)" }}
                onClick={handleClear}
              >
                Disconnect / Revert to Demo Mode
              </button>
            )}
            <button type="button" className="btn-flat" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save & Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
