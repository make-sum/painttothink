/**
 * Smooth scroll utilities for butter-smooth scrolling experience
 */

/**
 * Smooth scroll to element with offset
 */
export function smoothScrollTo(element, offset = 0) {
  const target = typeof element === 'string' 
    ? document.querySelector(element)
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
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * Throttle function for scroll events
 */
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
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
export function debounce(func, wait) {
  let timeout = null
  return function(...args) {
    const context = this
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), wait)
  }
}
