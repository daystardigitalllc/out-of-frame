# Out of Frame

Static website for **Out of Frame** — independent wedding film & post-production studio, Springfield, TN.
Plain HTML/CSS/JS, no build step. Works on GitHub Pages, Netlify, Cloudflare Pages, or any host.

## Edit settings
Everything configurable lives in [`js/config.js`](js/config.js):

| Setting | What it does |
|---|---|
| `heroSegments` / `reel` | Timestamps (seconds) from the YouTube film used for the hero loop and highlight tiles |
| `formspreeId` | Free form id from formspree.io → inquiries email straight to Dan. Empty = form opens an email to Dan@outofframemedia.com |
| `depositUrl` | Stripe **Payment Link** for deposits. Empty = button becomes "Call To Reserve" |

## Run locally
```
python -m http.server 8000
```
Then open http://localhost:8000.

## Deploy (GitHub Pages)
Repo Settings → Pages → Deploy from branch `main` / root.
