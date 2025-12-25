# ProgressLoader Component

A sophisticated progress indicator that animates the Paint To Think logo fill as progress increases. Perfect for loading states, file uploads, or any progress-based user feedback.

## 🎯 **Overview**

The ProgressLoader displays the company logo with an animated fill effect that progresses from 0% to 100%. It includes:
- **Animated logo fill** with smooth transitions
- **Progress percentage display** below the logo
- **Auto-hide functionality** when progress reaches 100%
- **Responsive sizing** with proper aspect ratio maintenance
- **Smooth animations** using Framer Motion

## 🚀 **Usage**

### Basic Implementation
```jsx
import { ProgressLoader } from '../components/ProgressLoader'

function LoadingPage() {
  const [progress, setProgress] = useState(0)
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ProgressLoader progress={progress} size={72} />
    </div>
  )
}
```

### With Progress Animation
```jsx
function AnimatedLoader() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 50)
    
    return () => clearInterval(timer)
  }, [])
  
  return <ProgressLoader progress={progress} size={72} />
}
```

## 📋 **Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `progress` | `number` | `0` | Progress value from 0 to 100 |
| `size` | `number` | `72` | Width of the logo in pixels |
| `className` | `string` | `''` | Additional CSS classes |

## 🎨 **Features**

### **Logo Animation**
- **Main Triangle**: Fills with dark gray (#363638) with path animation
- **Green Triangle**: Fills with brand green (#7AC510) 
- **Text Elements**: Fill with dark gray for company name
- **Staggered Timing**: Each element animates with different delays for smooth effect

### **Progress Display**
- **Percentage Text**: Shows current progress below the logo
- **Auto-hide**: Component disappears 500ms after reaching 100%
- **Responsive**: Maintains proper aspect ratio at any size

### **Animation Details**
```jsx
// Main triangle animation
initial={{ pathLength: 0, fillOpacity: 0 }}
animate={{ 
  pathLength: progress / 100, 
  fillOpacity: progress / 100 
}}
transition={{ 
  duration: 0.8, 
  ease: "easeInOut",
  pathLength: { delay: 0.2 },
  fillOpacity: { delay: 0.4 }
}}
```

## 🔧 **Technical Implementation**

### **SVG Structure**
The component uses two layered SVGs:
1. **Background Layer**: Empty logo with muted colors
2. **Foreground Layer**: Animated fill with progress-based opacity

### **Size Calculations**
```jsx
// Maintains 270:132 aspect ratio
const height = (size * 132) / 270
```

### **State Management**
```jsx
const [isVisible, setIsVisible] = useState(true)

useEffect(() => {
  if (progress >= 100) {
    const timer = setTimeout(() => setIsVisible(false), 500)
    return () => clearTimeout(timer)
  }
}, [progress])
```

## 📱 **Responsive Behavior**

- **Mobile**: Optimized for small screens with appropriate sizing
- **Desktop**: Scales up while maintaining proportions
- **Touch-friendly**: Large enough for mobile interactions

## 🎭 **Theme Integration**

- **Dark Mode**: Automatically adapts to current theme
- **Color Variables**: Uses CSS custom properties for theming
- **Accessibility**: High contrast ratios maintained

## 🧪 **Testing**

### **Manual Testing**
1. Set progress to 0% - logo should be empty
2. Set progress to 50% - logo should be half-filled
3. Set progress to 100% - logo should be fully filled
4. Component should auto-hide after reaching 100%

### **Automated Testing**
```jsx
// Example test structure
test('ProgressLoader animates correctly', () => {
  render(<ProgressLoader progress={50} size={72} />)
  // Verify logo elements are visible
  // Check progress percentage display
})
```

## 🔄 **Performance Considerations**

- **Optimized Animations**: Uses `will-change` CSS property
- **Efficient Rendering**: Minimal re-renders with proper state management
- **Memory Management**: Cleans up timers and event listeners

## 🚀 **Future Enhancements**

- **Custom Logo Support**: Allow different SVG logos
- **Animation Variants**: Different fill patterns (left-to-right, center-out, etc.)
- **Sound Effects**: Optional audio feedback for progress completion
- **Accessibility**: ARIA labels and screen reader support

## 📚 **Related Components**

- [`ServiceCard`](./ServiceCard.md) - Content display with loading states
- [`BottomSheet`](./BottomSheet.md) - Modal with progress indicators
- [`Navigation`](./Navigation.md) - Main navigation system

---

**Component Location**: `src/components/ProgressLoader.jsx`  
**Dependencies**: `framer-motion`, `react`  
**Last Updated**: 2024-12-19
