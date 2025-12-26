import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const languages = ['en', 'ru'] // 2 languages: English, Russian
  
  const [language, setLanguage] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('language')
    if (saved && languages.includes(saved)) {
      return saved
    }
    // Migrate 'uk' (Ukrainian) to 'ru' (Russian) if found
    if (saved === 'uk') {
      localStorage.setItem('language', 'ru')
      return 'ru'
    }
    
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage
    if (browserLang.startsWith('ru')) {
      return 'ru'
    }
    
    // Default to English
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => {
      const currentIndex = languages.indexOf(prev)
      const nextIndex = (currentIndex + 1) % languages.length
      return languages[nextIndex]
    })
  }

  const setLanguageDirect = (lang) => {
    if (languages.includes(lang)) {
      setLanguage(lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage: setLanguageDirect }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

