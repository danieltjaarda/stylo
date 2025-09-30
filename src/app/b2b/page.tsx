import B2BClient from './B2BClient';
import { Metadata } from 'next';
import { getTranslations, getLocale } from '@/lib/i18n-server';
import { getTranslation } from '@/lib/i18n-shared';

export async function generateMetadata(): Promise<Metadata> {
  const translations = await getTranslations();
  
  return {
    title: getTranslation(translations, 'b2b.metadata.title'),
    description: getTranslation(translations, 'b2b.metadata.description'),
  };
}

export default async function B2BPage() {
  const translations = await getTranslations();
  const locale = await getLocale();
  
  return <B2BClient translations={translations} locale={locale} />;
}