# Persistent Configuration System

## 🎉 What's New

Your config editor now saves to **Cloudflare KV storage** instead of just browser localStorage. This means:

✅ **Changes persist across all devices and visitors**  
✅ **Config survives browser cache clears**  
✅ **All visitors see the same updated content**  
✅ **No need to edit files and redeploy**  

## 🚀 Setup Instructions

### Step 1: Run the Setup Script

```bash
cd painttothink
./setup-kv.sh
```

This script will:
- Create KV namespaces in your Cloudflare account
- Update wrangler.toml with the namespace IDs
- Configure everything automatically

### Step 2: Deploy the Updated App

```bash
npm run build
npx wrangler pages deploy dist --project-name painttothink
```

## 📝 How to Use

1. **Access the Config Editor**
   - Go to: `https://your-site.pages.dev?config=true`
   - Enter password: `admin123`

2. **Edit Your Content**
   - Modify any site content in the JSON editor
   - Changes are validated before saving

3. **Save Changes**
   - Click "Save Configuration"
   - Changes are instantly saved to Cloudflare KV
   - All visitors immediately see the updates

## 🔧 Technical Details

### API Endpoints

- `GET /api/config/get` - Retrieves current configuration
- `PUT /api/config/update` - Updates configuration (requires auth)

### Data Flow

1. **Initial Load**: Tries API → Falls back to localStorage → Falls back to default
2. **Save**: Updates KV storage → Updates localStorage cache → Broadcasts to all tabs
3. **Security**: Password protected with Bearer token authentication

### Architecture

```
User Browser → Config Editor → API Function → Cloudflare KV
                    ↓              ↓
                localStorage   All Visitors
                  (cache)
```

## 🔐 Security

- Config editor requires password authentication
- API endpoints validate authorization header
- KV storage is only accessible through your Workers

## 🐛 Troubleshooting

### "Failed to save config"
- Check that KV namespaces were created
- Ensure you're using the correct password
- Check browser console for errors

### Changes not appearing
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check that deployment completed successfully
- Verify KV namespace bindings in Cloudflare dashboard

### KV namespace creation failed
1. Go to Cloudflare Dashboard → Workers & Pages → KV
2. Create namespace manually: "painttothinksite-config"
3. Copy the namespace ID
4. Update wrangler.toml with the ID

## 🎨 What You Can Edit

Everything in the site configuration:
- Site name, tagline, contact info
- Navigation menu items
- Service cards (titles, descriptions, images)
- About page content
- Theme colors and fonts
- And more...

## 🚨 Important Notes

- The default config in `site.config.json` is now only used as a fallback
- Changes through the web editor override the file config
- To reset to defaults, clear the KV storage value

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify KV namespaces exist in Cloudflare dashboard
3. Ensure the site is deployed with the latest changes
