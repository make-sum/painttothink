#!/bin/bash
# Comprehensive deployment test

CUSTOM_DOMAIN="https://paint.toth.ink"
echo "🧪 Testing Production Deployment: $CUSTOM_DOMAIN"
echo ""

# Test 1: HTML loads
echo "1. Testing HTML..."
HTML=$(curl -s "$CUSTOM_DOMAIN" 2>&1)
if echo "$HTML" | grep -q "root"; then
  echo "   ✅ HTML loads"
else
  echo "   ❌ HTML failed"
  exit 1
fi

# Test 2: Check for new bundle (not old BvOuhz89)
echo "2. Testing bundle version..."
OLD_BUNDLE=$(echo "$HTML" | grep -o 'react-vendor-BvOuhz89\.js')
NEW_BUNDLE=$(echo "$HTML" | grep -o 'react-vendor-[^"]*\.js' | head -1)
if [ -n "$OLD_BUNDLE" ]; then
  echo "   ⚠️  OLD BUNDLE DETECTED: $OLD_BUNDLE"
  echo "   ⚠️  Cache may not be cleared yet"
elif [ -n "$NEW_BUNDLE" ]; then
  echo "   ✅ New bundle: $NEW_BUNDLE"
else
  echo "   ⚠️  Could not detect bundle"
fi

# Test 3: Main JS file
echo "3. Testing main JS file..."
JS_FILE=$(echo "$HTML" | grep -o 'src="[^"]*index-[^"]*\.js"' | head -1 | sed 's/src="//;s/"//')
if [ -n "$JS_FILE" ]; then
  JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CUSTOM_DOMAIN$JS_FILE")
  if [ "$JS_STATUS" = "200" ]; then
    echo "   ✅ JS file accessible: $JS_FILE"
  else
    echo "   ❌ JS file failed: $JS_FILE (status: $JS_STATUS)"
  fi
else
  echo "   ❌ JS file not found in HTML"
fi

# Test 4: Logo file
echo "4. Testing logo file..."
LOGO_REF=$(echo "$HTML" | grep -o 'href="[^"]*logo[^"]*"' | head -1)
if [ -n "$LOGO_REF" ]; then
  echo "   Logo reference: $LOGO_REF"
  if echo "$LOGO_REF" | grep -q "vite.svg"; then
    echo "   ✅ Using vite.svg (correct)"
  else
    echo "   ⚠️  May reference missing logo"
  fi
fi

# Test 5: Response time
echo "5. Testing response time..."
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$CUSTOM_DOMAIN")
echo "   Response time: ${RESPONSE_TIME}s"

# Test 6: Check for React errors in console (basic check)
echo "6. Testing for common issues..."
if echo "$HTML" | grep -q "lazy"; then
  echo "   ⚠️  Lazy loading detected in HTML (may cause issues)"
else
  echo "   ✅ No lazy loading in HTML"
fi

echo ""
echo "✅ Deployment test complete"
echo ""
echo "📋 Next steps:"
echo "   - Hard refresh browser (Cmd+Shift+R)"
echo "   - Check browser console for errors"
echo "   - Verify React Error #130 is gone"
