# Meertaligheid Setup

Deze Next.js website ondersteunt nu meertaligheid op basis van domein. De site detecteert automatisch de taal op basis van het domein:

- `.nl` domein → Nederlands
- `.se` domein → Zweeds

## Hoe het werkt

### 1. Middleware Detectie
De middleware (`middleware.ts`) detecteert het domein en stelt de locale in via een header:

```typescript
const host = request.headers.get('host') || ''
let locale = 'nl' // Default naar Nederlands

if (host.endsWith('.se')) {
  locale = 'sv' // Zweeds voor .se domeinen
} else if (host.endsWith('.nl')) {
  locale = 'nl' // Nederlands voor .nl domeinen
}

response.headers.set('x-locale', locale)
```

### 2. Vertaalbestanden
Vertalingen worden opgeslagen in JSON bestanden:
- `/locales/nl.json` - Nederlandse vertalingen
- `/locales/sv.json` - Zweedse vertalingen

### 3. Server-side Rendering
Vertalingen worden server-side geladen voor optimale SEO:

```typescript
import { getTranslations, getLocale, useTranslation } from '@/lib/i18n';

export default async function MyPage() {
  const translations = await getTranslations();
  const locale = await getLocale();
  const { t } = useTranslation(translations);

  return (
    <div>
      <h1>{t('seo.title')}</h1>
      <p>{t('common.loading')}</p>
    </div>
  );
}
```

## Gebruik in Componenten

### Server Components
Voor server components gebruik je de async functies:

```typescript
const translations = await getTranslations();
const locale = await getLocale();
const { t } = useTranslation(translations);
```

### Client Components
Voor client components ontvang je translations als props:

```typescript
interface MyComponentProps {
  translations: Translations;
  locale: Locale;
}

export default function MyComponent({ translations, locale }: MyComponentProps) {
  const { t } = useTranslation(translations);
  
  return <button>{t('common.cart')}</button>;
}
```

## Vertalingen Toevoegen

### 1. Voeg nieuwe keys toe aan beide JSON bestanden:

`/locales/nl.json`:
```json
{
  "newSection": {
    "title": "Nieuwe Sectie",
    "description": "Beschrijving in het Nederlands"
  }
}
```

`/locales/sv.json`:
```json
{
  "newSection": {
    "title": "Ny Sektion",
    "description": "Beskrivning på svenska"
  }
}
```

### 2. Gebruik de vertaling in je component:
```typescript
<h2>{t('newSection.title')}</h2>
<p>{t('newSection.description')}</p>
```

## SEO Optimalisatie

De metadata wordt automatisch aangepast op basis van de locale:

- HTML lang attribute
- OpenGraph locale
- Meta descriptions in de juiste taal
- Canonical URLs per domein

## Testen

### Lokaal testen:
1. Voeg deze entries toe aan je `/etc/hosts` file:
   ```
   127.0.0.1 deskna.nl
   127.0.0.1 deskna.se
   ```

2. Start de development server:
   ```bash
   npm run dev
   ```

3. Bezoek:
   - http://deskna.nl:3000 voor Nederlands
   - http://deskna.se:3000 voor Zweeds

### Productie:
De site detecteert automatisch het domein en toont de juiste taal.

## Belangrijke Notities

1. **Fallback**: Als een vertaling ontbreekt, wordt de key getoond als fallback
2. **Performance**: Vertalingen worden server-side geladen en gecached
3. **Type Safety**: TypeScript types zijn beschikbaar via `Translations` en `Locale`
4. **Nieuwe talen**: Om een nieuwe taal toe te voegen:
   - Maak een nieuw JSON bestand in `/locales/`
   - Update de middleware om het nieuwe domein te detecteren
   - Update de `translations` object in `/lib/i18n.ts`

## Componenten die al zijn aangepast

- ✅ Root Layout (metadata)
- ✅ Header (basis navigatie items)
- ✅ Middleware (domein detectie)
- ❌ Footer (moet nog worden aangepast)
- ❌ Cart (moet nog worden aangepast)
- ❌ Product pages (moet nog worden aangepast)
- ❌ Checkout flow (moet nog worden aangepast)

Voor een volledig werkende meertalige site moeten alle componenten worden aangepast om de `translations` prop te accepteren en gebruiken.

