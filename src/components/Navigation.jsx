/**
 * Navigation Component
 * 
 * Adaptive navigation that switches between bottom bar (mobile) and sidebar (desktop)
 * based on device orientation. Features scroll-aware hide/show behavior and smooth
 * animations powered by Framer Motion.
 * 
 * @features
 * - Responsive design (bottom bar ↔ sidebar)
 * - Scroll-aware visibility (hides on scroll down, shows on scroll up)
 * - Smooth slide animations with spring physics
 * - Integrated theme toggle with proper spacing
 * - Configuration-driven navigation items
 * - Icon-based navigation with labels
 * 
 * @performance
 * - Optimized with AnimatePresence for efficient mount/unmount
 * - Throttled scroll direction detection
 * - Minimal re-renders with proper dependencies
 * 
 * @responsive
 * - Portrait: Bottom navigation bar (mobile-first)
 * - Landscape: Left sidebar navigation (desktop)
 * - Automatic orientation detection and adaptation
 */

import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Info, Briefcase, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useScrollDirection } from '../hooks/useScrollDirection'
import { useOrientation, useMediaQuery } from '../hooks/useMediaQuery'
import { useConfig } from '../hooks/useConfig'
import { useTranslation } from '../hooks/useTranslation'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'

// Icon mapping for navigation items
// Add new icons here when extending navigation options
const iconMap = {
  home: Home,
  info: Info,
  briefcase: Briefcase,
  mail: Mail
}

/**
 * Navigation Component Implementation
 * 
 * Renders adaptive navigation with scroll-aware behavior and responsive design.
 * Automatically filters out briefcase and mail icons per design requirements.
 */
export function Navigation() {
  // Hooks for responsive and scroll-aware behavior
  const scrollDirection = useScrollDirection() // 'up' | 'down'
  const orientation = useOrientation()         // 'portrait' | 'landscape'
  const isLandscape = useMediaQuery('(min-width: 768px)') // Use width-based detection for desktop (lowered threshold)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const isVisible = scrollDirection === 'up' || window.scrollY === 0
  const siteConfig = useConfig()              // Dynamic configuration loading
  const { t } = useTranslation()              // Translations
  
  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    if (typeof window !== 'undefined') {
      handleResize() // Initial check
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  // Use landscape orientation OR wide screen for centered menu
  // For wide screens (desktop), always center the menu horizontally
  // Force centering for screens wider than 768px
  const shouldCenterMenu = isLandscape || (windowWidth > 0 && windowWidth >= 768)
  const isPortraitMode = !shouldCenterMenu && orientation === 'portrait'

  // Navigation items from configuration with translations
  const navItems = siteConfig.navigation.main.map(item => ({
    ...item,
    label: t(`nav.${item.icon}`) || item.label
  }))
  
  // Filter out specified icons (briefcase, mail) per design requirements
  const visibleNavItems = navItems.filter(
    (item) => !['briefcase', 'mail'].includes(item.icon)
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: orientation === 'portrait' ? 100 : 0, x: orientation === 'landscape' ? -100 : 0, opacity: 0 }}
          animate={{ y: 0, x: 0, opacity: 1 }}
          exit={{ y: orientation === 'portrait' ? 100 : 0, x: orientation === 'landscape' ? -100 : 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={isPortraitMode ? {
            position: 'fixed',
            bottom: '1rem',
            right: '1.5rem', // 24px
            zIndex: 50
          } : shouldCenterMenu ? {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
            width: '5rem',
            height: 'auto',
            bottom: 'auto',
            right: 'auto'
          } : undefined}
          className={cn(
            "bg-background/80 backdrop-blur-lg shadow-lg shadow-black/10 dark:shadow-white/5 rounded-2xl",
            isPortraitMode
              ? "h-16 w-auto" 
              : shouldCenterMenu 
                ? "!fixed !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-20 !h-auto !z-50 !bottom-auto !right-auto" // Force centering with important
                : "fixed left-4 top-1/2 -translate-y-1/2 w-20 h-auto z-50"
          )}
        >
          <div className={cn(
            "flex items-center h-full w-full",
            isPortraitMode ? "justify-around px-4" : "flex-col justify-between py-4"
          )}>
            <div className={cn(
              "flex items-center",
              isPortraitMode ? "flex-row gap-2" : "flex-col gap-4"
            )}>
              {visibleNavItems.map((item) => {
                const Icon = iconMap[item.icon]
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) => cn(
                      "flex items-center justify-center p-3 rounded-lg transition-colors",
                      "hover:bg-muted",
                      isActive && "bg-muted",
                      isPortraitMode ? "flex-col gap-1" : "w-full"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">
                      {item.label}
                    </span>
                  </NavLink>
                )
              })}
            </div>
            
            <div className={cn(
              "flex items-center",
              !isPortraitMode ? "flex-col gap-4 mt-8" : "flex-row gap-2 ml-8"
            )}>
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
