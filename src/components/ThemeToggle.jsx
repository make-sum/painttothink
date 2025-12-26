/**
 * ThemeToggle - Button component for switching between light and dark themes
 * 
 * Features:
 * - Displays Moon icon in light mode (clicking switches to dark)
 * - Displays Sun icon in dark mode (clicking switches to light)
 * - Accessible with proper ARIA labels
 * - Smooth hover transitions
 * - Keyboard accessible with focus indicators
 */

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { cn } from '../lib/utils'

/**
 * ThemeToggle Component
 * 
 * @param {string} className - Optional additional CSS classes
 * @returns {JSX.Element} Theme toggle button
 */
export function ThemeToggle({ className }) {
  // Get current theme and toggle function from ThemeContext
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-lg transition-colors",
        "hover:bg-muted",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-foreground",
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Show Moon icon in light mode (indicates dark mode is available) */}
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        /* Show Sun icon in dark mode (indicates light mode is available) */
        <Sun className="h-5 w-5" />
      )}
    </button>
  )
}
