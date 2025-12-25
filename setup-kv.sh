#!/bin/bash

echo "🚀 Setting up Cloudflare KV namespace for Paint To Think config storage"
echo ""

# Check if wrangler is logged in
if ! npx wrangler whoami &> /dev/null; then
    echo "❌ You need to login to Cloudflare first"
    echo "Running: npx wrangler login"
    npx wrangler login
fi

echo "Creating KV namespaces..."

# Create production namespace
echo "Creating production KV namespace..."
PROD_NAMESPACE_ID=$(npx wrangler kv:namespace create "SITE_CONFIG" --preview false 2>&1 | grep -oE 'id = "[^"]+"' | cut -d'"' -f2)

# Create preview namespace
echo "Creating preview KV namespace..."
PREVIEW_NAMESPACE_ID=$(npx wrangler kv:namespace create "SITE_CONFIG" --preview 2>&1 | grep -oE 'id = "[^"]+"' | cut -d'"' -f2)

if [ -z "$PROD_NAMESPACE_ID" ] || [ -z "$PREVIEW_NAMESPACE_ID" ]; then
    echo "❌ Failed to create KV namespaces"
    echo "You may need to create them manually in the Cloudflare dashboard"
    exit 1
fi

echo ""
echo "✅ KV namespaces created successfully!"
echo ""
echo "Production namespace ID: $PROD_NAMESPACE_ID"
echo "Preview namespace ID: $PREVIEW_NAMESPACE_ID"
echo ""

# Update wrangler.toml with the actual IDs
echo "Updating wrangler.toml with namespace IDs..."
sed -i.bak "s/YOUR_KV_NAMESPACE_ID/$PROD_NAMESPACE_ID/g" wrangler.toml
sed -i.bak "s/YOUR_KV_PREVIEW_ID/$PREVIEW_NAMESPACE_ID/g" wrangler.toml
rm wrangler.toml.bak

echo "✅ wrangler.toml updated!"
echo ""
echo "🎉 Setup complete! Your config persistence is ready to use."
echo ""
echo "Next steps:"
echo "1. Deploy the updated app: npm run build && npx wrangler pages deploy dist --project-name painttothink"
echo "2. Test the config editor at: https://your-site.pages.dev?config=true"
echo "3. Changes will now persist in Cloudflare KV storage!"
