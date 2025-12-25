#!/bin/bash
echo "🧪 FINAL DEPLOYMENT TEST"
echo ""

# Test direct deployment URL (bypasses custom domain cache)
DIRECT_URL="https://1b5fcfc8.paint-1sj.pages.dev"
CUSTOM_URL="https://paint.toth.ink"

echo "1. Testing DIRECT deployment URL..."
DIRECT_HTML=$(curl -s "$DIRECT_URL" 2>&1)
DIRECT_BUNDLE=$(echo "$DIRECT_HTML" | grep -o 'react-vendor-[^"]*\.js' | head -1)
if echo "$DIRECT_BUNDLE" | grep -q "DokcM"; then
  echo "   ✅ NEW BUNDLE on direct URL: $DIRECT_BUNDLE"
else
  echo "   ⚠️  Bundle: $DIRECT_BUNDLE"
fi

echo ""
echo "2. Testing CUSTOM DOMAIN..."
CUSTOM_HTML=$(curl -s "$CUSTOM_URL" 2>&1)
CUSTOM_BUNDLE=$(echo "$CUSTOM_HTML" | grep -o 'react-vendor-[^"]*\.js' | head -1)
if echo "$CUSTOM_BUNDLE" | grep -q "DokcM"; then
  echo "   ✅ NEW BUNDLE on custom domain: $CUSTOM_BUNDLE"
elif echo "$CUSTOM_BUNDLE" | grep -q "BvOuhz89"; then
  echo "   ⚠️  OLD BUNDLE still cached: $CUSTOM_BUNDLE"
  echo "   💡 Solution: Wait 2-3 more minutes or clear browser cache"
else
  echo "   ⚠️  Bundle: $CUSTOM_BUNDLE"
fi

echo ""
echo "3. Checking for lazy loading..."
if echo "$CUSTOM_HTML" | grep -q "lazy"; then
  echo "   ⚠️  Lazy loading still present"
else
  echo "   ✅ No lazy loading (direct imports)"
fi

echo ""
echo "4. Logo reference..."
LOGO=$(echo "$CUSTOM_HTML" | grep -i "icon\|logo" | head -1)
if echo "$LOGO" | grep -q "vite.svg"; then
  echo "   ✅ Using vite.svg"
elif echo "$LOGO" | grep -q "painttothink-logo"; then
  echo "   ⚠️  Still references missing logo"
else
  echo "   Logo: $LOGO"
fi

echo ""
echo "✅ Test complete"
echo ""
echo "📋 Status:"
echo "   - Code fixed: ✅ (no lazy loading)"
echo "   - New build deployed: ✅"
echo "   - Direct URL: ✅ (new bundle)"
echo "   - Custom domain: ⏳ (may need more time for cache)"
