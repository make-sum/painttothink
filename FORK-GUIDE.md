# Fork & Deploy Guide

**Target: Fork → Customize → Deploy in under 1 hour**

This is a ready-to-fork SPA template. Follow this guide exactly to avoid the common pitfalls that waste hours.

---

## Quick Start (5 minutes)

```bash
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/YOUR_FORK.git
cd YOUR_FORK

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# Opens at http://localhost:5173
```

---

## Customize Content (10 minutes)

Edit `src/config/site.config.json`:

```json
{
  "site": {
    "name": "Your Company Name",
    "tagline": "Your Tagline",
    "email": "you@example.com",
    "phone": "(555) 123-4567"
  }
}
```

Or use the config editor: `http://localhost:5173?config=t`  
Password: `admin123`

---

## Deploy to Cloudflare Pages (15 minutes)

### Step 1: Create Cloudflare Pages Project

```bash
# Login to Cloudflare
npx wrangler login

# Create a new Pages project
npx wrangler pages project create YOUR_PROJECT_NAME
```

**⚠️ IMPORTANT:** Note the project name you choose. You'll need it for deployment.

### Step 2: Create KV Namespaces

```bash
# Site configuration storage
npx wrangler kv namespace create SITE_CONFIG
# Copy the ID from output

npx wrangler kv namespace create SITE_CONFIG --preview
# Copy the preview_id from output

# Fingerprint data storage (optional)
npx wrangler kv namespace create FINGERPRINT_DATA
# Copy the ID from output
```

### Step 3: Update wrangler.toml

Replace the KV namespace IDs with your new ones:

```toml
[[kv_namespaces]]
binding = "SITE_CONFIG"
id = "YOUR_NEW_ID_HERE"
preview_id = "YOUR_NEW_PREVIEW_ID_HERE"

[[kv_namespaces]]
binding = "FINGERPRINT_DATA"
id = "YOUR_NEW_FINGERPRINT_ID_HERE"
```

### Step 4: Build and Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=YOUR_PROJECT_NAME
```

### Step 5: Add Custom Domain (Optional)

In Cloudflare Dashboard:
1. Go to Pages > Your Project > Custom domains
2. Add your domain
3. Follow DNS setup instructions

---

## Common Pitfalls (READ THIS)

### ❌ Problem: API routes return HTML instead of JSON

**Cause:** The `public/_redirects` file has a catch-all rule `/* /index.html 200`

**Fix:** Only add specific SPA routes to `_redirects`, never a catch-all:
```
# CORRECT
/about /index.html 200
/contact /index.html 200

# WRONG - breaks API routes
/* /index.html 200
```

### ❌ Problem: Deploy fails with "Project not found"

**Cause:** Mismatch between `name` in wrangler.toml and actual project name

**Fix:** Use `--project-name` flag with your actual project name:
```bash
# Check your project name
npx wrangler pages project list

# Deploy with correct name
npx wrangler pages deploy dist --project-name=ACTUAL_PROJECT_NAME
```

### ❌ Problem: Config editor doesn't save

**Cause:** KV namespace IDs in wrangler.toml are from the original repo

**Fix:** Create your own KV namespaces and update the IDs (see Step 2-3 above)

### ❌ Problem: _routes.json confusion

**Remember:**
- `include` = paths that go to **Functions** (your API code)
- `exclude` = paths served as **static files**

For API functions to work:
```json
{
  "version": 1,
  "include": ["/api/*"],
  "exclude": []
}
```

### ❌ Problem: Created a _worker.js that blocks everything

**Cause:** A `functions/_worker.js` file intercepts all requests

**Fix:** Delete it. Use the `functions/api/` directory structure instead.

---

## File Structure

```
├── public/
│   ├── _redirects      # SPA routing (NO catch-all!)
│   ├── _routes.json    # API function routing
│   └── img/            # Static images
├── functions/
│   └── api/
│       ├── config/
│       │   └── [action].js   # GET/PUT config
│       └── fingerprint/
│           └── index.js      # POST fingerprints
├── src/
│   ├── config/
│   │   └── site.config.json  # Site content
│   ├── components/           # React components
│   └── pages/                # Page components
└── wrangler.toml             # CF Pages config
```

---

## Config Editor

Access: `https://your-domain.com?config=t`

Accepts: `?config=true`, `?config=t`, `?config=1`, or just `?config`

Password: `admin123` (change in wrangler.toml `CONFIG_PASSWORD`)

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/config/get` | GET | Get site configuration |
| `/api/config/update` | PUT | Update configuration (auth required) |
| `/api/fingerprint` | POST | Collect visitor fingerprint |
| `/api/fingerprint/list` | GET | List fingerprints (admin) |

---

## Tech Stack

- **React 18** + **Vite** - Fast builds
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Cloudflare Pages** - Edge hosting
- **Cloudflare KV** - Config storage

---

## Troubleshooting Deployment

```bash
# Check Pages project exists
npx wrangler pages project list

# Check KV namespaces exist
npx wrangler kv namespace list

# View deployment logs
npx wrangler pages deployment list --project-name=YOUR_PROJECT

# Test API locally
curl -X POST http://localhost:8788/api/fingerprint \
  -H "Content-Type: application/json" \
  -d '{"visitorId":"test"}'
```

---

## For AI Agents

When modifying this codebase:

1. **Never add** `/* /index.html 200` to `_redirects`
2. **Never create** `functions/_worker.js` - it blocks routing
3. **Check** `wrangler pages project list` for actual project name
4. **Test API** after any routing changes: `curl -X POST https://domain/api/fingerprint`
5. **Deploy with** `wrangler pages deploy dist --project-name=ACTUAL_NAME`

The routing system has three layers:
1. `_redirects` - SPA route rewrites (runs first)
2. `_routes.json` - Function vs static routing
3. `functions/api/` - Actual API code

If any layer is misconfigured, APIs break silently (return HTML or 405).

