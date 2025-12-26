# Ready-to-Fork SPA Template

A production-ready Single Page Application template built for **Cloudflare Pages**. Fork, customize, deploy in under 1 hour.

**[→ FORK GUIDE](FORK-GUIDE.md)** - Start here for step-by-step deployment

---

## Features

- ⚡ **React 18 + Vite** - Fast development and builds
- 🎨 **Tailwind CSS** - Utility-first styling
- ✨ **Framer Motion** - Smooth animations
- 🌙 **Dark/Light Mode** - Intelligent theme detection with priority-based system
- 📱 **Responsive** - Mobile-first design
- 🔧 **Config Editor** - Live site customization (`?config=t`)
- 🌍 **i18n Ready** - Multi-language support (EN/RU/UK)
- 🔒 **Cloudflare KV** - Persistent configuration storage
- 📊 **Fingerprinting** - Visitor analytics integration

---

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:5173
```

Edit content: `src/config/site.config.json`  
Or use editor: `http://localhost:5173?config=t` (password: `admin123`)

---

## Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=YOUR_PROJECT
```

**⚠️ First time?** Read [FORK-GUIDE.md](FORK-GUIDE.md) for KV setup and common pitfalls.

---

## Project Structure

```
├── public/
│   ├── _redirects      # SPA routes (⚠️ no catch-all!)
│   ├── _routes.json    # API routing config
│   └── img/            # Static assets
├── functions/api/      # Cloudflare Pages Functions
│   ├── config/         # Config CRUD API
│   └── fingerprint/    # Analytics API
├── src/
│   ├── components/     # React components
│   ├── config/         # Site configuration
│   ├── pages/          # Page components
│   └── hooks/          # Custom hooks
└── wrangler.toml       # Cloudflare config
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/config/get` | GET | Get site config |
| `/api/config/update` | PUT | Update config (auth) |
| `/api/fingerprint` | POST | Collect analytics |

---

## Configuration

### Site Content
Edit `src/config/site.config.json` or use the visual editor.

### Theme System

The application features an intelligent theme detection system with the following priority:

1. **Previous Visit Preference** (localStorage) - User's explicit theme choice
2. **Browser/Device Preference** - Respects OS-level theme settings (e.g., macOS Dark Mode)
3. **Default to Light Mode** - New visitors see light mode by default

The theme is applied instantly via inline script in `index.html` to prevent flash of unstyled content (FOUC).

**Theme Colors**
Edit CSS variables in `src/index.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 6.67%;
  --accent: 217 91% 60%;
}

.dark {
  --background: 0 0% 6.67%;
  --foreground: 0 0% 100%;
}
```

**Theme Toggle**
Users can manually toggle themes using the theme toggle button in the navigation. This preference is saved to localStorage and persists across sessions.

### Config Editor Access
- URL: `https://your-site.com?config=t`
- Password: Set `CONFIG_PASSWORD` in `wrangler.toml`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Build | Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| UI | Radix UI |
| Hosting | Cloudflare Pages |
| Storage | Cloudflare KV |

---

## Common Issues

See [FORK-GUIDE.md](FORK-GUIDE.md#common-pitfalls-read-this) for solutions to:

- API routes returning HTML
- Deploy "Project not found" errors
- Config editor not saving
- Routing configuration issues

---

## Documentation

- **[FORK-GUIDE.md](FORK-GUIDE.md)** - Deployment walkthrough
- **[docs/DEPLOYMENT-GUIDE.md](docs/DEPLOYMENT-GUIDE.md)** - Detailed deployment
- **[docs/DEVELOPMENT-GUIDE.md](docs/DEVELOPMENT-GUIDE.md)** - Development setup
- **[docs/COMPONENT-CREATION-GUIDE.md](docs/COMPONENT-CREATION-GUIDE.md)** - Adding components

---

## License

MIT
