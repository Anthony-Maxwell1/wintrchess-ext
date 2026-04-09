import { browser } from "wxt/browser";

export default defineContentScript({
  matches: ["*://*.chess.com/*"],
  main() {
    browser.storage.local.get(
      ["gameReviewRedirect"],
      ({ gameReviewRedirect }) => {
        if (!gameReviewRedirect) return;
        document.addEventListener("DOMContentLoaded", () => {
          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              const username =
                document
                  .querySelector("h2.sidebar-link-text")
                  ?.textContent?.trim() || "";
              if (!username)
                alert("wintrchess-ext - Could not find username on the page.");
              // Check if nodes were added
              mutation.addedNodes.forEach((node) => {
                if (
                  node instanceof Element &&
                  (node.getAttribute("data-cy") ===
                    "game-over-modal-game-review-button" ||
                    node.getAttribute("data-cy") ===
                      "sidebar-game-review-button")
                ) {
                  node.setAttribute(
                    "href",
                    `https://www.wintrchess.com/analysis?WCXUSR=${""}&WCXGID=${window.location.pathname.split("/").pop()}`,
                  );
                }
              });
            }
          });
          // Start observing the entire document
          observer.observe(document.body, { childList: true, subtree: true });
        });
      },
    );
  },
});
