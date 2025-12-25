import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ServiceCard } from '../components/ServiceCard'
import { BottomSheet } from '../components/BottomSheet'
import { ProgressLoader } from '../components/ProgressLoader'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/Accordion'
import { useToast } from '../contexts/ToastContext'
import { copyEmailToClipboard } from '../utils/clipboard'
import { useConfig } from '../hooks/useConfig'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import enTranslations from '../translations/en.json'
import ruTranslations from '../translations/ru.json'
import defaultConfigData from '../config/site.config.json'

export function HomePage() {
  const [selectedService, setSelectedService] = useState(null)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const toast = useToast()
  const siteConfig = useConfig()
  const { t, language } = useTranslation()
  
  // Get FAQ items directly from translations
  const faqItems = (language === 'ru' 
    ? ruTranslations?.faq?.items
    : enTranslations?.faq?.items) || []
  
  // Debug: Log config to see what's loading
  useEffect(() => {
    console.log('Site Config:', siteConfig)
    console.log('Services:', siteConfig?.services)
  }, [siteConfig])
  
  // Demo progress animation - optimized with requestAnimationFrame
  useEffect(() => {
    let rafId
    let startTime = null
    const duration = 3000 // 3 seconds
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progressValue = Math.min((elapsed / duration) * 100, 100)
      
      setProgress(progressValue)
      
      if (progressValue < 100) {
        rafId = requestAnimationFrame(animate)
      }
    }
    
    rafId = requestAnimationFrame(animate)
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="min-h-screen pb-28 lg:pl-28">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-[104px] pt-24 pb-16">
        <div className="flex justify-start mb-12">
          <ProgressLoader progress={progress} size={72} />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.6, 0.2, 1] }}
          className="text-4xl sm:text-5xl lg:text-7xl font-semibold leading-tight"
        >
          {t('site.tagline')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.6, 0.2, 1] }}
          className="text-lg leading-relaxed text-muted-foreground"
        >
          {t('site.tag')}
        </motion.p>
      </section>

      {/* Services Grid - Force render with defaultConfigData */}
      <section className="max-w-7xl mx-auto px-[104px] pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {defaultConfigData.services.map((service, index) => (
            <ServiceCard
              key={service.id || `service-${index}`}
              service={service}
              index={index}
              onClick={setSelectedService}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-3xl mx-auto px-[104px] py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.6, 0.2, 1] }}
          viewport={{ once: true }}
        >
          <p className="text-lg leading-relaxed text-muted-foreground mb-8">
            {t('about.content')}
          </p>
          <button
            onClick={() => navigate('/about')}
            className="text-lg font-medium hover:underline"
          >
            {t('common.more')}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.6, 0.2, 1] }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <p className="text-muted-foreground mb-4">
            {t('common.bookNow')}
          </p>
          <a
            href={`tel:${t('site.phone')}`}
            className="text-2xl sm:text-4xl lg:text-5xl font-semibold hover:opacity-80 transition-opacity cursor-pointer select-none block"
          >
            {t('site.phone')}
          </a>
        </motion.div>
      </section>

      {/* FAQ Section - Simplified for now to fix videos */}
      <section className="max-w-4xl mx-auto px-[104px] py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.6, 0.2, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-semibold mb-12 text-center">
            {t('faq.title')}
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  <p className="mb-3">{item.answer}</p>
                  {item.citation && (
                    <blockquote className="border-l-2 border-accent pl-4 mt-3 italic text-sm opacity-80">
                      {item.citation}
                      {item.lawUrl && item.lawCode && (
                        <> — <a 
                          href={item.lawUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="underline hover:text-accent transition-colors font-medium not-italic"
                        >
                          {item.lawCode}
                        </a></>
                      )}
                    </blockquote>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* Service Detail Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService ? (t(`services.${selectedService.id}.title`) || selectedService.title) : ''}
      >
        {selectedService && (
          <div>
            <video
              src={selectedService.video}
              className="w-full h-64 object-cover rounded-xl mb-6"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
            <p className="text-lg leading-relaxed">
              {t(`services.${selectedService.id}.details`) || selectedService.details}
            </p>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
