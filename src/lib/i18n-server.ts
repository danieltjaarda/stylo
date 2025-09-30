import { headers } from 'next/headers'
import { translations, type Locale, type Translations } from './i18n-shared'

export async function getLocale(): Promise<Locale> {
  const headersList = await headers()
  
  // Probeer eerst de x-locale header (gezet door middleware)
  const localeHeader = headersList.get('x-locale') as Locale | null
  if (localeHeader && (localeHeader === 'nl' || localeHeader === 'sv')) {
    console.log('✅ Using locale from x-locale header:', localeHeader)
    return localeHeader
  }
  
  // Als fallback, check de referer voor ?lang=sv of ?lang=nl
  const referer = headersList.get('referer') || ''
  if (referer.includes('?lang=sv') || referer.includes('&lang=sv')) {
    console.log('✅ Using locale from referer URL param: sv')
    return 'sv'
  }
  if (referer.includes('?lang=nl') || referer.includes('&lang=nl')) {
    console.log('✅ Using locale from referer URL param: nl')
    return 'nl'
  }
  
  // Check de x-url header voor search params (alternatieve methode)
  const url = headersList.get('x-url') || ''
  if (url.includes('?lang=sv') || url.includes('&lang=sv')) {
    console.log('✅ Using locale from x-url header: sv')
    return 'sv'
  }
  
  // Als laatste fallback, check de host header direct
  const host = headersList.get('host') || ''
  if (host.endsWith('.se') || host.includes('deskna.se')) {
    console.log('✅ Using locale from .se domain: sv')
    return 'sv'
  }
  
  console.log('ℹ️ Using default locale: nl')
  return 'nl'
}

export async function getTranslations(): Promise<Translations> {
  const locale = await getLocale()
  return translations[locale]
}

export { type Locale, type Translations } from './i18n-shared'
export { useTranslation } from './i18n-shared'
