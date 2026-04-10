export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (msg) => {
    if (msg.type === "GET_PGN") {
      const { username, gameId } = msg;

      console.log("[WintrChess BG] Fetching PGN for", username, gameId);

      try {
        const archivesRes = await fetch(
          `https://api.chess.com/pub/player/${username}/games/archives`,
        );

        const { archives } = await archivesRes.json();

        for (const archive of [...archives].reverse()) {
          const res = await fetch(archive);
          const data = await res.json();

          const game = data.games.find((g: any) => g.url.includes(gameId));

          if (game) {
            console.log("[WintrChess BG] Game found:", game);
            return game.pgn;
          }
        }

        return null;
      } catch (e) {
        console.error("[WintrChess BG] Fetch failed", e);
        return null;
      }
    }
    if (msg.type === "LOG") {
      console.log("[WintrChess Ext] ", ...msg.args);
    }
    if (msg.type === "WARN") {
      console.warn("[WintrChess Ext] ", ...msg.args);
    }
    if (msg.type === "ERR") {
      console.error("[WintrChess Ext] ", ...msg.args);
    }
  });
});
