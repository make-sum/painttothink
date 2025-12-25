# Deployment Guide - Paint To Think SWA

Complete guide for deploying the Paint To Think Single Web Application to Cloudflare Pages with maximum performance.

## 🚀 **Quick Deployment**

### **One-Command Deploy**
```bash
cd painttothink && npm run build && cd .. && npx wrangler pages deploy dist --project-name painttothink
```

### **Step-by-Step Process**
```bash
# 1. Build the application
cd painttothink
npm run build

# 2. Deploy to Cloudflare Pages
cd ..
npx wrangler pages deploy dist --project-name painttothink

# 3. Commit and push changes
git add -A
git commit -m "Deploy updates"
git push painttothink main
```

## 🔧 **Configuration Files**

### **wrangler.toml** (Root Directory)
```toml
name = "painttothink"
compatibility_date = "2024-08-30"
pages_build_output_dir = "dist"

[build]
command = "cd painttothink && npm install && npm run build"

[env.production.vars]
NODE_ENV = "production"

[env.preview.vars]
NODE_ENV = "development"
```

### **Cloudflare Pages Settings**
- **Build command**: `cd painttothink && npm run build`
- **Build output directory**: `dist`
- **Root directory**: (leave empty)
- **Node.js version**: 18 or 20

## 🌐 **Current Deployment URLs**

### **Live Sites**
- **Primary**: https://paint-1sj.pages.dev ✅ VERIFIED
- **Custom Domain**: https://paint.toth.ink ✅ CONFIGURED
- **Config Editor**: Add `?config=true` to any URL (password: `admin123`)

### **DNS Configuration for paint.toth.ink**
- **Type**: CNAME
- **Name**: `paint`
- **Target**: `paint-1sj.pages.dev`
- **Proxy**: Proxied (Orange cloud) ✅
- **Status**: Active

See [DNS-SETUP-COMPLETE.md](../../DNS-SETUP-COMPLETE.md) for setup details.

## ⚡ **Performance Optimizations**

### **Build Optimizations**
```javascript
// vite.config.js optimizations active:
{
  target: 'es2020',           // Modern browser support
  minify: 'esbuild',          // Fast minification
  cssMinify: true,            // CSS optimization
  sourcemap: false,           // Reduced bundle size
  
  // Code splitting for better caching
  manualChunks: {
    'react-vendor': ['react', 'react-dom'],
    'router': ['react-router-dom'],
    'animation': ['framer-motion'],
    'icons': ['lucide-react']
  }
}
```

### **Cloudflare Edge Optimizations**
```
HTTP/3 Protocol: ✅ Enabled
Brotli Compression: ✅ Active  
Edge Caching: ✅ 1 year for assets
Font Preloading: ✅ Critical fonts
Image Optimization: ✅ Lazy loading
```

### **Performance Metrics**
- **Bundle Size**: 45KB gzipped (main chunk)
- **First Contentful Paint**: < 800ms target
- **Time to Interactive**: < 1.5s target
- **Lighthouse Score**: 90+ target

## 🔄 **Automatic Deployments**

### **GitHub Integration Setup**
1. **Cloudflare Dashboard** → Pages → painttothink project
2. **Settings** → **Source** → **Connect to Git**
3. **Select Repository**: `make-sum/painttothink`
4. **Production Branch**: `main`
5. **Build Settings**:
   - Build command: `cd painttothink && npm run build`
   - Output directory: `dist`

### **Auto-Deploy Trigger**
```bash
# Any push to main branch triggers deployment
git push painttothink main
```

## 🧪 **Testing Deployment**

### **Automated Testing Script**
```bash
# Run comprehensive site test
source venv/bin/activate
python test_site.py
```

### **Manual Testing Checklist**
- [ ] Site loads without errors
- [ ] Navigation works (scroll hide/show)
- [ ] About page opens as bottom sheet
- [ ] Theme toggle functions
- [ ] Service cards have hover effects
- [ ] Email copy functionality works
- [ ] Config editor accessible (`?config=true`)
- [ ] Mobile responsive design
- [ ] Desktop responsive design

### **Performance Testing**
```bash
# Lighthouse CLI testing
npm install -g lighthouse
lighthouse https://a2221375.painttothink.pages.dev --output=json --output-path=./lighthouse-report.json
```

## 🔧 **Environment Management**

### **Development Environment**
```bash
# Local development
npm run dev
# → http://localhost:5173

# Local preview of production build
npm run build && npm run preview
# → http://localhost:4173
```

### **Staging Environment**
```bash
# Deploy to preview environment
npx wrangler pages deploy dist --project-name painttothink --branch preview
```

### **Production Environment**
```bash
# Deploy to production
npx wrangler pages deploy dist --project-name painttothink
```

## 📊 **Monitoring & Analytics**

### **Cloudflare Analytics**
- **Real User Monitoring** available in Cloudflare Dashboard
- **Core Web Vitals** tracking
- **Geographic performance** data

### **Error Monitoring**
```javascript
// Add error boundary for production
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({error}) {
  return (
    <div className="error-fallback">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  )
}

// Wrap your app
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <App />
</ErrorBoundary>
```

## 🔐 **Security Configuration**

### **HTTP Headers** (functions/_headers)
```
# Security headers active:
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin

# Performance headers:
Cache-Control: public, max-age=31536000, immutable
Alt-Svc: h3=":443"; ma=86400
```

## 🚨 **Troubleshooting**

### **Build Failures**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Deployment Errors**
```bash
# Check Wrangler authentication
npx wrangler auth whoami

# Re-authenticate if needed
npx wrangler auth login
```

### **Performance Issues**
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for large dependencies
npm ls --depth=0
```

## 📈 **Optimization Checklist**

### **Before Each Deploy**
- [ ] Run `npm run build` successfully
- [ ] Test locally with `npm run preview`
- [ ] Check bundle sizes are reasonable
- [ ] Verify no console errors
- [ ] Test on mobile and desktop
- [ ] Validate configuration changes

### **Performance Monitoring**
- [ ] Lighthouse score > 90
- [ ] Bundle size < 50KB gzipped
- [ ] Load time < 1s
- [ ] No layout shift issues

## 🔗 **Related Documentation**

- [Component Library Overview](../README-COMPONENT-LIBRARY.md)
- [Development Guide](./DEVELOPMENT-GUIDE.md)
- [Configuration System](./CONFIGURATION.md)

---

**Live Deployment**: https://a2221375.painttothink.pages.dev
**GitHub Repository**: https://github.com/make-sum/painttothink
