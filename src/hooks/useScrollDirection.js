import { useState, useEffect, useRef } from 'react'

/**
 * Optimized scroll direction hook with throttling for smooth performance
 * Uses requestAnimationFrame for butter-smooth scroll detection
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState('up')
  const prevOffsetRef = useRef(0)
  const rafIdRef = useRef(null)

  useEffect(() => {
    let ticking = false

    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      const prevOffset = prevOffsetRef.current
      
      if (scrollY === 0) {
        setScrollDirection('up')
      } else if (scrollY > prevOffset && scrollY > 10) {
        setScrollDirection('down')
      } else if (scrollY < prevOffset) {
        setScrollDirection('up')
      }

      prevOffsetRef.current = scrollY
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        rafIdRef.current = requestAnimationFrame(updateScrollDirection)
        ticking = true
      }
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return scrollDirection
}
