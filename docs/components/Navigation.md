# Navigation Component

Adaptive navigation component that automatically switches between bottom navigation (mobile) and sidebar navigation (desktop) based on device orientation.

## 🎯 **Features**

- **Adaptive Layout**: Bottom bar (portrait) ↔ Sidebar (landscape)
- **Scroll-Aware**: Hides on scroll down, shows on scroll up
- **Smooth Animations**: Framer Motion powered transitions
- **Theme Integration**: Includes dark/light mode toggle
- **Icon-Based**: Uses Lucide React icons with labels

## 📱 **Responsive Behavior**

### **Portrait Mode (Mobile)**
- Fixed bottom navigation bar
- Horizontal icon layout with labels
- 32px spacing for theme toggle
- Floating design with rounded corners

### **Landscape Mode (Desktop)**
- Fixed left sidebar navigation  
- Vertical icon layout (labels hidden)
- Theme toggle at bottom
- Compact 20px width design

## 🎨 **Styling**

### **Base Styles**
```css
/* Floating navigation with glass morphism */
bg-background/80 backdrop-blur-lg shadow-lg

/* Adaptive positioning */
portrait: bottom-4 left-1/2 -translate-x-1/2 rounded-2xl
landscape: left-4 top-1/2 -translate-y-1/2 rounded-2xl
```

### **Animation States**
```javascript
// Entry/exit animations
initial={{ y: 100, x: -100, opacity: 0 }}
animate={{ y: 0, x: 0, opacity: 1 }}
exit={{ y: 100, x: -100, opacity: 0 }}
```

## 🔧 **Configuration**

### **JSON Configuration**
```json
{
  "navigation": {
    "main": [
      { 
        "label": "Home", 
        "href": "/", 
        "icon": "home" 
      },
      { 
        "label": "About", 
        "href": "/about", 
        "icon": "info" 
      }
    ]
  }
}
```

### **Supported Icons**
- `home` → Home icon
- `info` → Info icon  
- `briefcase` → Briefcase icon (hidden by default)
- `mail` → Mail icon (hidden by default)

## 🎯 **Props Interface**

```typescript
interface NavigationProps {
  // No props required - fully configuration driven
}
```

## 📚 **Usage Examples**

### **Basic Usage**
```javascript
import { Navigation } from '../components/Navigation'

function App() {
  return (
    <div>
      <Navigation />
      {/* Your content */}
    </div>
  )
}
```

### **Customizing Navigation Items**
Edit `src/config/site.config.json`:
```json
{
  "navigation": {
    "main": [
      { "label": "Home", "href": "/", "icon": "home" },
      { "label": "Portfolio", "href": "/portfolio", "icon": "briefcase" },
      { "label": "Contact", "href": "/contact", "icon": "mail" }
    ]
  }
}
```

## 🔍 **Dependencies**

### **Required Packages**
```json
{
  "react-router-dom": "^6.22.3",
  "framer-motion": "^10.18.0", 
  "lucide-react": "^0.363.0"
}
```

### **Required Hooks**
- `useScrollDirection` - Detects scroll direction
- `useOrientation` - Detects device orientation
- `useConfig` - Loads site configuration

## 🎭 **Theming**

### **CSS Custom Properties**
```css
/* Light mode */
--background: 0 0% 100%;
--foreground: 0 0% 6.67%;
--muted: 0 0% 96.67%;

/* Dark mode */  
--background: 0 0% 6.67%;
--foreground: 0 0% 100%;
--muted: 0 0% 13.33%;
```

### **Theme Toggle Integration**
The component automatically includes a `ThemeToggle` component with proper spacing:
- **Portrait**: 32px left margin (`ml-8`)
- **Landscape**: 32px top margin (`mt-8`)

## 🚀 **Performance**

### **Optimizations**
- Uses `AnimatePresence` for efficient mount/unmount
- Scroll direction calculated with throttling
- Orientation detection with media queries
- Minimal re-renders with proper dependencies

### **Bundle Impact**
- **Base size**: ~2KB gzipped
- **With dependencies**: ~8KB gzipped total
- **Runtime performance**: 60fps animations

## 🧪 **Testing**

### **Test Cases**
1. **Orientation changes** - Switch device orientation
2. **Scroll behavior** - Scroll up/down to test hide/show
3. **Navigation clicks** - Test all navigation items
4. **Theme toggle** - Test dark/light mode switching
5. **Responsive design** - Test various screen sizes

### **Manual Testing**
```bash
# Test on mobile
# - Rotate device to test orientation
# - Scroll to test hide/show behavior
# - Tap navigation items

# Test on desktop  
# - Resize window to test breakpoints
# - Scroll to test sidebar behavior
# - Click navigation and theme toggle
```

## 🔧 **Customization**

### **Adding New Icons**
1. **Import icon** from Lucide React:
```javascript
import { YourIcon } from 'lucide-react'
```

2. **Add to icon map**:
```javascript
const iconMap = {
  home: Home,
  info: Info,
  youricon: YourIcon  // Add here
}
```

3. **Update configuration**:
```json
{
  "navigation": {
    "main": [
      { "label": "Your Page", "href": "/your-page", "icon": "youricon" }
    ]
  }
}
```

### **Styling Customization**
```javascript
// Override styles with className
<Navigation className="custom-nav-styles" />

// Or modify the component directly
className={cn(
  "fixed z-50 bg-background/80 backdrop-blur-lg",
  "your-custom-classes"
)}
```

## 🚨 **Common Issues**

### **Navigation Not Hiding**
- Check `useScrollDirection` hook implementation
- Verify scroll event listeners are attached
- Test `window.scrollY` values

### **Orientation Not Switching**
- Verify `useMediaQuery` hook
- Check media query syntax: `(orientation: portrait)`
- Test on actual devices, not just browser dev tools

### **Icons Not Showing**
- Verify icon name matches `iconMap`
- Check Lucide React import
- Ensure icon name is lowercase in config

---

**Related Documentation:**
- [Component Library Overview](../README-COMPONENT-LIBRARY.md)
- [BottomSheet Component](./BottomSheet.md)
- [ServiceCard Component](./ServiceCard.md)
