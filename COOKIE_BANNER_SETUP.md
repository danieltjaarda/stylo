# GDPR Cookie Banner Setup Guide

Deze implementatie biedt een complete GDPR-proof cookie banner voor je Next.js webshop.

## 📁 Bestanden die zijn toegevoegd:

- `src/types/cookies.ts` - TypeScript types voor cookie consent
- `src/contexts/CookieConsentContext.tsx` - React context voor cookie management
- `src/components/CookieBanner.tsx` - Cookie banner component met instellingen dialog
- `src/components/GoogleAnalytics.tsx` - Conditionele Google Analytics component
- `src/components/MetaPixel.tsx` - Conditionele Meta Pixel component
- `src/app/layout.tsx` - Bijgewerkt met cookie provider

## 🚀 Setup Instructies:

### 1. Environment Variables
Voeg deze variabelen toe aan je `.env.local` bestand:

```bash
# Google Analytics (optioneel)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Meta Pixel (optioneel)
NEXT_PUBLIC_META_PIXEL_ID=123456789012345
```

### 2. Dependencies
De volgende packages zijn automatisch geïnstalleerd:
```bash
npm install js-cookie @types/js-cookie
```

## 🎯 Functionaliteiten:

### ✅ GDPR Compliant
- Noodzakelijke cookies altijd actief
- Gebruiker kan statistiek en marketing cookies aan/uitzetten
- Consent wordt opgeslagen voor 365 dagen
- Banner verdwijnt na consent

### 🎨 Modern Design
- Responsive design met TailwindCSS
- Fixed banner onderaan de pagina
- Modal dialog voor gedetailleerde instellingen
- Smooth animations en hover effects

### 🔧 Developer Friendly
- TypeScript support
- React Context voor state management
- Helper hooks voor consent checks
- Conditionele script loading

## 📖 Gebruik in je code:

### Cookie Consent Context gebruiken:
```tsx
import { useCookieConsent } from '@/contexts/CookieConsentContext';

function MyComponent() {
  const { consent, hasConsent, acceptAll } = useCookieConsent();
  
  return (
    <div>
      {hasConsent ? 'Consent gegeven' : 'Nog geen consent'}
    </div>
  );
}
```

### Specifieke consent checks:
```tsx
import { useStatisticsConsent, useMarketingConsent } from '@/contexts/CookieConsentContext';

function AnalyticsComponent() {
  const hasStatisticsConsent = useStatisticsConsent();
  const hasMarketingConsent = useMarketingConsent();
  
  if (hasStatisticsConsent) {
    // Laad analytics scripts
  }
  
  if (hasMarketingConsent) {
    // Laad marketing pixels
  }
}
```

### Google Analytics tracking:
```tsx
import { useGoogleAnalytics } from '@/components/GoogleAnalytics';

function ProductPage() {
  const { trackEvent } = useGoogleAnalytics();
  
  const handlePurchase = () => {
    trackEvent('purchase', 'ecommerce', 'product-123', 99.99);
  };
}
```

### Meta Pixel tracking:
```tsx
import { useMetaPixel } from '@/components/MetaPixel';

function CheckoutPage() {
  const { trackEvent } = useMetaPixel();
  
  const handleAddToCart = () => {
    trackEvent('AddToCart', {
      content_name: 'Product Name',
      content_ids: ['123'],
      content_type: 'product',
      value: 99.99,
      currency: 'EUR'
    });
  };
}
```

## 🛠 Customization:

### Cookie instellingen aanpassen:
Bewerk `src/types/cookies.ts` om de standaard instellingen te wijzigen:

```typescript
export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  statistics: false, // Verander naar true voor standaard opt-in
  marketing: false,  // Verander naar true voor standaard opt-in
  timestamp: Date.now(),
};

export const COOKIE_EXPIRY_DAYS = 365; // Verander de vervaldatum
```

### Styling aanpassen:
De banner gebruikt TailwindCSS. Bewerk `src/components/CookieBanner.tsx` om de styling aan te passen.

### Nieuwe cookie categorieën toevoegen:
1. Voeg nieuwe properties toe aan `CookieConsent` interface in `src/types/cookies.ts`
2. Voeg nieuwe checkboxes toe in `CookieBanner.tsx`
3. Maak nieuwe helper hooks in `CookieConsentContext.tsx`

## 🔒 Privacy & Security:

- Cookies worden secure opgeslagen in productie
- SameSite=lax voor CSRF bescherming
- Geen tracking zonder expliciete consent
- Scripts worden pas geladen na consent
- Gebruiker kan consent altijd intrekken

## 🌐 Internationalisatie:

Om de teksten te vertalen naar andere talen, bewerk de strings in:
- `src/components/CookieBanner.tsx`
- `src/components/GoogleAnalytics.tsx`
- `src/components/MetaPixel.tsx`

## ⚠️ Belangrijke opmerkingen:

1. **Privacy Policy**: Zorg dat je een privacy policy hebt die linkt naar `/privacy`
2. **Legal Compliance**: Deze implementatie helpt met GDPR compliance, maar raadpleeg altijd een juridisch expert
3. **Testing**: Test de implementatie grondig in verschillende browsers
4. **Performance**: Scripts worden alleen geladen bij consent, wat de performance ten goede komt

## 🐛 Troubleshooting:

### Banner verschijnt niet:
- Check of `CookieConsentProvider` correct is geïmporteerd in layout.tsx
- Controleer browser console voor errors
- Zorg dat TailwindCSS correct is geconfigureerd

### Analytics werkt niet:
- Controleer of environment variables correct zijn ingesteld
- Verify dat consent is gegeven voor statistics
- Check browser network tab voor script loading

### Styling problemen:
- Zorg dat alle TailwindCSS classes beschikbaar zijn
- Check of er conflicterende CSS is
- Test op verschillende schermformaten

## 📞 Support:

Voor vragen over deze implementatie, check de code comments of maak een issue aan in je repository.
