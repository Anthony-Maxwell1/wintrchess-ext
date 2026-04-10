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
  matches: ["*://*.wintrchess.com/*"],
  main() {
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

        console.log(
          "[WintrChess Ext] gameReviewRedirect value:",
          gameReviewRedirect,
        );

        if (!gameReviewRedirect) {
          console.log("[WintrChess Ext] Feature disabled, exiting.");
          return;
        }

        const run = async () => {
          console.log("[WintrChess Ext] Running main logic");

          const params = new URLSearchParams(window.location.search);
          const wcxusr = params.get("WCXUSR");
          const wcxgid = params.get("WCXGID");

          console.log("[WintrChess Ext] URL params:", {
            WCXUSR: wcxusr,
            WCXGID: wcxgid,
          });

          if (!wcxusr || !wcxgid) {
            console.warn("[WintrChess Ext] Missing params, aborting.");
            return;
          }

          const pgn = await browser.runtime.sendMessage({
            type: "GET_PGN",
            username: wcxusr,
            gameId: wcxgid,
          });

          if (!pgn) {
            console.warn("[WintrChess Ext] No PGN received from background.");
            return;
          }
          const triggerAnalysis = () => {
            setTimeout(() => {
              const select = document.querySelector(
                ".Q25xPvRiw5QyQNKxbAYp",
              ) as HTMLSelectElement | null;
              // 2. Wait for options to render
              if (select) {
                // 4. Click it
                select.value = "PGN";
                select.dispatchEvent(new Event("change", { bubbles: true }));
                console.log("[Ext] Selected PGN option");
              } else {
                console.warn("[Ext] Select not found");
                triggerAnalysis();
                return;
              }
              const textarea = document.querySelector(
                ".F4_zJ5lO9K5VVnbRoZC1",
              ) as HTMLTextAreaElement | null;
              if (textarea) {
                textarea.value = pgn;
                textarea.dispatchEvent(new Event("input", { bubbles: true }));
                console.log("[Ext] PGN pasted into textarea");
                setTimeout(() => {
                  const analyse = document.querySelector(
                    ".rHBNQrpvd7mwKp3HqjVQ.qgX0SwOb9DIhILObqMfd",
                  );
                  if (analyse) {
                    (analyse as HTMLElement).click();
                    console.log("[Ext] Analyse button clicked");
                  } else {
                    console.warn("[Ext] Analyse button not found");
                    triggerAnalysis();
                    return;
                  }
                }, 200);
              } else {
                console.warn("[Ext] Textarea not found");
                triggerAnalysis();
                return;
              }
            }, 50);
          };
          triggerAnalysis();
        };
        if (document.readyState !== "loading") {
          setTimeout(run, 500);
        } else {
          document.addEventListener("DOMContentLoaded", () => {
            setTimeout(run, 500);
          });
        }
      },
    );
  },
});
