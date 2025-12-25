import { useState, useEffect } from 'react'
import defaultConfig from '../config/site.config.json'

// Cache config to prevent re-parsing
let cachedConfig = null

export function useConfig() {
  const [config, setConfig] = useState(() => {
    // Return cached config if available
    if (cachedConfig) return cachedConfig
    
    // Start with default config for immediate render
    cachedConfig = defaultConfig
    return defaultConfig
  })

  useEffect(() => {
    // Load config from Cloudflare KV via API
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/config/get')
        if (!res.ok) throw new Error('Failed to fetch config')
        
        const apiConfig = await res.json()
        
        // Only use API config if it has valid services
        if (apiConfig?.services && apiConfig.services.length > 0) {
          cachedConfig = apiConfig
          setConfig(apiConfig)
        }
      } catch (error) {
        console.error('Failed to load config from API, using default:', error)
        // Keep using default config on error
      }
    }
    
    loadConfig()

    // Listen for config updates from ConfigEditor
    const handleConfigUpdate = (event) => {
      cachedConfig = event.detail
      setConfig(event.detail)
    }

    window.addEventListener('configUpdated', handleConfigUpdate)
    
    return () => {
      window.removeEventListener('configUpdated', handleConfigUpdate)
    }
  }, [])

  return config
}
