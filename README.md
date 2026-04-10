# wintrchess-ext

Redirect chess.com game reviews (currently only from game finish page) to wintrchess.com

Disclaimer: This extension is not affiliated with chess.com or wintrchess.com. This extension, wintrchess.com or me (Anthony-Maxwell1) is not liable for any action taken against your chess.com account, however undetectable or unlikely it is.

Currently this is not available on any online extension store.

## Build it

Clone and go to the root of the repository. Make sure you have pnpm or npm installed, however npm on it's own should work (although not tested).
`pnpm install`/`npm install`
`pnpm run build`/`npm run build` or for firefox `pnpm run build:firefox`/`npm run build:firefox`
For firefox, package it up, on linux you use cd .output/firefox-mv2 && zip -r ../extension.xpi . and load it in about:debugging#/runtime/this-firefox as a temporary extension. If you're on windows, sucks to be you use chatgpt lol
Chrome lets you load it in as a folder .output/chrome-mv3
I'll work on getting this on online extension stores soon.

## Popup

You need to enable the feature in the popup for redirects to work, and verbose logging is available in the popup.
