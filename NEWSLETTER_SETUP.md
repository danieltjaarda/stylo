# Newsletter Signup Setup

## Overview
De newsletter signup functionaliteit is volledig GDPR-compliant en geïntegreerd met Klaviyo. Het systeem ondersteunt double opt-in, idempotency, en automatische kortingscode generatie.

## Features

### ✅ GDPR-Compliant
- **Email marketing consent** wordt correct gezet op 'subscribed' met timestamp
- **IP adres en User Agent** worden opgeslagen voor compliance
- **Consent method** wordt geregistreerd (`popup_signup`)

### ✅ Double Opt-In Support
- Configureerbaar via `KLAVIYO_DOUBLE_OPT_IN` environment variabel
- Wanneer ingeschakeld: subscription status = `pending` tot bevestiging
- Wanneer uitgeschakeld: subscription status = `subscribed` direct

### ✅ Idempotency
- Voorkomt duplicate kortingscodes voor hetzelfde email adres
- In-memory cache (24 uur) - in productie vervangen door Redis/database
- Retourneert bestaande kortingscode bij duplicate requests

### ✅ Server-side Logging
- Alle signups worden gelogd met: `email`, `discount_code`, `expires_at`
- Structured logging voor monitoring en debugging

### ✅ Automatische Kortingscode Generatie
- Crypto-secure random codes: `DESKNA + 6 hex characters`
- 30 dagen geldigheid
- Server-side generatie voor security

## Environment Configuration

```env
# Klaviyo API Key (required)
KLAVIYO_PRIVATE_API_KEY=pk_live_xxxxx

# Newsletter List ID (required)
KLAVIYO_NEWSLETTER_LIST_ID=XyZ123

# Double Opt-In (optional, default: false)
KLAVIYO_DOUBLE_OPT_IN=true
```

## Klaviyo Setup

### 1. Krijg je API credentials
- Ga naar Klaviyo Account Settings > API Keys
- Kopieer je **Private API Key**

### 2. Vind je Newsletter List ID
- Ga naar Lists & Segments
- Selecteer je newsletter lijst
- Kopieer de List ID uit de URL

### 3. Configureer Double Opt-In (optioneel)
- In Klaviyo: List Settings > Subscription Settings
- Zet "Double opt-in" aan/uit zoals gewenst
- Update `KLAVIYO_DOUBLE_OPT_IN` in je .env bestand

### 4. Setup Email Flows

#### A. Kortingscode Email Flow
**Trigger**: Event "Discount Code Generated"
**Template**: Gebruik `klaviyo-discount-email-template.html`
**Personalisatie**: `{{ event.discount_code }}`, `{{ event.expires_at }}`

#### B. Double Opt-In Flow (indien ingeschakeld)
**Trigger**: "Subscribed to List" 
**Condition**: `{{ person.consent_method }}` = "popup_signup"
**Template**: Bevestigings email met opt-in link

## API Response

```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter",
  "profileId": "01HXXX...",
  "discountCode": "DESKNA8A7B2C",
  "expiresAt": "2024-02-15T10:30:00.000Z",
  "subscriptionStatus": "subscribed",
  "doubleOptInEnabled": false,
  "listSubscriptionSuccess": true
}
```

## Frontend Integration

De EmailPopup component is automatisch geüpdatet om:
- Kortingscode van server te ontvangen
- Verschillende berichten te tonen voor DOI
- Kortingscode op te slaan in localStorage
- Idempotency te ondersteunen

## Events in Klaviyo

### Profile Properties
```json
{
  "source": "deskna_newsletter_popup",
  "signup_date": "2024-01-15T10:30:00.000Z",
  "consent_method": "popup_signup",
  "consent_ip": "192.168.1.1",
  "discount_code_generated": "DESKNA8A7B2C",
  "discount_expires_at": "2024-02-15T10:30:00.000Z"
}
```

### Custom Event: "Discount Code Generated"
```json
{
  "discount_percentage": 5,
  "discount_code": "DESKNA8A7B2C",
  "discount_value": "5%",
  "expires_at": "2024-02-15T10:30:00.000Z",
  "newsletter_subscription_status": "subscribed",
  "double_opt_in_enabled": false
}
```

## Testing

1. **Test signup**: Vul email in popup in
2. **Check Klaviyo**: Profiel moet aangemaakt zijn met juiste properties
3. **Test idempotency**: Probeer zelfde email nogmaals
4. **Check logs**: Server logs moeten signup details bevatten

## Production Considerations

- [ ] Vervang in-memory idempotency cache door Redis/database
- [ ] Setup monitoring voor failed Klaviyo API calls  
- [ ] Configureer rate limiting op API endpoints
- [ ] Setup backup logging naar database/file system
- [ ] Test double opt-in flow end-to-end
