import { useLanguage } from '../contexts/LanguageContext'
import enTranslations from '../translations/en.json'
import ruTranslations from '../translations/ru.json'
import ukTranslations from '../translations/uk.json'

const translations = {
  en: enTranslations,
  ru: ruTranslations,
  uk: ukTranslations
}

export function useTranslation() {
  const { language } = useLanguage()
  
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        // Fallback to English if translation missing
        value = translations.en
        for (const k2 of keys) {
          value = value?.[k2]
        }
        break
      }
    }
    
    return value || key
  }
  
  return { t, language }
}

