import { useState } from "react";
import FeatureToggle from "@/components/FeatureToggle";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <FeatureToggle
        storageKey="gameReviewRedirect"
        label="Redirect chess.com or lichess.org Game review to wintrchess.com"
      />
      <FeatureToggle
        storageKey="verboseLogging"
        label="Enable verbose logging in the page console for content scripts (chess.com & wintrchess.com) (for debugging)"
      />
      Note: This could fill your page logs. Normally, it gets redirected to the
      background script, so you can just inspect the extension via the extension
      page and then click inspect on the background script id for chrome, or
      "Debug Plugin" for firefox.
    </>
  );
}

export default App;
