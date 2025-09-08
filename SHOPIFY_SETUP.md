# Shopify Integratie Setup

Deze webshop is nu volledig voorbereid voor integratie met Shopify! Volg deze stappen om je Shopify store te koppelen.

## 🚀 Stap 1: Shopify Store Setup

### 1.1 Maak een Shopify Store aan
1. Ga naar [shopify.nl](https://shopify.nl)
2. Start je gratis proefperiode
3. Stel je store in met je bedrijfsgegevens

### 1.2 Krijg je Store Domain
Je store domain ziet er zo uit: `jouw-store-naam.myshopify.com`

## 🔑 Stap 2: API Toegang Configureren

### 2.1 Storefront Access Token
1. Ga naar je Shopify Admin
2. Navigeer naar **Apps and sales channels** > **Develop apps**
3. Klik **Create an app**
4. Geef je app een naam (bijv. "Website Integration")
5. Ga naar **Configuration** tab
6. Onder **Storefront API access**, klik **Configure**
7. Selecteer de volgende permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_collections`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
8. Klik **Save**
9. Ga naar **API credentials** tab
10. Kopieer je **Storefront access token**

### 2.2 Environment Variables
1. Maak een `.env.local` bestand in je project root:

```bash
# Shopify Store Configuration
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=jouw_storefront_access_token_hier
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=jouw-store-naam.myshopify.com

# Optional: Shopify Admin API (voor product management)
SHOPIFY_ADMIN_ACCESS_TOKEN=jouw_admin_access_token_hier
```

## 📦 Stap 3: Producten Toevoegen

### 3.1 Via Shopify Admin
1. Ga naar **Products** in je Shopify Admin
2. Klik **Add product**
3. Voeg productinformatie toe:
   - **Title**: Product naam
   - **Description**: Product beschrijving
   - **Images**: Product afbeeldingen
   - **Pricing**: Prijs en vergelijkingsprijs
   - **Inventory**: Voorraad
   - **Variants**: Kleuren, maten, etc.

### 3.2 Collecties Maken
1. Ga naar **Products** > **Collections**
2. Maak een collectie genaamd **"featured"** voor je homepage producten
3. Voeg je beste producten toe aan deze collectie

## 🎨 Stap 4: Website Aanpassingen

### 4.1 Product Handles
- Shopify gebruikt "handles" (URL-vriendelijke namen) voor producten
- Bijvoorbeeld: "ergonomische-bureaustoel-pro"
- Deze worden automatisch gegenereerd uit de product titel

### 4.2 Collectie Handles
- Voor de homepage "hardlopers" sectie, maak een collectie met handle "featured"
- Of pas de code aan in `src/services/shopifyService.ts` om een andere collectie te gebruiken

## 🛒 Stap 5: Checkout Configureren

### 5.1 Betaalmethoden
1. Ga naar **Settings** > **Payments** in Shopify Admin
2. Configureer je gewenste betaalmethoden:
   - iDEAL (Nederland)
   - Credit Cards
   - PayPal
   - Klarna
   - etc.

### 5.2 Verzending
1. Ga naar **Settings** > **Shipping and delivery**
2. Configureer verzendtarieven voor Nederland/België
3. Stel gratis verzending in vanaf een bepaald bedrag

## 🧪 Stap 6: Testen

### 6.1 Development Testen
1. Start je development server: `npm run dev`
2. Ga naar `http://localhost:3000`
3. Controleer of producten correct worden geladen
4. Test de winkelwagen functionaliteit

### 6.2 Checkout Testen
1. Voeg producten toe aan winkelwagen
2. Ga naar checkout
3. Je wordt doorgeleid naar Shopify's veilige checkout
4. Test met Shopify's test credit card nummers

## 📊 Stap 7: Analytics & Tracking

### 7.1 Google Analytics
1. Ga naar **Online Store** > **Preferences**
2. Voeg je Google Analytics tracking ID toe

### 7.2 Facebook Pixel
1. Installeer Facebook & Instagram app in Shopify
2. Verbind je Facebook Business account

## 🚀 Stap 8: Live Gaan

### 8.1 Domain Koppelen
1. Koop een custom domain
2. Ga naar **Online Store** > **Domains**
3. Verbind je custom domain

### 8.2 SSL Certificaat
- Shopify biedt automatisch SSL certificaten
- Je site is altijd veilig via HTTPS

## 💡 Tips & Best Practices

### Productfoto's
- Gebruik hoge kwaliteit afbeeldingen (minimaal 1024x1024px)
- Consistente achtergrond en stijl
- Meerdere hoeken per product

### SEO Optimalisatie
- Gebruik beschrijvende product titels
- Voeg alt-teksten toe aan afbeeldingen
- Optimaliseer product beschrijvingen voor zoekwoorden

### Performance
- Shopify CDN zorgt voor snelle laadtijden
- Optimaliseer afbeeldingen voor web
- Gebruik WebP formaat waar mogelijk

## 🔧 Troubleshooting

### Producten laden niet?
1. Controleer je API credentials in `.env.local`
2. Zorg dat je app permissions correct zijn ingesteld
3. Controleer de browser console voor error berichten

### Checkout werkt niet?
1. Controleer of checkout permissions zijn ingeschakeld
2. Test met verschillende browsers
3. Controleer Shopify status page voor storingen

### Styling problemen?
1. Producten gebruiken nu Shopify data structuur
2. Controleer of alle velden correct worden weergegeven
3. Pas CSS aan indien nodig

## 📞 Support

Voor vragen over Shopify:
- [Shopify Help Center](https://help.shopify.com)
- [Shopify Community](https://community.shopify.com)
- [Shopify Partners](https://partners.shopify.com)

Voor technische vragen over de integratie:
- Check de console voor error berichten
- Bekijk de Network tab in developer tools
- Controleer API response formats

---

**Succes met je Shopify webshop! 🎉**
