import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function ProgressLoader({ progress = 0, size = 72, className = '' }) {
  const [isLoading, setIsLoading] = useState(true)

  // Mark as loaded when progress reaches 100%, but keep logo visible
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setIsLoading(false), 800)
      return () => clearTimeout(timer)
    }
  }, [progress])

  return (
    <div className={`flex flex-col items-start ${className}`} data-testid="progress-loader">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background logo (empty state) */}
        <img 
          src="/img/paint-logo.svg" 
          alt="Paint To Think Logo"
          className="absolute inset-0 opacity-20"
          style={{ width: size, height: size }}
        />

        {/* Animated fill overlay */}
        {isLoading ? (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ 
              clipPath: `inset(${100 - progress}% 0 0 0)` 
            }}
          >
            <img 
              src="/img/paint-logo.svg" 
              alt="Paint To Think Logo"
              style={{ width: size, height: size }}
            />
          </motion.div>
        ) : (
          <img 
            src="/img/paint-logo.svg" 
            alt="Paint To Think Logo"
            className="absolute inset-0"
            style={{ width: size, height: size }}
          />
        )}
      </div>
    </div>
  )
}
