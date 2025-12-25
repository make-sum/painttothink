# Deployment Guide

Detailed guide for deploying to Cloudflare Pages. For quick start, see [FORK-GUIDE.md](../FORK-GUIDE.md).

---

## Prerequisites

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

---

## Deploy Commands

```bash
# Build the application
npm run build

# Deploy to Cloudflare Pages
# ⚠️ Use YOUR actual project name from: wrangler pages project list
wrangler pages deploy dist --project-name=YOUR_PROJECT_NAME
```

---

## KV Namespace Setup

Required for config editor and fingerprint APIs to work:

```bash
# Create namespaces
wrangler kv namespace create SITE_CONFIG
wrangler kv namespace create SITE_CONFIG --preview
wrangler kv namespace create FINGERPRINT_DATA

# Update wrangler.toml with the IDs from output
```

---

## Project Structure for Deployment

```
dist/                    # Build output (deployed)
├── index.html
├── assets/              # JS/CSS bundles
├── _redirects           # SPA routing rules
└── _routes.json         # API function routing

functions/               # Cloudflare Pages Functions
└── api/
    ├── config/
    │   └── [action].js  # /api/config/get, /api/config/update
    └── fingerprint/
        ├── index.js     # POST /api/fingerprint
        └── list.js      # GET /api/fingerprint/list
```

---

## Routing Configuration

### `public/_routes.json`
Controls which paths go to Functions vs static files:

```json
{
  "version": 1,
  "include": ["/api/*"],
  "exclude": []
}
```

### `public/_redirects`
SPA route rewrites. **Never add a catch-all `/* /index.html 200`** - it breaks API routes.

```
/about /index.html 200
/services /index.html 200
/contact /index.html 200
```

---

## Environment Variables

Set in `wrangler.toml` or Cloudflare Dashboard:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `CONFIG_PASSWORD` | Config editor password | `admin123` |

---

## Custom Domain Setup

1. Cloudflare Dashboard → Pages → Your Project
2. Custom domains → Add
3. Enter your domain (e.g., `paint.toth.ink`)
4. Add DNS record as shown

---

## Verification

After deployment:

```bash
# Check site loads
curl -s https://YOUR_DOMAIN/ | head -5

# Check API works
curl -X POST https://YOUR_DOMAIN/api/fingerprint \
  -H "Content-Type: application/json" \
  -d '{"visitorId":"test"}'
# Should return: {"success":true,"visitorId":"test"}

# Check config API
curl https://YOUR_DOMAIN/api/config/get
# Should return JSON config, not HTML
```

---

## Troubleshooting

### API returns HTML instead of JSON
- Check `_redirects` doesn't have catch-all rule
- Check `_routes.json` has `"include": ["/api/*"]`
- Verify no `functions/_worker.js` file exists

### "Project not found" error
```bash
# Check actual project name
wrangler pages project list

# Deploy with correct name
wrangler pages deploy dist --project-name=ACTUAL_NAME
```

### Config editor doesn't save
- Verify KV namespaces exist: `wrangler kv namespace list`
- Update `wrangler.toml` with correct namespace IDs

---

## Deployment Checklist

- [ ] `npm run build` succeeds
- [ ] `_redirects` has no catch-all
- [ ] `_routes.json` includes `/api/*`
- [ ] KV namespace IDs are correct in `wrangler.toml`
- [ ] Using correct `--project-name` flag

---

See [FORK-GUIDE.md](../FORK-GUIDE.md) for complete setup walkthrough.
