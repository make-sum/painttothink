# Paint To Think - Modern SWA

A modern, responsive Single Web Application (SWA) for Paint To Think construction company, built with React, Vite, and Tailwind CSS.

## Features

✅ **Single Web App Architecture**
- Home page with service cards
- About page opens as bottom sheet with slide-up animation
- Swipeable on mobile, closeable with X on desktop

✅ **Responsive Navigation**
- Mobile: Bottom navigation bar (portrait mode)
- Desktop: Left sidebar navigation (landscape mode)
- Auto-hides on scroll down, shows on scroll up

✅ **Modern UI/UX**
- Smooth animations with Framer Motion
- Image hover effects with scale transitions
- Rounded corners and modern design
- Dark/Light mode with system detection
- Geist font typography

✅ **Performance Optimized**
- Vite for fast builds and HMR
- Lazy loading and code splitting
- Optimized images and fonts
- Tailwind CSS for minimal CSS bundle

✅ **Configurable**
- JSON-based configuration
- Hidden config editor (access via `?config=true`)
- Password protected (default: `admin123`)
- Live configuration updates

✅ **Reusable Components**
- ServiceCard - Image blocks with hover effects
- BottomSheet - Modal/drawer component
- Navigation - Responsive nav bar/sidebar
- ThemeToggle - Dark/light mode switcher
- ConfigEditor - JSON configuration editor

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **UI Components**: Radix UI
- **Deployment**: Cloudflare Pages Ready

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Configuration

1. Edit `src/config/site.config.json` for site content
2. Or use the config editor: navigate to `http://localhost:5173?config=true`
3. Enter password: `admin123`
4. Edit and save configuration

### Deployment to Cloudflare Pages

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy:
```bash
npm run deploy
```

Or use Cloudflare Pages dashboard:
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

## Project Structure

```
painttothink/
├── public/
│   ├── fonts/          # Geist font files
│   └── img/            # Site images
├── src/
│   ├── components/     # Reusable components
│   ├── config/         # JSON configuration
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities
│   ├── pages/          # Page components
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── functions/          # Cloudflare Pages Functions
├── deploy-*.js        # Deployment scripts
├── *.sh               # Shell scripts
└── package.json
```

## Customization

### Theme Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 6.67%;
  --muted: 0 0% 96.67%;
  --muted-foreground: 0 0% 40%;
}
```

### Site Content
Update `src/config/site.config.json` with your content:
- Site information
- Navigation items
- Services
- About content
- Contact details

### Adding Pages
1. Create new page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation in config

## Modern Web Editor Research

For future enhancements, consider these modern, framework-agnostic editors:

1. **Builder.io** - Visual drag-and-drop, JSON output
2. **Plasmic** - Code-optional web builder
3. **Webflow** - No-code visual development
4. **Strapi** - Headless CMS with visual editor
5. **Sanity.io** - Structured content platform
6. **TinaCMS** - Git-based content management
7. **Stackbit** - Visual editor for Jamstack

## License

© 2024 Paint To Think. All rights reserved.
