# Klaviyo Configuration Setup

## 🚨 Huidige Status: Demo Mode

Je newsletter signup werkt momenteel in **demo mode** omdat de Klaviyo configuratie ontbreekt. De kortingscode functionaliteit werkt wel, maar emails worden niet verstuurd via Klaviyo.

## ⚡ Quick Fix

Maak een `.env.local` bestand in de webshop root directory:

```bash
# In /webshop/.env.local
KLAVIYO_PRIVATE_API_KEY=pk_live_your_actual_key_here
KLAVIYO_NEWSLETTER_LIST_ID=XyZ123
KLAVIYO_DOUBLE_OPT_IN=false
```

## 📋 Stap-voor-stap Setup

### 1. Klaviyo Account Setup
1. Ga naar [Klaviyo](https://www.klaviyo.com) en log in
2. Navigeer naar **Account Settings** → **API Keys**
3. Kopieer je **Private API Key** (begint met `pk_live_` of `pk_test_`)

### 2. Newsletter List ID Vinden
1. Ga naar **Lists & Segments** in Klaviyo
2. Selecteer je hoofdnieuwsbrief lijst (of maak er een)
3. Kopieer de List ID uit de URL: `https://www.klaviyo.com/lists/LISTID/overview`

### 3. Environment File Aanmaken

Maak `.env.local` in de webshop directory:

```env
# Shopify (als je die ook gebruikt)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=jouw-winkel.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=jouw_storefront_token

# Klaviyo (VEREIST voor email marketing)
KLAVIYO_PRIVATE_API_KEY=pk_live_jouw_echte_key_hier
KLAVIYO_NEWSLETTER_LIST_ID=jouw_lijst_id_hier
KLAVIYO_DOUBLE_OPT_IN=false
```

### 4. Server Herstarten
```bash
# Stop de server (Ctrl+C)
# Start opnieuw
npm run dev
```

## ✅ Verificatie

Na configuratie zou je moeten zien:
- ✅ "Successfully subscribed to newsletter" in plaats van demo mode
- ✅ Profielen verschijnen in je Klaviyo lijst
- ✅ "Discount Code Generated" events in Klaviyo

## 🔧 Geavanceerde Opties

### Double Opt-In Inschakelen
```env
KLAVIYO_DOUBLE_OPT_IN=true
```

Dit zorgt ervoor dat:
- Gebruikers krijgen een bevestigingsmail
- Subscription status = "pending" tot ze klikken
- GDPR-compliant opt-in proces

### Meerdere Lijsten
Je kunt verschillende lijsten gebruiken:
```javascript
// In je code
subscribeToKlaviyo(email, 'SPECIALE_LIJST_ID')
```

## 🚨 Troubleshooting

### Error: "Newsletter list not configured"
- ✅ Controleer `KLAVIYO_NEWSLETTER_LIST_ID` in .env.local
- ✅ Verificeer dat de List ID correct is gekopieerd

### Error: "Klaviyo not configured" 
- ✅ Controleer `KLAVIYO_PRIVATE_API_KEY` in .env.local
- ✅ Zorg dat de key begint met `pk_live_` of `pk_test_`

### Profielen verschijnen niet in Klaviyo
- ✅ Wacht 1-2 minuten (API sync delay)
- ✅ Check Console logs voor API errors
- ✅ Verificeer API key permissions in Klaviyo

## 📊 Wat er gebeurt na configuratie

1. **Profile Creation**: Gebruikt wordt toegevoegd aan Klaviyo met GDPR consent
2. **List Subscription**: Profile wordt toegevoegd aan newsletter lijst  
3. **Event Tracking**: "Discount Code Generated" event voor email flows
4. **Discount Email**: Automatisch via Klaviyo flow (optioneel)

## 🎯 Email Flow Setup (Optioneel)

Na configuratie kun je in Klaviyo een Flow maken:

**Trigger**: Metric "Discount Code Generated"
**Email Template**: Gebruik `klaviyo-discount-email-template.html` 
**Personalization**: `{{ event.discount_code }}` en `{{ event.expires_at }}`

Dit zorgt voor automatische kortingsemails! 🚀
