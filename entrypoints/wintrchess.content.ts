import { browser } from "wxt/browser";

async function getChessComPGN(username: string, gameId: string) {
  const archivesRes = await fetch(
    `https://api.chess.com/pub/player/${username}/games/archives`,
  );
  const { archives } = await archivesRes.json();

  for (const archive of archives.reverse()) {
    const res = await fetch(archive);
    const data = await res.json();

    const game = data.games.find((g: { url: string | any[] }) =>
      g.url.includes(gameId),
    );

    if (game) return game.pgn;
  }

  return null;
}

export default defineContentScript({
  matches: ["*://*.wintrchess.com/*"],
  main() {
    browser.storage.local.get(
      ["gameReviewRedirect"],
      ({ gameReviewRedirect }) => {
        if (!gameReviewRedirect) return;
        document.addEventListener("DOMContentLoaded", () => {
          const params = new URLSearchParams(window.location.search);
          const wcxusr = params.get("WCXUSR");
          const wcxgid = params.get("WCXGID");

          if (wcxusr && wcxgid) {
            getChessComPGN(wcxusr, wcxgid).then((pgn) => {
              if (pgn) {
                window.postMessage(
                  {
                    type: "WINTRCHESS_PGN",
                    pgn,
                  },
                  "*",
                );
              }
            });
          }
        });
      },
    );
  },
});
