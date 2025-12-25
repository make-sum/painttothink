# Development Guide - Paint To Think Component Library

## 🎯 **Development Workflow**

### **Starting Development**
```bash
# 1. Navigate to project
cd painttothink

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open browser
open http://localhost:5173
```

### **Making Changes**
```bash
# 1. Create/edit components in src/components/
# 2. Update configuration in src/config/site.config.json
# 3. Test in browser (auto-reloads)
# 4. Use config editor for live testing: ?config=true
```

### **Deployment Process**
```bash
# 1. Build optimized version
npm run build

# 2. Deploy to Cloudflare Pages
# ⚠️ Use YOUR project name from: wrangler pages project list
wrangler pages deploy dist --project-name=YOUR_PROJECT_NAME

# 3. Commit changes
git add -A && git commit -m "Your changes"
git push origin main
```

## 🧩 **Creating New Components**

### **Component Template**
```javascript
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

/**
 * YourComponent - Brief description
 * 
 * @param {Object} props - Component properties
 * @param {string} props.title - Component title
 * @param {boolean} props.isVisible - Visibility state
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
export function YourComponent({ 
  title, 
  isVisible = true, 
  onClick, 
  className 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.6, 0.2, 1] }}
      className={cn(
        "base-styles-here",
        "responsive-classes",
        className
      )}
      onClick={onClick}
    >
      <h3 className="text-xl font-medium">{title}</h3>
    </motion.div>
  )
}
```

### **Required Component Features**
1. **JSDoc comments** - Document all props and usage
2. **Motion animations** - Use Framer Motion for smooth interactions
3. **Responsive design** - Work on all screen sizes
4. **Theme awareness** - Use CSS custom properties
5. **Performance optimization** - Include `will-change` for animations

## 🎨 **Styling Guidelines**

### **CSS Class Naming**
```javascript
// ✅ Good - Semantic and descriptive
className="navigation-container"
className="service-card-image"
className="theme-toggle-button"

// ❌ Avoid - Generic or unclear
className="container"
className="box"
className="button"
```

### **Responsive Patterns**
```javascript
// Use orientation-based responsive design
const orientation = useOrientation()

className={cn(
  "base-styles",
  orientation === 'portrait' 
    ? "mobile-styles bottom-4 rounded-2xl" 
    : "desktop-styles left-4 rounded-2xl"
)}
```

### **Animation Standards**
```javascript
// Consistent easing and timing
transition={{ 
  duration: 0.6, 
  ease: [0.2, 0.6, 0.2, 1] 
}}

// Performance optimization
className="will-change-transform"
```

## 🔧 **Configuration Patterns**

### **Adding Configurable Options**
1. **Add to site.config.json**:
```json
{
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
      "description": "Another service description",
      "image": "/img/service2.jpg",
      "details": "More detailed information"
    }
  ]
}
```

2. **Use in component**:
```javascript
import { useConfig } from '../hooks/useConfig'

function YourComponent() {
  const config = useConfig()
  const componentConfig = config.yourComponent
  
  return (
    <div>
      {componentConfig.enabled && (
        <h1>{componentConfig.title}</h1>
      )}
    </div>
  )
}
```

## 🧪 **Testing Requirements**

### **Before Marking Complete**
Following .cursorrules requirements:

1. **Write Playwright tests** for new features
2. **Test real UX/UI** - no simulations
3. **Build and test** before status changes
4. **Validate compliance** with project rules

### **Test Checklist**
- [ ] Component renders correctly
- [ ] Responsive behavior works
- [ ] Animations are smooth
- [ ] Dark/light mode compatibility
- [ ] Configuration changes apply
- [ ] No console errors
- [ ] Performance metrics maintained

## 🎯 **Component Standards**

### **Required Props Interface**
```javascript
// Every component should accept:
{
  className?: string,        // Additional CSS classes
  children?: ReactNode,      // Child components
  config?: Object,          // Configuration override
  ...specificProps          // Component-specific props
}
```

### **Error Handling**
```javascript
// Always handle edge cases
if (!config) {
  console.warn('Component config missing, using defaults')
  return <div>Loading...</div>
}

// Graceful fallbacks
const title = config.title || 'Default Title'
```

## 📚 **File Organization**

```
src/
├── components/           # Reusable UI components
│   ├── Navigation.jsx   # Adaptive navigation
│   ├── BottomSheet.jsx  # Modal/drawer component
│   └── ServiceCard.jsx  # Content display cards
├── hooks/               # Custom React hooks
│   ├── useConfig.js     # Configuration management
│   ├── useScrollDirection.js
│   └── useMediaQuery.js
├── contexts/            # React contexts
│   └── ThemeContext.jsx # Theme management
├── pages/               # Page components
│   ├── HomePage.jsx     # Main landing page
│   └── AboutPage.jsx    # About page (bottom sheet)
├── config/              # Configuration files
│   └── site.config.json # Main site configuration
├── lib/                 # Utility functions
│   └── utils.js         # Class name utilities
└── api/                 # API utilities
    └── config.js        # Configuration API
```

## 🚀 **Performance Best Practices**

### **Bundle Optimization**
- Keep components under 5KB gzipped
- Use dynamic imports for heavy features
- Optimize images with `loading="lazy"`

### **Animation Performance**
- Use `transform` and `opacity` for animations
- Add `will-change-transform` for complex animations
- Limit animation duration to < 0.8s

### **Loading Optimization**
- Preload critical fonts
- Use `font-display: swap`
- Implement proper loading states

## 🔗 **Integration Points**

### **Adding to Existing Projects**
1. Copy component files to your project
2. Install dependencies: `framer-motion`, `lucide-react`, `tailwindcss`
3. Copy utility functions and hooks
4. Update your configuration file

### **Framework Agnostic Usage**
The patterns used here can be adapted to:
- Vue.js (with Vue Motion)
- Angular (with Angular Animations)
- Svelte (with Svelte Transition)
- Vanilla JS (with Web Animations API)

---

**Next Steps**: See [Component Documentation](./components/) for detailed API references.
