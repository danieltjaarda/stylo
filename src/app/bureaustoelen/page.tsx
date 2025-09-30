import BureauStoelenClient from './BureauStoelenClient';
import { getTranslations, getLocale } from '@/lib/i18n-server';

export default async function BureauStoelenPage() {
  const translations = await getTranslations();
  const locale = await getLocale();
  
  return <BureauStoelenClient translations={translations} locale={locale} />;
}