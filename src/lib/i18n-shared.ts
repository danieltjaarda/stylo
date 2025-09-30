import nlTranslations from '../../locales/nl.json'
import svTranslations from '../../locales/sv.json'

export type Locale = 'nl' | 'sv'
export type Translations = typeof nlTranslations

export const translations: Record<Locale, Translations> = {
  nl: nlTranslations,
  sv: svTranslations
}

// Helper functie om een specifieke vertaling op te halen met dot notation
export function getTranslation(translations: Translations, path: string, params?: Record<string, any>): string {
  const keys = path.split('.')
  let result: any = translations
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key]
    } else {
      return path // Return de key als fallback
    }
  }
  
  let text = typeof result === 'string' ? result : path
  
  // Replace parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      text = text.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
    })
  }
  
  return text
}

// Type-safe helper voor het ophalen van vertalingen
export function useTranslation(translations: Translations) {
  return {
    t: (path: string, params?: Record<string, any>) => getTranslation(translations, path, params),
    translations
  }
}
