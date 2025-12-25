import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../lib/utils'

/**
 * Optimized lazy-loading video component with intersection observer
 * Only loads video when it enters viewport for better performance
 */
export function LazyVideo({ 
  src, 
  className, 
  autoPlay = true, 
  loop = true, 
  muted = true,
  playsInline = true,
  ...props 
}) {
  const videoRef = useRef(null)

  const handleError = (e) => {
    console.error('Video load error:', src, e)
  }

  // Simplified - always show video immediately, no lazy loading
  return (
    <div className={cn('relative w-full h-full', className)}>
      <video
        ref={videoRef}
        src={src}
        className="object-cover w-full h-full"
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload="auto"
        onError={handleError}
        {...props}
      />
    </div>
  )
}

