import { useState } from "react";
import FeatureToggle from "@/components/FeatureToggle";
import "./App.css";

function App() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>♟️ Wintrchess Extension</h1>
        <button
          className="about-btn"
          onClick={() => setShowAbout(!showAbout)}
          title="About this extension"
        >
          i
        </button>
      </header>

      {showAbout && (
        <div className="about-modal">
          <div className="about-content">
            <h2>About Wintrchess Extension</h2>
            <div className="about-section">
              <h3>What it does</h3>
              <p>
                Redirects chess.com or lichess.org game reviews to
                wintrchess.com for enhanced analysis.
              </p>
            </div>

            <div className="about-section">
              <h3>Version Information</h3>
              <p>Version 1.0.0 (April 2026)</p>
            </div>

            <div className="about-section">
              <h3>Links</h3>
              <div className="links-container">
                <a
                  href="https://github.com/Anthony-Maxwell1/wintrchess-ext"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-link"
                >
                  GitHub Repository
                </a>
                <a
                  href="https://thatdev.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-link"
                >
                  Visit me: thatdev
                </a>
              </div>
            </div>

            <button
              className="close-btn"
              onClick={() => setShowAbout(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="popup-main">
        <section className="features-section">
          <h2>Features</h2>
          <div className="feature-list">
            <FeatureToggle
              storageKey="gameReviewRedirect"
              label="Redirect chess.com or lichess.org Game review to wintrchess.com"
            />
            <FeatureToggle
              storageKey="verboseLogging"
              label="Enable verbose logging in the page console for content scripts (chess.com & wintrchess.com) (for debugging)"
            />
          </div>
          <p className="info-note">
            💡 Verbose logging fills your page logs. Logs are redirected to the
            background script—inspect the extension and click the background
            script to view (Chrome) or use "Debug Plugin" (Firefox).
          </p>
        </section>

        <section className="disclaimer-section">
          <h3>⚠️ Disclaimer</h3>
          <p>
            This extension is not affiliated with chess.com, lichess.org, or
            wintrchess.com. The authors are not liable for any action taken
            against your chess.com account or any consequences from using this
            extension.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
