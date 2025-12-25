import { useState, useEffect } from 'react'
import defaultConfig from '../config/site.config.json'

// Cache config to prevent re-parsing
let cachedConfig = null
let configPromise = null

export function useConfig() {
  const [config, setConfig] = useState(() => {
    // Always return defaultConfig immediately to ensure services are available
    // This prevents empty services array on first render
    if (cachedConfig) return cachedConfig
    
    // Try to load from localStorage synchronously on first render
    try {
      const savedConfig = localStorage.getItem('siteConfig')
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)
        // Only use saved config if it has services
        if (parsedConfig?.services && parsedConfig.services.length > 0) {
          cachedConfig = parsedConfig
          return parsedConfig
        }
      }
    } catch (e) {
      console.error('Failed to parse saved config:', e)
    }
    
    // Always return default config to ensure services are available
    cachedConfig = defaultConfig
    return defaultConfig
  })

  useEffect(() => {
    // TEMPORARILY DISABLED API CALL - Using default config to fix videos
    // The API was returning config without services array, breaking video display
    // TODO: Fix API to return proper config with services
    
    // Ensure default config is set if not already
    if (!cachedConfig || !cachedConfig.services || cachedConfig.services.length === 0) {
      cachedConfig = defaultConfig
      setConfig(defaultConfig)
    }
    
    // Load initial config from API (disabled for now)
    /*
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/config/get')
        const apiConfig = await res.json()
        // Only use API config if it has services
        if (apiConfig?.services && apiConfig.services.length > 0) {
          cachedConfig = apiConfig
          setConfig(apiConfig)
          localStorage.setItem('siteConfig', JSON.stringify(apiConfig))
        }
      } catch (error) {
        console.error('Failed to load config from API:', error)
        // Keep using default config
      }
    }
    loadConfig()
    */

    // Listen for config updates from other tabs/components
    const handleConfigUpdate = (event) => {
      setConfig(event.detail)
    }

    window.addEventListener('configUpdated', handleConfigUpdate)
    
    return () => {
      window.removeEventListener('configUpdated', handleConfigUpdate)
    }
  }, [])

  return config
}
