/**
 * Copy text to clipboard with fallback support
 * Returns a promise that resolves with success/failure
 */
export async function copyToClipboard(text) {
  // Modern clipboard API (preferred method)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return { success: true, method: 'modern' }
    } catch (err) {
      console.warn('Modern clipboard API failed:', err)
      // Fall back to legacy method
    }
  }
  
  // Legacy fallback using execCommand
  return new Promise((resolve) => {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-999999px'
    textarea.style.top = '-999999px'
    textarea.setAttribute('readonly', '')
    document.body.appendChild(textarea)
    
    try {
      // Select the text
      textarea.select()
      textarea.setSelectionRange(0, 99999) // For mobile devices
      
      // Copy the text
      const successful = document.execCommand('copy')
      
      if (successful) {
        resolve({ success: true, method: 'legacy' })
      } else {
        resolve({ success: false, error: 'execCommand failed' })
      }
    } catch (err) {
      resolve({ success: false, error: err.message })
    } finally {
      // Clean up
      document.body.removeChild(textarea)
    }
  })
}

/**
 * Copy email with user-friendly toast notifications
 */
export async function copyEmailToClipboard(email, toast) {
  if (!email) {
    toast?.error('No email address to copy')
    return false
  }
  
  try {
    const result = await copyToClipboard(email)
    
    if (result.success) {
      toast?.success(`Email copied to clipboard!`, 2000)
      return true
    } else {
      toast?.error('Failed to copy to clipboard')
      return false
    }
  } catch (error) {
    console.error('Clipboard copy failed:', error)
    toast?.error('Clipboard access denied')
    return false
  }
}
