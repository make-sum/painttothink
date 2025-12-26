import React from 'react'
import { Languages } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { cn } from '../lib/utils'

export function LanguageToggle({ className }) {
  const { language, toggleLanguage } = useLanguage()
  
  // Language order: en -> ru -> en
  const languages = ['en', 'ru']
  const currentIndex = languages.indexOf(language)
  const nextIndex = (currentIndex + 1) % languages.length
  const nextLanguage = languages[nextIndex]
  
  // Get icon for next language (showing what will be selected next)
  const getNextLanguageIcon = () => {
    switch (nextLanguage) {
      case 'ru':
        return <span className="text-lg font-bold" aria-label="Russian">RU</span>
      case 'en':
      default:
        return <Languages className="h-5 w-5" aria-label="English" />
    }
  }
  
  const getNextLanguageName = () => {
    switch (nextLanguage) {
      case 'ru':
        return 'Russian'
      case 'en':
      default:
        return 'English'
    }
  }

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "p-2 rounded-lg transition-colors",
        "hover:bg-muted",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-foreground",
        "flex items-center gap-2",
        className
      )}
      aria-label={`Switch to ${getNextLanguageName()}`}
      title={`Switch to ${getNextLanguageName()}`}
    >
      {getNextLanguageIcon()}
      <span className="text-xs font-medium uppercase">
        {language.toUpperCase()}
      </span>
    </button>
  )
}

