# Paint To Think Component Library

A modern, reusable, and highly performant React component library built for blazing-fast web applications.

## 🏗️ **Architecture Overview**

This component library follows a **modular, composable architecture** with:
- **JSON-driven configuration** for maximum flexibility
- **Framework-agnostic patterns** for future portability  
- **Performance-first design** with code splitting and lazy loading
- **Theme-aware components** with instant dark/light mode switching
- **Responsive-by-default** mobile-first approach

## 🎯 **Core Principles**

### 1. **Unbound & Configurable**
- All components accept configuration via props or JSON
- No hardcoded values - everything is customizable
- Data and styling completely separated

### 2. **Composable & Reusable**
- Each component has a single responsibility
- Components can be nested and combined
- Consistent API patterns across all components

### 3. **Performance Optimized**
- Lazy loading for non-critical components
- Optimized animations with `will-change`
- Minimal bundle impact with code splitting

### 4. **Mobile-First Responsive**
- All components work on any screen size
- Touch-friendly interactions
- Adaptive layouts (bottom nav → sidebar)

## 📦 **Component Categories**

### **Navigation Components**
- [`Navigation`](#navigation) - Adaptive nav bar/sidebar
- [`ThemeToggle`](#themetoggle) - Dark/light mode switcher

### **Layout Components**
- [`BottomSheet`](#bottomsheet) - Modal/drawer with swipe gestures
- [`ServiceCard`](#servicecard) - Interactive content cards
- [`ProgressLoader`](#progressloader) - Animated logo progress indicator

### **Utility Components**
- [`ConfigEditor`](#configeditor) - Live JSON configuration editor

### **Hooks & Utilities**
- [`useConfig`](#useconfig) - Dynamic configuration loading
- [`useScrollDirection`](#usescrolldirection) - Scroll-aware UI
- [`useMediaQuery`](#usemediaquery) - Responsive breakpoints

## 🚀 **Getting Started**

### Quick Start
```bash
# Navigate to component library
cd painttothink

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Adding New Components
```bash
# Create component file
touch src/components/YourComponent.jsx

# Add to exports (if needed)
# Update src/config/site.config.json for configuration
```

## 🎨 **Styling System**

### **Tailwind CSS Classes**
- `font-geist` - Primary typography
- `bg-background/80` - Themed backgrounds with transparency
- `backdrop-blur-lg` - Modern glass morphism effects
- `will-change-transform` - Performance-optimized animations

### **CSS Custom Properties**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 6.67%;
  --muted: 0 0% 96.67%;
  --muted-foreground: 0 0% 40%;
}

.dark {
  --background: 0 0% 6.67%;
  --foreground: 0 0% 100%;
  --muted: 0 0% 13.33%;
  --muted-foreground: 0 0% 60%;
}
```

## 📱 **Responsive Design System**

### **Breakpoints**
- **Mobile**: < 768px (portrait orientation)
- **Desktop**: ≥ 768px (landscape orientation)

### **Adaptive Navigation**
```javascript
const orientation = useOrientation()
// Returns 'portrait' or 'landscape'

// Navigation adapts automatically:
// Portrait: Bottom navigation bar
// Landscape: Left sidebar navigation
```

## ⚡ **Performance Features**

### **Code Splitting**
```javascript
// Automatic vendor chunks
'react-vendor': ['react', 'react-dom'],
'router': ['react-router-dom'],
'animation': ['framer-motion'],
'icons': ['lucide-react']
```

### **Lazy Loading**
```javascript
const ConfigEditor = lazy(() => 
  import('./components/ConfigEditor')
    .then(module => ({ default: module.ConfigEditor }))
)
```

### **Font Optimization**
- Preloaded critical fonts (Regular, SemiBold)
- `font-display: swap` for instant text rendering
- WOFF2 format for maximum compression

## 🔧 **Configuration System**

### **JSON Configuration**
All site content is driven by `src/config/site.config.json`:

```json
{
  "site": {
    "name": "Your Site",
    "tagline": "Your tagline",
    "email": "contact@yoursite.com"
  },
  "navigation": {
    "main": [
      { "label": "Home", "href": "/", "icon": "home" }
    ]
  },
  "services": [
    {
      "id": "service-1",
      "title": "Service Name",
      "description": "Service description", 
      "image": "/img/service.jpg",
      "details": "Detailed service information"
    },
    {
      "id": "service-2",
      "title": "Another Service",
      "description": "Another description",
      "image": "/img/service2.jpg", 
      "details": "More detailed information"
    }
  ]
}
```

### **Dynamic Configuration Loading**
```javascript
import { useConfig } from '../hooks/useConfig'

function YourComponent() {
  const siteConfig = useConfig() // Loads from localStorage or default
  return <div>{siteConfig.site.name}</div>
}
```

### **Browser-Only Config Editing**
- Visit `?config=true` (password: `admin123`)
- Edit JSON configuration in browser
- Changes apply instantly across all components
- No file system access needed

## 🎭 **Theme System**

### **Instant Theme Switching**
```javascript
import { useTheme } from '../contexts/ThemeContext'

function YourComponent() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

### **Theme Detection**
- Automatic system preference detection
- Instant loading (no flash of unstyled content)
- Persistent across sessions

## 🧪 **Testing Strategy**

### **Component Testing**
- Real UX/UI testing required before completion
- No mock data or simulations allowed
- Playwright tests for all new features

### **Performance Testing**
- Lighthouse scores: 90+ across all metrics
- Load time targets: < 1s First Contentful Paint
- Bundle size monitoring

## 🚀 **Deployment**

### **Cloudflare Pages**
```bash
# Build and deploy
npm run build
npx wrangler pages deploy dist --project-name painttothink

# Automatic deployment via GitHub
git push origin main  # Triggers auto-deploy
```

### **Performance Optimizations Active**
- HTTP/3 protocol
- Brotli compression
- Edge caching (1 year for assets)
- CDN delivery worldwide

## 📖 **API Reference**

See individual component documentation:
- [Navigation Component](./docs/components/Navigation.md)
- [BottomSheet Component](./docs/components/BottomSheet.md)
- [ServiceCard Component](./docs/components/ServiceCard.md)
- [ConfigEditor Component](./docs/components/ConfigEditor.md)
- [ProgressLoader Component](./docs/components/ProgressLoader.md)

## 🤝 **Contributing**

1. **Follow the established patterns** in existing components
2. **Add comprehensive JSDoc comments** for all props
3. **Write Playwright tests** before marking complete
4. **Update configuration schema** if adding new config options
5. **Test on both mobile and desktop** orientations

## 📊 **Performance Metrics**

Current performance benchmarks:
- **First Contentful Paint**: < 800ms
- **Largest Contentful Paint**: < 1.2s  
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 1.5s
- **Bundle Size**: 45KB gzipped (main chunk)

---

**Live Demo**: https://a2221375.painttothink.pages.dev
**Config Editor**: https://a2221375.painttothink.pages.dev?config=true
