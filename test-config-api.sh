#!/bin/bash

echo "🧪 Testing Persistent Config API"
echo ""

# Test URLs
PROD_URL="https://da8cfb39.painttothink.pages.dev"
ALIAS_URL="https://main.painttothink.pages.dev"

echo "1️⃣ Testing GET /api/config/get"
echo "Response from production URL:"
curl -s "$PROD_URL/api/config/get" | jq '.site.name' || echo "Failed to get config"

echo ""
echo "2️⃣ Testing unauthorized UPDATE"
curl -s -X PUT "$PROD_URL/api/config/update" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' | jq '.' || echo "Request failed"

echo ""
echo "3️⃣ Testing authorized UPDATE"
TEST_CONFIG='{
  "site": {
    "name": "Paint To Think - Updated via API",
    "tagline": "Commercial & Residential Construction",
    "tag": "Portland, Oregon",
    "description": "Commercial and residential construction company based in Portland, Oregon with over 30 years of experience",
    "email": "info@painttothinkdesigns.com",
    "phone": "(503) 998-9294",
    "address": "Portland, Oregon",
    "copyright": "© Paint To Think, 2000"
  },
  "navigation": {
    "main": [
      {"label": "Home", "href": "/", "icon": "home"},
      {"label": "About", "href": "/about", "icon": "info"},
      {"label": "Services", "href": "/services", "icon": "briefcase"},
      {"label": "Contact", "href": "/contact", "icon": "mail"}
    ]
  },
  "services": [],
  "about": {
    "content": "Updated via API test",
    "experience": "30+ years",
    "projects": "500+"
  }
}'

echo "Updating config with authorization..."
curl -s -X PUT "$PROD_URL/api/config/update" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d "$TEST_CONFIG" | jq '.' || echo "Update failed"

echo ""
echo "4️⃣ Verifying update worked"
curl -s "$PROD_URL/api/config/get" | jq '.site.name' || echo "Failed to verify"

echo ""
echo "✅ Test complete!"
echo ""
echo "Visit the config editor to see the changes:"
echo "$PROD_URL?config=true"
echo "Password: admin123"
