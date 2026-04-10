export default defineBackground(() => {
  browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GET_PGN") {
      if (msg.gameType === "chesscom") {
        const { username, gameId } = msg;

        console.log("[WintrChess BG] Fetching PGN for", username, gameId);

        (async () => {
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
                sendResponse(game.pgn);
                return;
              }
            }

            sendResponse(null);
          } catch (e) {
            console.error("[WintrChess BG] Fetch failed", e);
            sendResponse(null);
          }
        })();
        return true;
      } else if (msg.gameType === "lichess") {
        const { gameId } = msg;

        console.log("[WintrChess BG] Fetching PGN for lichess game", gameId);

        (async () => {
          try {
            const gameRes = await fetch(`https://lichess.org/api/game/${gameId}`)
            const gameId_ = (await gameRes.json()).id as string;
            const res = await fetch(`https://lichess.org/game/export/${gameId_}`, {
              headers: {
                "Accept": "application/x-chess-pgn",
              },
            });

            if (!res.ok) {
              console.error("[WintrChess BG] Lichess fetch failed with status", res.status);
              sendResponse(null);
              return;
            }
            const pgn = await res.text();
            console.log("[WintrChess BG] PGN fetched successfully");
            console.log(pgn)
            sendResponse(pgn);
          } catch (e) {
            console.error("[WintrChess BG] Fetch failed", e);
            sendResponse(null);
          }
        })();
        return true;
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
