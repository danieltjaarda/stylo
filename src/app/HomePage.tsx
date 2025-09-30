import { getTranslations, getLocale } from '@/lib/i18n-server';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const translations = await getTranslations();
  const locale = await getLocale();
  
  return <HomeClient translations={translations} locale={locale} />;
}
