import ContactClient from './ContactClient';
import { Metadata } from 'next';
import { getTranslations, getLocale } from '@/lib/i18n-server';
import { getTranslation } from '@/lib/i18n-shared';

export async function generateMetadata(): Promise<Metadata> {
  const translations = await getTranslations();
  
  return {
    title: getTranslation(translations, 'contact.metadata.title'),
    description: getTranslation(translations, 'contact.metadata.description'),
  };
}

export default async function ContactPage() {
  const translations = await getTranslations();
  const locale = await getLocale();
  
  return <ContactClient translations={translations} locale={locale} />;
}