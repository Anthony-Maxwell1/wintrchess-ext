import { useEffect, useState } from "react";
import { browser } from "wxt/browser";

export default function FeatureToggle({
  storageKey,
  label,
}: {
  storageKey: string;
  label: string;
}) {
  const [enabled, setEnabled] = useState(false);

  // Load saved state from browser.storage
  useEffect(() => {
    browser.storage.local.get([storageKey]).then((result) => {
      setEnabled(!!result[storageKey]);
    });
  }, [storageKey]);

  // Handler for checkbox toggle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setEnabled(value);
    browser.storage.local.set({ [storageKey]: value });
  };

  return (
    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input type="checkbox" checked={enabled} onChange={handleChange} />
      {label}
    </label>
  );
}
