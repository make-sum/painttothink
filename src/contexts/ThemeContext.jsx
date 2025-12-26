/**
 * ThemeContext - Manages application theme (light/dark mode)
 * 
 * Theme Detection Priority (in order):
 * 1. Previous visit preference (localStorage) - highest priority
 * 2. Browser/device preference (prefers-color-scheme media query)
 * 3. Default to light mode if no preference is set
 * 
 * This ensures users get their preferred theme while new visitors
 * see light mode by default for better accessibility and readability.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'

// Create theme context for global theme state management
const ThemeContext = createContext()

/**
 * ThemeProvider - Provides theme state and controls to the application
 * 
 * @param {React.ReactNode} children - Child components that need theme access
 * 
 * Theme initialization logic:
 * - First checks localStorage for previously saved theme preference
 * - If no saved preference, checks browser/device system preference
 * - If no system preference detected, defaults to 'light' mode
 * - Listens for system preference changes and updates accordingly
 */
export function ThemeProvider({ children }) {
  /**
   * Initialize theme state with priority-based detection
   * Priority: localStorage > system preference > default (light)
   */
  const [theme, setTheme] = useState(() => {
    // Priority 1: Check for previous visit preference (user's explicit choice)
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
    
    // Priority 2: Check browser/device system preference
    // This respects the user's OS-level theme setting
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        return 'dark'
      }
    }
    
    // Priority 3: Default to light mode for new visitors
    // Light mode is generally better for readability and accessibility
    return 'light'
  })

  /**
   * Apply theme to document and sync with localStorage
   * Runs whenever theme state changes
   */
  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove both theme classes to prevent conflicts
    root.classList.remove('light', 'dark')
    
    // Add current theme class (used by Tailwind's dark mode)
    root.classList.add(theme)
    
    // Persist user's theme choice for future visits
    try {
      localStorage.setItem('theme', theme)
    } catch (error) {
      // Handle localStorage errors (e.g., private browsing mode)
      console.warn('Failed to save theme preference:', error)
    }
  }, [theme])

  /**
   * Listen for system preference changes
   * Updates theme if user hasn't explicitly set a preference
   */
  useEffect(() => {
    // Only listen if user hasn't explicitly set a preference
    const saved = localStorage.getItem('theme')
    if (saved) {
      // User has explicit preference, don't auto-update
      return
    }

    // Create media query listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    /**
     * Handle system preference changes
     * @param {MediaQueryListEvent} event - Media query change event
     */
    const handleChange = (event) => {
      // Only update if no explicit user preference exists
      if (!localStorage.getItem('theme')) {
        setTheme(event.matches ? 'dark' : 'light')
      }
    }

    // Modern browsers: use addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Legacy browsers: use addListener
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  /**
   * Toggle between light and dark themes
   * This is the user's explicit choice and will override system preferences
   */
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme - Hook to access theme state and controls
 * 
 * @returns {Object} Theme context with:
 *   - theme: 'light' | 'dark' - Current theme
 *   - toggleTheme: Function - Toggle between themes
 * 
 * @throws {Error} If used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
