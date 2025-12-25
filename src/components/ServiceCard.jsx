import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { LazyVideo } from './LazyVideo'
import { useTranslation } from '../hooks/useTranslation'

export function ServiceCard({ service, index, onClick }) {
  const { t } = useTranslation()
  
  // Get translated service data
  const serviceKey = service.id || `service-${index + 1}`
  const title = t(`services.${serviceKey}.title`) || service.title
  const description = t(`services.${serviceKey}.description`) || service.description
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.2, 0.6, 0.2, 1]
      }}
      className={cn(
        "group cursor-pointer",
        index % 2 === 1 && "md:mt-24 lg:mt-32"
      )}
      onClick={() => onClick(service)}
    >
      <motion.div
        whileHover={{ scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.2, 0.6, 0.2, 1] }}
        className="relative overflow-hidden rounded-3xl aspect-[3/4] bg-muted will-change-transform"
      >
        <LazyVideo
          src={service.video}
          className="w-full h-full"
          autoPlay
          loop
          muted
          playsInline
        />
      </motion.div>
      
      <div className="mt-6 text-center">
        <h3 className="text-xl font-medium text-foreground">
          {title}
        </h3>
        <p className="mt-1 text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.div>
  )
}
