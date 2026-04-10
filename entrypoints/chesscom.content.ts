import { browser } from "wxt/browser";

function safeSerialize(arg: any) {
  try {
    if (typeof arg === "object") {
      return JSON.stringify(arg);
    }
    return String(arg);
  } catch {
    return "[Unserializable]";
  }
}

export default defineContentScript({
  matches: ["*://*.chess.com/*"],
  main() {
    console.log("[WintrChess Ext] Content script loaded");

    browser.storage.local.get(
      ["gameReviewRedirect", "verboseLogging"],
      ({ gameReviewRedirect, verboseLogging }) => {
        if (!verboseLogging) {
          console.log = function (...args) {
            browser.runtime.sendMessage({
              type: "LOG",
              args: args.map(safeSerialize),
            });
          };
          console.warn = function (...args) {
            browser.runtime.sendMessage({
              type: "WARN",
              args: args.map(safeSerialize),
            });
          };
          console.error = function (...args) {
            browser.runtime.sendMessage({
              type: "ERR",
              args: args.map(safeSerialize),
            });
          };
        }
        if (!gameReviewRedirect) {
          console.log("[WintrChess Ext] gameReviewRedirect disabled, exiting.");
          return;
        }

        const updateGameReviewLinks = () => {
          const username =
            document
              .querySelector("h2.sidebar-link-text")
              ?.textContent?.trim() || "";

          if (!username) {
            console.warn(
              "[WintrChess Ext] Could not find username on the page.",
            );
          } else {
            console.log(`[WintrChess Ext] Found username: ${username}`);
          }

          const buttons = document.querySelectorAll<HTMLElement>(
            '[data-cy="game-over-modal-game-review-button"], [data-cy="sidebar-game-review-button"]',
          );

          if (buttons.length === 0) {
            console.log("[WintrChess Ext] No game review buttons found yet.");
          } else {
            console.log(
              `[WintrChess Ext] Found ${buttons.length} game review button(s). Updating...`,
            );
            buttons.forEach((btn) => {
              const gid = window.location.pathname.split("/").pop();
              const newHref = `https://www.wintrchess.com/analysis?WCXUSR=${encodeURIComponent(username)}&WCXGID=${gid}`;
              btn.setAttribute("href", newHref);
              console.log(`[WintrChess Ext] Updated button: ${newHref}`);
            });
          }
        };

        const observer = new MutationObserver((mutationsList) => {
          console.log("[WintrChess Ext] Mutation detected", mutationsList);
          mutationsList.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
              mutation.addedNodes.forEach((node) => {
                if (
                  node instanceof Element &&
                  (node.getAttribute("data-cy") ===
                    "game-over-modal-game-review-button" ||
                    node.getAttribute("data-cy") ===
                      "sidebar-game-review-button")
                ) {
                  console.log(
                    "[WintrChess Ext] New game review button added to DOM.",
                  );
                  updateGameReviewLinks();
                }
              });
            }
          });
        });

        const handleClick = (e: MouseEvent) => {
          const target = e.target as HTMLElement;

          const button = target.closest<HTMLElement>(
            '[data-cy="game-over-modal-game-review-button"], [data-cy="sidebar-game-review-button"]',
          );

          if (!button) return;

          console.log(
            "[WintrChess Ext] Intercepted click on game review button",
          );

          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          const username =
            document
              .querySelector("h2.sidebar-link-text")
              ?.textContent?.trim() || "";

          const gid = window.location.pathname.split("/").pop();

          const url = `https://www.wintrchess.com/analysis?WCXUSR=${encodeURIComponent(username)}&WCXGID=${gid}`;

          console.log("[WintrChess Ext] Redirecting to:", url);

          window.location.href = url;
        };

        // Attach ASAP
        document.addEventListener("click", handleClick, true); // <-- capture phase

        // Start observing the body
        observer.observe(document.body, { childList: true, subtree: true });

        // Run immediately in case buttons already exist
        document.addEventListener("DOMContentLoaded", () => {
          console.log(
            "[WintrChess Ext] DOMContentLoaded fired, checking buttons...",
          );
          updateGameReviewLinks();
        });

        // Also check periodically for extra safety
        const interval = setInterval(() => {
          console.log("[WintrChess Ext] Periodic check for buttons...");
          updateGameReviewLinks();
        }, 2000);

        console.log("[WintrChess Ext] Observer and interval set up.");
      },
    );
  },
});
