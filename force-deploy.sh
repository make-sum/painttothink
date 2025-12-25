#!/bin/bash
# Force deployment by creating a new deployment with cache-busting

export CLOUDFLARE_API_TOKEN="GMgEjvb0kpPkJpnlH4gxGp8m7uCeSc7Zxlag15I4"
ACCOUNT_ID="7d84a4241cd92238463580dd0e094bc7"
PROJECT_NAME="paint"

echo "🚀 Force deploying to Cloudflare Pages..."
npm run build

echo ""
echo "📤 Uploading..."
node deploy-pages-complete.js

echo ""
echo "⏳ Waiting 30 seconds..."
sleep 30

echo ""
echo "✅ Deployment complete"
