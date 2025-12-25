#!/bin/bash
CUSTOM_URL="https://paint.toth.ink"
DIRECT_URL=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/7d84a4241cd92238463580dd0e094bc7/pages/projects/paint/deployments" -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" | jq -r '.result[0].url' 2>/dev/null)

echo "🧪 FINAL DEPLOYMENT TEST (Unminified Build)"
echo ""

echo "1. Testing DIRECT deployment URL..."
DIRECT_HTML=$(curl -s "$DIRECT_URL" 2>&1)
DIRECT_BUNDLE=$(echo "$DIRECT_HTML" | grep -o 'react-vendor-[^"]*\.js' | head -1)
DIRECT_CSS=$(echo "$DIRECT_HTML" | grep -o 'index-[^"]*\.css' | head -1)
if echo "$DIRECT_BUNDLE" | grep -q "DokcM\|r6djJ"; then
  echo "   ✅ NEW BUNDLE: $DIRECT_BUNDLE"
else
  echo "   ⚠️  Bundle: $DIRECT_BUNDLE"
fi
echo "   CSS: $DIRECT_CSS"

echo ""
echo "2. Testing CUSTOM DOMAIN..."
CUSTOM_HTML=$(curl -s "$CUSTOM_URL" 2>&1)
CUSTOM_BUNDLE=$(echo "$CUSTOM_HTML" | grep -o 'react-vendor-[^"]*\.js' | head -1)
CUSTOM_CSS=$(echo "$CUSTOM_HTML" | grep -o 'index-[^"]*\.css' | head -1)
if echo "$CUSTOM_BUNDLE" | grep -q "DokcM\|r6djJ"; then
  echo "   ✅ NEW BUNDLE: $CUSTOM_BUNDLE"
elif echo "$CUSTOM_BUNDLE" | grep -q "BvOuhz89"; then
  echo "   ⚠️  OLD BUNDLE (cached): $CUSTOM_BUNDLE"
  echo "   💡 Need to wait longer or clear browser cache"
else
  echo "   ⚠️  Bundle: $CUSTOM_BUNDLE"
fi
echo "   CSS: $CUSTOM_CSS"

echo ""
echo "3. Checking minification..."
if echo "$CUSTOM_HTML" | grep -q "minify.*false\|sourcemap.*true"; then
  echo "   ✅ Unminified build detected"
else
  echo "   ⚠️  May still be minified"
fi

echo ""
echo "4. Testing CSS file..."
if [ -n "$CUSTOM_CSS" ]; then
  CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CUSTOM_URL/assets/$CUSTOM_CSS")
  if [ "$CSS_STATUS" = "200" ]; then
    echo "   ✅ CSS accessible"
  else
    echo "   ❌ CSS 404 (status: $CSS_STATUS)"
  fi
fi

echo ""
echo "✅ Test complete"
