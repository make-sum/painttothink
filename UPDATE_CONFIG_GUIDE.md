# How to Update Site Content

## Current Issue
The config editor saves changes to browser localStorage only (not a database). To make permanent changes that all visitors see, you need to update the static config file and redeploy.

## Quick Fix - Update Static Config

1. Edit `painttothink/src/config/site.config.json` with your changes
2. Commit and push to GitHub
3. Cloudflare Pages will automatically redeploy

## Example Commands:
```bash
# Edit the config file
cd painttothink
# Make your changes to src/config/site.config.json

# Commit and push
git add src/config/site.config.json
git commit -m "Update site configuration"
git push origin main

# Or manually deploy
npm run build
npx wrangler pages deploy dist --project-name painttothink
```

## Long-term Solution: Server-Side Config Storage

To enable persistent config editing through the web interface, we need to implement:

### Option 1: Cloudflare KV Storage (Recommended)
- Use Cloudflare Workers KV for key-value storage
- Create API endpoints to read/write config
- Modify ConfigEditor to use API instead of localStorage

### Option 2: GitHub API Integration  
- Use GitHub API to update the config file directly
- Requires GitHub token/authentication
- Changes trigger automatic redeploy

### Option 3: Headless CMS
- Integrate with Strapi, Sanity, or similar
- Professional content management interface
- More complex but feature-rich

## Immediate Action
For now, update `src/config/site.config.json` directly and redeploy to make your changes live.
