#!/bin/bash
# Comprehensive production test

CUSTOM_DOMAIN="https://paint.toth.ink"
echo "🧪 Testing Production Site: $CUSTOM_DOMAIN"
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

# Test 2: Main JS file
echo "2. Testing main JS file..."
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

# Test 3: CSS file
echo "3. Testing CSS file..."
CSS_FILE=$(echo "$HTML" | grep -o 'href="[^"]*index-[^"]*\.css"' | head -1 | sed 's/href="//;s/"//')
if [ -n "$CSS_FILE" ]; then
  CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CUSTOM_DOMAIN$CSS_FILE")
  if [ "$CSS_STATUS" = "200" ]; then
    echo "   ✅ CSS file accessible: $CSS_FILE"
  else
    echo "   ❌ CSS file failed (status: $CSS_STATUS)"
  fi
fi

# Test 4: Config file
echo "4. Testing config file..."
CONFIG_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CUSTOM_DOMAIN/config/site.config.json")
if [ "$CONFIG_STATUS" = "200" ]; then
  echo "   ✅ Config accessible"
else
  echo "   ⚠️  Config status: $CONFIG_STATUS"
fi

# Test 5: Video file
echo "5. Testing video file..."
VIDEO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CUSTOM_DOMAIN/img/blonde-color.mp4" -r 0-100)
if [ "$VIDEO_STATUS" = "200" ] || [ "$VIDEO_STATUS" = "206" ]; then
  echo "   ✅ Video accessible"
else
  echo "   ⚠️  Video status: $VIDEO_STATUS"
fi

# Test 6: Response time
echo "6. Testing response time..."
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$CUSTOM_DOMAIN")
echo "   Response time: ${RESPONSE_TIME}s"

echo ""
echo "✅ Production test complete"
