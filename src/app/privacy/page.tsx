import PrivacyClient from './PrivacyClient';
import { Metadata } from 'next';
import { getTranslations, getLocale } from '@/lib/i18n-server';
import { getTranslation } from '@/lib/i18n-shared';

export async function generateMetadata(): Promise<Metadata> {
  const translations = await getTranslations();
  
  return {
    title: getTranslation(translations, 'privacy.metadata.title'),
    description: getTranslation(translations, 'privacy.metadata.description'),
  };
}

export default async function PrivacyPage() {
  const translations = await getTranslations();
  const locale = await getLocale();
  
  return <PrivacyClient translations={translations} locale={locale} />;
}
