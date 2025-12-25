/**
 * Smooth scroll utilities for butter-smooth scrolling experience
 */

/**
 * Smooth scroll to element with offset
 */
export function smoothScrollTo(element: HTMLElement | string, offset = 0): void {
  const target = typeof element === 'string' 
    ? document.querySelector(element) as HTMLElement
    : element

  if (!target) return

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  })
}

/**
 * Smooth scroll to top
 */
export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Debounce function for scroll events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return function(this: any, ...args: Parameters<T>) {
    const context = this
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), wait)
  }
}

