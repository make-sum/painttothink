# BottomSheet Component

A versatile modal/drawer component with smooth slide-up animations, swipe gestures on mobile, and responsive design.

## 🎯 **Features**

- **Slide-up Animation**: Smooth spring-based transitions
- **Swipe to Dismiss**: Touch gestures on mobile devices
- **Responsive Design**: Full-screen on mobile, centered modal on desktop
- **Backdrop Blur**: Modern glass morphism effect
- **Keyboard Accessible**: ESC key support and focus management

## 📱 **Responsive Behavior**

### **Mobile (≤768px)**
- Full-width bottom sheet
- Drag handle indicator
- Swipe down to dismiss
- Maximum 90% viewport height

### **Desktop (>768px)**
- Centered modal dialog
- Click X button to close
- Maximum 2xl width (42rem)
- Rounded corners on all sides

## 🎨 **Visual Design**

### **Animation Timing**
```javascript
// Spring-based slide animation
transition={{ 
  type: "spring",
  damping: 30,
  stiffness: 300
}}

// Backdrop fade
transition={{ duration: 0.3 }}
```

### **Drag Interaction**
```javascript
// Mobile swipe gestures
drag={isMobile ? "y" : false}
dragConstraints={{ top: 0 }}
dragElastic={0.2}

// Auto-close on sufficient drag
onDragEnd={(_, info) => {
  if (info.offset.y > 100) onClose()
}}
```

## 🔧 **Props Interface**

```typescript
interface BottomSheetProps {
  isOpen: boolean;           // Controls visibility
  onClose: () => void;       // Close handler function
  children: ReactNode;       // Sheet content
  title?: string;           // Optional header title
  className?: string;       // Additional CSS classes
}
```

## 📚 **Usage Examples**

### **Basic Usage**
```javascript
import { BottomSheet } from '../components/BottomSheet'

function YourComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Sheet
      </button>
      
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Your Title"
      >
        <p>Your content goes here</p>
      </BottomSheet>
    </>
  )
}
```

### **With Router Integration**
```javascript
import { useNavigate } from 'react-router-dom'

function AboutPage() {
  const navigate = useNavigate()

  return (
    <BottomSheet
      isOpen={true}
      onClose={() => navigate('/')}
      title="About Us"
    >
      <div>About content...</div>
    </BottomSheet>
  )
}
```

### **Custom Styling**
```javascript
<BottomSheet
  isOpen={isOpen}
  onClose={onClose}
  title="Custom Sheet"
  className="custom-bottom-sheet"
>
  <div className="custom-content">
    Your content with custom styles
  </div>
</BottomSheet>
```

## 🎭 **Styling Classes**

### **Container Styles**
```css
/* Base container */
.bottom-sheet-container {
  @apply fixed bottom-0 left-0 right-0 z-50;
  @apply bg-background rounded-t-3xl shadow-xl;
  @apply max-h-[90vh] h-auto;
}

/* Desktop modal */
@media (min-width: 768px) {
  .bottom-sheet-container {
    @apply max-w-2xl mx-auto mb-8 rounded-3xl;
  }
}
```

### **Content Areas**
```css
/* Header */
.bottom-sheet-header {
  @apply flex items-center justify-between p-6 border-b;
}

/* Content */
.bottom-sheet-content {
  @apply p-6 overflow-y-auto max-h-[calc(90vh-5rem)];
}

/* Drag handle (mobile only) */
.bottom-sheet-handle {
  @apply w-12 h-1 bg-muted-foreground/20 rounded-full mx-auto mt-3;
}
```

## 🔍 **Dependencies**

### **Required Packages**
```json
{
  "framer-motion": "^10.18.0",
  "lucide-react": "^0.363.0"
}
```

### **Required Hooks**
- `useMediaQuery` - Responsive breakpoint detection

## 🧪 **Testing Checklist**

### **Functionality Tests**
- [ ] Opens and closes correctly
- [ ] Swipe gesture works on mobile
- [ ] Click outside closes sheet
- [ ] ESC key closes sheet
- [ ] X button works
- [ ] Content scrolls properly

### **Responsive Tests**
- [ ] Looks correct on mobile
- [ ] Looks correct on desktop
- [ ] Transitions smoothly between orientations
- [ ] Drag handle appears only on mobile

### **Accessibility Tests**
- [ ] Focus management works
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible
- [ ] ARIA labels present

## 🚨 **Common Issues**

### **Sheet Not Closing**
```javascript
// Ensure onClose is properly defined
const handleClose = useCallback(() => {
  setIsOpen(false)
}, [])

<BottomSheet onClose={handleClose} />
```

### **Scroll Issues**
```javascript
// Body scroll is managed automatically
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }
  
  return () => {
    document.body.style.overflow = 'unset'
  }
}, [isOpen])
```

### **Animation Performance**
```javascript
// Add performance hints
className="will-change-transform"

// Optimize transition timing
transition={{ 
  type: "spring",
  damping: 30,      // Reduce for faster animation
  stiffness: 300    // Increase for snappier feel
}}
```

## 🎨 **Customization Examples**

### **Custom Header**
```javascript
<BottomSheet isOpen={isOpen} onClose={onClose}>
  <div className="custom-header p-4 border-b">
    <h2>Custom Title</h2>
    <button onClick={onClose}>Custom Close</button>
  </div>
  <div className="content p-6">
    Your content
  </div>
</BottomSheet>
```

### **No Header Mode**
```javascript
<BottomSheet isOpen={isOpen} onClose={onClose}>
  <div className="p-6">
    <button 
      onClick={onClose}
      className="absolute top-4 right-4 p-2 rounded-lg"
    >
      <X className="h-5 w-5" />
    </button>
    Your content without header
  </div>
</BottomSheet>
```

---

**Related Components:**
- [Navigation](./Navigation.md) - Uses BottomSheet for mobile menu
- [ConfigEditor](./ConfigEditor.md) - Uses BottomSheet for modal interface
