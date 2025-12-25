import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { Navigation } from './components/Navigation'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useConfig } from './hooks/useConfig'
import { useTranslation } from './hooks/useTranslation'

// Import pages directly to avoid lazy loading issues
// Lazy loading was causing React Error #130 (undefined component)
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import ConfigEditor from './components/ConfigEditor'

function AppContent() {
  const [showConfig, setShowConfig] = useState(false)
  const config = useConfig()
  const { t } = useTranslation()

  useEffect(() => {
    // Check URL params for config editor
    const params = new URLSearchParams(window.location.search)
    if (params.get('config') === 'true') {
      setShowConfig(true)
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-geist">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<HomePage />} />
          <Route path="/contact" element={<HomePage />} />
        </Routes>

        <ConfigEditor 
          isOpen={showConfig} 
          onClose={() => setShowConfig(false)} 
        />
          
        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          {t('site.copyright') || '© Paint To Think, 2000'}
        </footer>
      </div>
    </Router>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App
