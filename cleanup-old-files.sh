#!/bin/bash
# Clean up old deployment scripts and temporary files

echo "🧹 Cleaning up old files..."

# Remove old deployment scripts (keep only deploy-pages-complete.js)
rm -f deploy-direct-api.js
rm -f deploy-fix-assets.js
rm -f deploy-fix.js
rm -f deploy-pages-api-direct.js
rm -f deploy-pages-api.js
rm -f deploy-pages-direct.js
rm -f deploy-via-api-direct.js
rm -f deploy-via-api.js
rm -f deploy-via-curl.sh
rm -f redeploy-fresh.js
rm -f promote-deployment.js
rm -f setup-dns-api.js
rm -f setup-dns-with-mcp.js
rm -f setup-dns.sh
rm -f execute-dns-setup.sh
rm -f create-deployment-package.sh
rm -f force-cache-clear.sh
rm -f test-deployment.sh
rm -f final-verification.sh
rm -f verify-deployment-assets.js
rm -f verify-deployment-config.sh
rm -f deployment-package.zip
rm -f worker.js
rm -f wrangler.toml

# Remove old markdown documentation (keep only essential)
rm -f *-COMPLETE.md
rm -f *-STATUS.md
rm -f *-FIX*.md
rm -f *-SETUP*.md
rm -f *-DEPLOYMENT*.md
rm -f *-REVIEW.md
rm -f *-SUMMARY.md
rm -f *-SOLUTION.md
rm -f *-GUIDE.md
rm -f EXECUTE-NOW.md
rm -f FINAL-STATUS.md
rm -f QUICK-*.md
rm -f USE-*.md
rm -f get-api-token-instructions.txt

echo "✅ Cleanup complete"
