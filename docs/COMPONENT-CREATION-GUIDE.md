# Component Creation Guide

Step-by-step guide for creating new components in the Paint To Think component library following established patterns and performance standards.

## 🏗️ **Component Creation Workflow**

### **1. Planning Phase**
Before writing code, define:
- **Purpose**: What does this component do?
- **Props**: What data does it need?
- **Responsive**: How does it adapt to different screens?
- **Performance**: Any heavy operations or animations?
- **Configuration**: What should be configurable via JSON?

### **2. File Creation**
```bash
# Create component file
touch src/components/YourComponent.jsx

# Create documentation
touch docs/components/YourComponent.md

# Create test file (future)
touch tests/components/YourComponent.test.jsx
```

## 📝 **Component Template**

### **Full Component Template**
```javascript
/**
 * YourComponent - Brief description of what this component does
 * 
 * Detailed description of the component's purpose, behavior, and use cases.
 * Include any important performance considerations or responsive behaviors.
 * 
 * @features
 * - Feature 1: Description
 * - Feature 2: Description
 * - Feature 3: Description
 * 
 * @performance
 * - Performance consideration 1
 * - Performance consideration 2
 * 
 * @responsive
 * - Mobile behavior description
 * - Desktop behavior description
 * 
 * @example
 * ```jsx
 * <YourComponent
 *   title="Example Title"
 *   isVisible={true}
 *   onClick={handleClick}
 * />
 * ```
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { YourIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { useConfig } from '../hooks/useConfig'
import { useMediaQuery } from '../hooks/useMediaQuery'

/**
 * Props interface for YourComponent
 * 
 * @typedef {Object} YourComponentProps
 * @property {string} title - Component title
 * @property {boolean} isVisible - Controls component visibility
 * @property {Function} onClick - Click event handler
 * @property {string} className - Additional CSS classes
 * @property {Object} config - Configuration override
 */

/**
 * YourComponent Implementation
 * 
 * @param {YourComponentProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function YourComponent({ 
  title,
  isVisible = true,
  onClick,
  className,
  config: configOverride
}) {
  // State management
  const [localState, setLocalState] = useState(false)
  
  // Configuration and responsive hooks
  const siteConfig = useConfig()
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // Merge configuration (override takes precedence)
  const config = configOverride || siteConfig.yourComponent || {}
  
  // Event handlers
  const handleClick = (event) => {
    event.preventDefault()
    setLocalState(!localState)
    onClick?.(event)
  }
  
  // Early return for conditional rendering
  if (!isVisible) return null
  
  return (
    <AnimatePresence>
      <motion.div
        // Animation configuration
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.2, 0.6, 0.2, 1] 
        }}
        
        // Styling with responsive and theme classes
        className={cn(
          // Base styles
          "relative flex items-center justify-center",
          "bg-background text-foreground",
          "rounded-lg transition-colors",
          
          // Interactive styles
          "hover:bg-muted cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-foreground",
          
          // Responsive styles
          isMobile ? "p-4 text-sm" : "p-6 text-base",
          
          // Performance optimization
          "will-change-transform",
          
          // Custom classes
          className
        )}
        
        // Event handlers
        onClick={handleClick}
        
        // Accessibility
        role="button"
        tabIndex={0}
        aria-label={title}
      >
        {/* Icon */}
        <YourIcon className="h-5 w-5 mr-2" />
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          {config.description && (
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          )}
        </div>
        
        {/* Conditional content */}
        {localState && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Default export for lazy loading compatibility
export default YourComponent
```

## 🎨 **Styling Guidelines**

### **Required CSS Classes**
```javascript
// Base component structure
className={cn(
  // Layout and positioning
  "relative flex items-center",
  
  // Theme-aware colors
  "bg-background text-foreground",
  
  // Interactive states
  "hover:bg-muted transition-colors",
  "focus:outline-none focus:ring-2",
  
  // Responsive design
  isMobile ? "mobile-classes" : "desktop-classes",
  
  // Performance optimization
  "will-change-transform",
  
  // Custom overrides
  className
)}
```

### **Animation Standards**
```javascript
// Standard animation timing
transition={{ 
  duration: 0.6,                    // Consistent timing
  ease: [0.2, 0.6, 0.2, 1]        // Custom easing curve
}}

// Performance-optimized properties
// ✅ Use: opacity, transform (x, y, scale)
// ❌ Avoid: width, height, margin, padding
```

## 🔧 **Configuration Integration**

### **Adding Configuration Support**
1. **Define config schema** in `site.config.json`:
```json
{
  "services": [
    {
      "id": "service-1",
      "title": "Service Name",
      "description": "Service description",
      "image": "/img/service.jpg",
      "details": "Detailed service information"
    }
  ],
  "yourComponent": {
    "enabled": true,
    "title": "Default Title",
    "options": {
      "showIcon": true,
      "size": "medium"
    }
  }
}
```

2. **Use in component**:
```javascript
const siteConfig = useConfig()
const componentConfig = siteConfig.yourComponent || {}

// Use configuration values
const title = componentConfig.title || 'Fallback Title'
const isEnabled = componentConfig.enabled !== false
```

## 📱 **Responsive Patterns**

### **Orientation-Based Design**
```javascript
import { useOrientation } from '../hooks/useMediaQuery'

const orientation = useOrientation()

// Different layouts for different orientations
className={cn(
  "base-styles",
  orientation === 'portrait' 
    ? "bottom-4 left-4 right-4 h-16"    // Mobile bottom bar
    : "left-4 top-4 bottom-4 w-20"      // Desktop sidebar
)}
```

### **Breakpoint-Based Design**
```javascript
import { useMediaQuery } from '../hooks/useMediaQuery'

const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
const isDesktop = useMediaQuery('(min-width: 1025px)')

// Adaptive sizing
const size = isMobile ? 'sm' : isTablet ? 'md' : 'lg'
```

## 🎭 **Theme Integration**

### **Using Theme Colors**
```javascript
// CSS custom properties (recommended)
className="bg-background text-foreground"
className="hover:bg-muted"
className="border-muted-foreground"

// Theme-aware conditional styling
const { theme } = useTheme()
className={cn(
  "base-styles",
  theme === 'dark' ? "shadow-white/5" : "shadow-black/10"
)}
```

## ⚡ **Performance Requirements**

### **Animation Performance**
```javascript
// ✅ Required for animated components
className="will-change-transform"

// ✅ Optimize heavy animations
whileHover={{ scale: 1.05 }}  // Small scale changes
transition={{ duration: 0.6 }} // Max 0.8s duration

// ❌ Avoid expensive animations
// Don't animate: width, height, margin, padding, border
```

### **Bundle Size Optimization**
```javascript
// ✅ Use dynamic imports for heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// ✅ Tree-shake icon imports
import { SpecificIcon } from 'lucide-react'

// ❌ Avoid importing entire libraries
// import * from 'lucide-react'  // Don't do this
```

## 🧪 **Testing Requirements**

### **Component Testing Checklist**
- [ ] **Renders correctly** in all states
- [ ] **Responsive behavior** works on mobile/desktop
- [ ] **Animations are smooth** and performant
- [ ] **Theme switching** works properly
- [ ] **Configuration changes** apply correctly
- [ ] **Accessibility** features functional
- [ ] **No console errors** during interaction

### **Manual Testing Process**
```bash
# 1. Test in development
npm run dev
# → Test component behavior

# 2. Test production build
npm run build && npm run preview
# → Verify optimizations work

# 3. Test deployment
npx wrangler pages deploy dist --project-name painttothink
# → Test on actual Cloudflare Pages
```

## 📚 **Documentation Requirements**

### **Component Documentation Template**
Create `docs/components/YourComponent.md` with:

```markdown
# YourComponent

Brief description of the component.

## Features
- Feature list

## Props Interface
- Prop documentation

## Usage Examples
- Code examples

## Styling
- CSS class documentation

## Performance
- Performance considerations

## Testing
- Testing checklist
```

### **Code Comments Standards**
```javascript
/**
 * JSDoc header with full description
 * Include @features, @performance, @responsive sections
 */

// Inline comments for complex logic
const complexCalculation = useMemo(() => {
  // Explain why this calculation is needed
  // and how it improves performance
  return expensiveOperation(data)
}, [data])

// Comment all non-obvious code
const isVisible = scrollDirection === 'up' || window.scrollY === 0
// ^ Shows nav when scrolling up OR at top of page
```

## 🔗 **Integration Patterns**

### **Adding to Existing Pages**
```javascript
// 1. Import component
import { YourComponent } from '../components/YourComponent'

// 2. Add to JSX
<YourComponent
  title="Example"
  onClick={handleClick}
  className="custom-styles"
/>

// 3. Update configuration if needed
// Edit src/config/site.config.json
```

### **Creating Compound Components**
```javascript
// Main component
export function CardContainer({ children, ...props }) {
  return (
    <div className="card-container" {...props}>
      {children}
    </div>
  )
}

// Sub-components
CardContainer.Header = function CardHeader({ children }) {
  return <div className="card-header">{children}</div>
}

CardContainer.Body = function CardBody({ children }) {
  return <div className="card-body">{children}</div>
}

// Usage
<CardContainer>
  <CardContainer.Header>Title</CardContainer.Header>
  <CardContainer.Body>Content</CardContainer.Body>
</CardContainer>
```

## 🚀 **Deployment Integration**

### **Component Export**
```javascript
// src/components/index.js
export { Navigation } from './Navigation'
export { BottomSheet } from './BottomSheet'
export { ServiceCard } from './ServiceCard'
export { YourComponent } from './YourComponent'  // Add new components here
```

### **Configuration Schema**
```javascript
// Update src/config/site.config.json
{
  "yourComponent": {
    "enabled": true,
    "title": "Default Title",
    "options": {}
  }
}
```

---

**Next Steps**: 
1. Create your component using this template
2. Add comprehensive documentation
3. Test thoroughly following the checklist
4. Commit and deploy following the deployment guide
