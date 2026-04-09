import { useState } from "react";
import FeatureToggle from "@/components/FeatureToggle";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <FeatureToggle
        storageKey="gameReviewRedirect"
        label="Redirect chess.com Game review to wintrchess.com"
      />
    </>
  );
}

export default App;
