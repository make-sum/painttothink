// Simple config API for browser-only updates
export async function updateConfig(newConfig) {
  try {
    // For development, we'll use a simple approach with dynamic imports
    const configModule = await import('../config/site.config.json', { assert: { type: 'json' } })
    
    // In a real browser-only setup, you'd typically use:
    // 1. A simple backend API
    // 2. A headless CMS like Sanity/Strapi
    // 3. A database like Firebase/Supabase
    // 4. GitHub API to update the file directly
    
    // For now, we'll simulate an update by storing in a more persistent way
    localStorage.setItem('siteConfig', JSON.stringify(newConfig))
    
    // Broadcast the change to all tabs/windows
    window.dispatchEvent(new CustomEvent('configUpdated', { detail: newConfig }))
    
    return { success: true }
  } catch (error) {
    console.error('Failed to update config:', error)
    return { success: false, error: error.message }
  }
}

export async function getConfig() {
  try {
    // Check for local override first
    const localConfig = localStorage.getItem('siteConfig')
    if (localConfig) {
      return JSON.parse(localConfig)
    }
    
    // Fall back to default config
    const defaultConfig = await import('../config/site.config.json', { assert: { type: 'json' } })
    return defaultConfig.default
  } catch (error) {
    console.error('Failed to load config:', error)
    return null
  }
}
