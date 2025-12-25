import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Eye, EyeOff } from 'lucide-react'
import { cn } from '../lib/utils'

const CONFIG_PASSWORD = 'admin123' // In production, use environment variable

export function ConfigEditor({ isOpen, onClose }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [config, setConfig] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      // Load current config from API
      fetch('/api/config/get')
        .then(res => res.json())
        .then(data => {
          setConfig(JSON.stringify(data, null, 2))
        })
        .catch(err => {
          console.error('Failed to load config:', err)
          // Fallback to default config
          import('../config/site.config.json').then(module => {
            setConfig(JSON.stringify(module.default, null, 2))
          })
        })
    }
  }, [isOpen, isAuthenticated])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password === CONFIG_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const handleSave = async () => {
    try {
      const parsedConfig = JSON.parse(config)
      
      // Save to API
      const response = await fetch('/api/config/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: config
      })
      
      if (!response.ok) {
        throw new Error('Failed to save config')
      }
      
      // Also save to localStorage as a cache
      localStorage.setItem('siteConfig', config)
      
      // Broadcast the change to all components immediately
      window.dispatchEvent(new CustomEvent('configUpdated', { detail: parsedConfig }))
      
      alert('Config saved! Changes are now persistent and visible to all visitors.')
      onClose()
    } catch (e) {
      setError(e.message || 'Invalid JSON format')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-semibold">Configuration Editor</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
            {!isAuthenticated ? (
              <form onSubmit={handlePasswordSubmit} className="max-w-sm mx-auto">
                <label className="block text-sm font-medium mb-2">
                  Enter Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn(
                      "w-full px-4 py-2 pr-10 rounded-lg border",
                      "bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                    )}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-500">{error}</p>
                )}
                <button
                  type="submit"
                  className="mt-4 w-full px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
                >
                  Unlock
                </button>
              </form>
            ) : (
              <div>
                <textarea
                  value={config}
                  onChange={(e) => setConfig(e.target.value)}
                  className={cn(
                    "w-full h-[60vh] p-4 rounded-lg border",
                    "bg-background font-mono text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-foreground"
                  )}
                  spellCheck={false}
                />
                {error && (
                  <p className="mt-2 text-sm text-red-500">{error}</p>
                )}
                <button
                  onClick={handleSave}
                  className="mt-4 px-6 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Configuration
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Default export for lazy loading compatibility
export default ConfigEditor
