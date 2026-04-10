# wintrchess-ext

Redirect chess.com or lichess.org game reviews (currently only from game finish page) to wintrchess.com

Disclaimer: This extension is not affiliated with chess.com, lichess.org or wintrchess.com. This extension, wintrchess.com or me (Anthony-Maxwell1) is not liable for any action taken against your chess.com account, however undetectable or unlikely it is.

Currently this is not available on any online extension store.

## Build it

Requirements:
- node/npm
- pnpm recommended but not necessary, especially if you are not a frequent npm user.
1. Clone the repository. `git clone https://github.com/Anthony-Maxwell1/wintrchess-ext.git`
2. Go to the repository. `cd wintrchess-ext`
3. Run `npm install` (`pnpm install` for pnpm)
<details>
<summary>Chrome (And chromium flavours)</summary>
1. Run `npm run build` (`pnpm run build` for pnpm)
2. Go to `chrome://extensions`
3. Toggle on the developer mode switch on the top right.
4. Click `Load Unpacked` near the top left of the page, and locate the repository. You should have hidden folders shown.
> [!INFO]
> To show hidden folders on windows. go to "Options" > "View" > "Show hidden files, folders, and drives" and turn it on. For macos, `Command + Shift + Dot`
5. Go to `.output` and select `chrome-mv3`.

Done!
</details>
## Popup

You need to enable the feature in the popup for redirects to work, and verbose logging is available in the popup.
