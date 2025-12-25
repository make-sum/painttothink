import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomSheet } from '../components/BottomSheet'
import { useConfig } from '../hooks/useConfig'
import { useTranslation } from '../hooks/useTranslation'
import defaultConfigData from '../config/site.config.json'

export function AboutPage() {
  const navigate = useNavigate()
  const [isHoveringEmail, setIsHoveringEmail] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const siteConfig = useConfig()
  const { t } = useTranslation()
  
  // Use defaultConfigData services to ensure we have the correct services
  const services = defaultConfigData.services || siteConfig.services || []

  return (
    <BottomSheet
      isOpen={true}
      onClose={() => navigate('/')}
      title={t('about.title')}
    >
      <div className="space-y-8">
        <img src="/img/la.jpg" alt="Los Angeles" className="w-full h-64 object-cover rounded-xl mb-6" />
        <div>
          <h3 className="text-2xl font-semibold mb-4">{t('about.title')}</h3>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('about.content')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-3xl font-semibold">{siteConfig.about.experience}</p>
            <p className="text-sm text-muted-foreground">{t('about.experienceLabel') || 'Experience'}</p>
          </div>
          <div>
            <p className="text-3xl font-semibold">{siteConfig.about.projects}</p>
            <p className="text-sm text-muted-foreground">{t('about.projectsLabel') || 'Projects'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">{t('about.contact')}</h3>
          <div className="space-y-2">
            <p className="text-lg">
              <span className="text-muted-foreground">Email:</span>{' '}
              <a 
                href={`mailto:${siteConfig.site.email}`} 
                className="hover:underline cursor-pointer"
                onMouseEnter={() => setIsHoveringEmail(true)}
                onMouseLeave={() => setIsHoveringEmail(false)}
                onClick={(e) => {
                  e.preventDefault()
                  navigator.clipboard.writeText(siteConfig.site.email)
                  setShowToast(true)
                  setTimeout(() => setShowToast(false), 3000)
                }}
              >
                {isHoveringEmail ? 'Copy' : t('site.email')}
              </a>
            </p>
            <p className="text-lg">
              <span className="text-muted-foreground">Phone:</span>{' '}
              <a href={`tel:${siteConfig.site.phone}`} className="hover:underline">
                {t('site.phone')}
              </a>
            </p>
            <p className="text-lg">
              <span className="text-muted-foreground">Location:</span>{' '}
              {t('site.address')}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">{t('about.services')}</h3>
          <ul className="space-y-2">
            {services.map((service) => {
              // Ensure we use the service.id from the config (service-1, service-2, etc.)
              const serviceId = service.id
              if (!serviceId || !serviceId.startsWith('service-')) {
                // Skip services that don't have the correct ID format
                return null
              }
              // Get translated title using the service ID
              const serviceTitle = t(`services.${serviceId}.title`)
              return (
                <li key={serviceId} className="text-lg text-muted-foreground">
                  • {serviceTitle}
                </li>
              )
            }).filter(Boolean)}
          </ul>
        </div>        
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] bg-foreground text-background px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {t('common.emailCopied')}
        </div>
      )}
    </BottomSheet>
  )
}
