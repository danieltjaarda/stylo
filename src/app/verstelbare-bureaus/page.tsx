import VerstelbareBureausClient from './VerstelbareBureausClient';
import { getTranslations, getLocale } from '@/lib/i18n-server';

export default async function VerstelbareBureausPage() {
  const translations = await getTranslations();
  const locale = await getLocale();
  
  return <VerstelbareBureausClient translations={translations} locale={locale} />;
}