# Out of Frame

Static website for **Out of Frame**: independent wedding film & post-production studio, Springfield, TN.
Plain HTML/CSS/JS, no build step. Works on GitHub Pages, Netlify, Cloudflare Pages, or any host.

## Edit settings
Everything configurable lives in [`js/config.js`](js/config.js):

| Setting | What it does |
|---|---|
| `reel` | Highlight tiles (preview files in `video/`, plus where the full YouTube film starts when clicked) |
| `web3formsKey` | Web3Forms access key for the contact form (public by design). Recipient is set in the Web3Forms dashboard. Empty = form opens an email to Dan |
| `depositUrl` | Stripe **Payment Link** for deposits. Empty = button becomes "Call To Reserve" |

## Run locally
```
python -m http.server 8000
```
Then open http://localhost:8000.

## Deploy (GitHub Pages)
Repo Settings → Pages → Deploy from branch `main` / root.

## Video files
`video/hero.mp4` is the hero loop (film clips 0:05-0:10, 2:01-2:06, 4:05-4:10, 5:55-6:00). The full 1080p source is git-ignored (too large for GitHub).
