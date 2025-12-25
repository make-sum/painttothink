import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useMediaQuery } from '../hooks/useMediaQuery'

export function BottomSheet({ isOpen, onClose, children, title }) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: "spring",
              damping: 30,
              stiffness: 300
            }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                onClose()
              }
            }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "bg-background rounded-t-3xl shadow-xl",
              "max-h-[90vh] h-auto",
              "md:max-w-2xl md:mx-auto md:mb-8 md:rounded-3xl"
            )}
          >
            {isMobile && (
              <div className="w-12 h-1 bg-muted-foreground/20 rounded-full mx-auto mt-3" />
            )}
            
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
