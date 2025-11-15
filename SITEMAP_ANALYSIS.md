# DESKNA Webshop - Sitemap & URL Structuur Analyse

## 📊 Visuele Sitemap Overzicht

```
deskna.nl/
│
├── 🏠 Homepage (/)
│   └── Priority: Zeer hoog | Frequentie: Dagelijks
│
├── 🛍️ PRODUCT CATEGORIEËN
│   ├── /bureaustoelen
│   │   └── Ergonomische bureaustoelen voor kantoor & thuis
│   │   └── Priority: Zeer hoog | SEO: ✅ Excellent
│   │
│   ├── /verstelbare-bureaus
│   │   └── Elektrische zit-sta bureaus
│   │   └── Priority: Zeer hoog | SEO: ✅ Excellent
│   │
│   ├── /shop-alles
│   │   └── Complete productcatalogus
│   │   └── Priority: Zeer hoog
│   │
│   ├── /products
│   │   └── Producten overzicht
│   │   └── Priority: Hoog
│   │
│   ├── /products/[id]
│   │   └── Individuele productpagina's (dynamisch)
│   │   └── Priority: Hoog | SEO: ✅ Met schema.org markup
│   │
│   └── /collections/[handle]
│       └── Dynamische collecties van Shopify
│       └── Priority: Hoog
│
├── 📝 CONTENT & INFORMATIE
│   ├── /blog
│   │   └── Blog overzicht
│   │   └── Priority: Gemiddeld | Frequentie: Wekelijks
│   │
│   ├── /blog/[id]
│   │   └── Individuele blog posts (dynamisch)
│   │   └── Priority: Gemiddeld
│   │
│   ├── /over-ons
│   │   └── Over DESKNA - bedrijfsinfo, team, missie
│   │   └── Priority: Gemiddeld | SEO: ✅ Goed
│   │
│   ├── /contact
│   │   └── Contactformulier en informatie
│   │   └── Priority: Gemiddeld
│   │
│   ├── /b2b
│   │   └── Zakelijke klanten & groothandel
│   │   └── Priority: Gemiddeld
│   │
│   ├── /quiz
│   │   └── Werkplek advies quiz
│   │   └── Priority: Laag-gemiddeld
│   │
│   ├── /vergelijking
│   │   └── Product vergelijking tool
│   │   └── Priority: Laag-gemiddeld
│   │
│   └── /kortingen
│       └── Acties en kortingen
│       └── Priority: Hoog | Frequentie: Dagelijks
│
├── 🛒 CHECKOUT & ORDERS
│   ├── /checkout
│   │   └── Winkelwagen & betaling
│   │   └── SEO: ⚠️ Noindex (correct)
│   │
│   └── /order-confirmation
│       └── Orderbevestiging
│       └── SEO: ⚠️ Noindex (correct)
│
├── ℹ️ LEGAL & BELEID
│   ├── /privacy
│   │   └── Privacybeleid
│   │   └── Priority: Laag | Frequentie: Jaarlijks
│   │
│   ├── /terms
│   │   └── Algemene voorwaarden
│   │   └── Priority: Laag
│   │
│   ├── /shipping
│   │   └── Verzending & levering
│   │   └── Priority: Laag-gemiddeld
│   │
│   ├── /returns
│   │   └── Retourneren & omruilen
│   │   └── Priority: Laag-gemiddeld
│   │
│   ├── /herroepingsrecht
│   │   └── Herroepingsrecht informatie
│   │   └── Priority: Laag
│   │
│   ├── /colofon
│   │   └── Bedrijfsinformatie
│   │   └── Priority: Laag
│   │
│   └── /montagehandleidingen
│       └── Montage instructies
│       └── Priority: Laag-gemiddeld
│
└── 🔧 API & INTERN (NIET PUBLIEK)
    ├── /api/products
    ├── /api/collections
    ├── /api/google-feed (toegestaan voor Google Merchant)
    ├── /api/klaviyo
    └── /klaviyo-test (development only)
```

## ✅ Sterke Punten van de Huidige URL Structuur

### 1. **Nederlandse URL's** 🇳🇱
- ✅ `/bureaustoelen` - Perfect voor Nederlandse SEO
- ✅ `/verstelbare-bureaus` - Duidelijk en zoekwoordgericht
- ✅ `/over-ons`, `/contact`, `/kortingen` - Gebruiksvriendelijk

### 2. **SEO-Vriendelijke Structuur**
- ✅ Korte, beschrijvende URL's
- ✅ Gebruik van koppeltekens (hyphens) in plaats van underscores
- ✅ Geen onnodige parameters of tracking codes
- ✅ Logische hiërarchie met breadcrumbs

### 3. **Technische Implementatie**
- ✅ Next.js App Router gebruikt
- ✅ Metadata correct geïmplementeerd per pagina
- ✅ Canonical URLs via metadataBase
- ✅ Structured data (Schema.org) op product en FAQ pagina's
- ✅ robots.txt correct geconfigureerd

### 4. **Gebruikerservaring**
- ✅ Duidelijke breadcrumb navigatie
- ✅ Logische categoriestructuur
- ✅ Consistente naamgeving

## ⚠️ Aanbevelingen voor Verbetering

### 1. **Metadata Optimalisatie**

#### Probleem: Niet alle pagina's hebben geoptimaliseerde metadata
**Oplossing:** Voeg metadata toe aan elke pagina

```typescript
// Voorbeeld voor /quiz/page.tsx
export const metadata: Metadata = {
  title: "Werkplek Advies Quiz - Vind Jouw Perfecte Bureaustoel | DESKNA",
  description: "Doe de gratis werkplek quiz en ontdek welke ergonomische bureaustoel en bureau perfect bij jouw situatie passen. Persoonlijk advies in 2 minuten.",
  openGraph: {
    title: "Vind Jouw Perfecte Werkplek Setup",
    description: "Gratis advies quiz voor ergonomische bureaustoelen en bureaus",
    type: "website",
  }
};
```

### 2. **URL Structuur Verbeteringen**

#### A. Overweeg consistentere naamgeving:
- ❓ `/shop-alles` → Overweeg `/producten` of `/webshop`
- ❓ `/verstelbare-bureaus` → Is goed, maar zorg voor consistentie met andere categorieën

#### B. Voeg breadcrumbs schema markup toe:
```typescript
// In elke pagina met breadcrumbs
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://deskna.nl"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Bureaustoelen",
      "item": "https://deskna.nl/bureaustoelen"
    }
  ]
};
```

### 3. **Dynamische Sitemap Generatie**

#### Probleem: Sitemap is statisch en mist product/blog pagina's
**Oplossing:** Maak een dynamische sitemap generator

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const products = await getShopifyProducts();
  const blogs = await getBlogPosts();
  
  return [
    {
      url: 'https://deskna.nl',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // ... statische pagina's
    ...products.map((product) => ({
      url: `https://deskna.nl/products/${product.handle}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...blogs.map((blog) => ({
      url: `https://deskna.nl/blog/${blog.slug}`,
      lastModified: blog.publishedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
  ];
}
```

### 4. **Missing Pages / Aanbevolen Toevoegingen**

Overweeg deze pagina's toe te voegen voor betere SEO:
- `/showroom` - Voor fysieke locatie (als van toepassing)
- `/garantie` - Specifieke garantie informatie
- `/veelgestelde-vragen` of `/faq` - Centrale FAQ pagina
- `/reviews` of `/beoordelingen` - Klantenreviews overzicht
- `/inspiratie` - Werkplek inspiratie foto's

### 5. **Interne Linking Optimalisatie**

#### Aanbevelingen:
- ✅ Voeg "Gerelateerde Producten" sectie toe op productpagina's
- ✅ Link van blog posts naar relevante producten
- ✅ Voeg "Populaire Producten" toe in footer
- ✅ Cross-linking tussen `/bureaustoelen` en `/verstelbare-bureaus`

### 6. **URL Parameters & Filters**

Voor toekomstige functionaliteit, overweeg:
- `/bureaustoelen?kleur=zwart&prijs=200-400` (met canonical naar hoofdpagina)
- `/verstelbare-bureaus?maat=120x80` (met canonical naar hoofdpagina)

⚠️ **Belangrijk:** Gebruik altijd canonical tags bij gefilterde URL's om duplicate content te voorkomen!

## 📈 SEO Checklist

### ✅ Al Geïmplementeerd:
- [x] Nederlandse URL's
- [x] SSL certificaat (https)
- [x] Robots.txt
- [x] Sitemap.xml (basis versie)
- [x] Metadata op hoofdpagina
- [x] Structured data (Schema.org) op sommige pagina's
- [x] Open Graph tags
- [x] Breadcrumbs
- [x] Canonical URLs

### 🔄 Te Implementeren:
- [ ] Dynamische sitemap met alle producten
- [ ] Metadata op ALLE pagina's
- [ ] Breadcrumb schema markup
- [ ] Product schema markup op alle productpagina's
- [ ] Review schema markup
- [ ] Organization schema markup (global)
- [ ] WebSite schema markup met sitelinks search box
- [ ] Image alt tags optimalisatie
- [ ] Internal linking strategie
- [ ] XML sitemap index voor grote catalogi

## 🎯 Prioriteiten

### 🔴 Hoge Prioriteit (Direct Implementeren)
1. ✅ Dynamische sitemap generatie
2. ✅ Metadata toevoegen aan alle pagina's
3. ✅ Product schema markup verbeteren
4. ✅ Breadcrumb schema markup

### 🟡 Gemiddelde Prioriteit (Binnen 1 maand)
1. FAQ/Veelgestelde vragen centrale pagina
2. Review aggregatie pagina
3. Interne linking strategie
4. Image optimization & alt tags

### 🟢 Lage Prioriteit (Nice to have)
1. Filter functionaliteit met SEO-vriendelijke URL's
2. Inspiratie/voorbeelden pagina
3. Uitgebreide blog sectie
4. Video content integratie

## 🔍 Technische SEO Aanbevelingen

### 1. **Page Speed**
- ✅ Next.js Image component gebruikt (goed!)
- ✅ Turbopack voor snellere development
- ⚠️ Overweeg lazy loading voor videos
- ⚠️ Optimaliseer Lottie animaties (conditional loading)

### 2. **Mobile-First**
- ✅ Responsive design geïmplementeerd
- ✅ Touch-friendly UI elementen
- ⚠️ Test Core Web Vitals op mobiel

### 3. **Security Headers**
- ✅ X-Frame-Options geïmplementeerd
- ✅ X-Content-Type-Options geïmplementeerd
- ✅ Referrer-Policy geïmplementeerd
- ✅ Permissions-Policy geïmplementeerd

## 📊 URL Structuur Score

| Categorie | Score | Opmerking |
|-----------|-------|-----------|
| **Gebruiksvriendelijkheid** | 9/10 | Duidelijke, Nederlandse URL's |
| **SEO Optimalisatie** | 7/10 | Goede basis, metadata kan beter |
| **Technische Implementatie** | 8/10 | Next.js best practices gevolgd |
| **Schaalbaarheid** | 8/10 | Goed voorbereid voor groei |
| **Interne Linking** | 6/10 | Kan verbeterd worden |
| **Schema Markup** | 7/10 | Gedeeltelijk geïmplementeerd |
| **Overall** | **7.5/10** | Sterke basis met verbeterpotentieel |

## 🎓 Best Practices Gevolgd

1. ✅ **Korte, beschrijvende URL's** - Gemiddeld 2-3 woorden
2. ✅ **Koppeltekens gebruikt** - In plaats van underscores
3. ✅ **Kleine letters** - Consistent door hele site
4. ✅ **Geen stopwoorden** - Geen "de", "het", "een" in URL's
5. ✅ **Logische hiërarchie** - Duidelijke parent-child relaties
6. ✅ **Nederlands** - Perfect voor Nederlandse doelgroep
7. ✅ **HTTPS** - Veilige verbinding

## 🚀 Volgende Stappen

1. **Week 1-2:**
   - Implementeer dynamische sitemap
   - Voeg metadata toe aan alle pagina's
   - Implementeer breadcrumb schema

2. **Week 3-4:**
   - Verbeter product schema markup
   - Optimaliseer interne linking
   - Voeg FAQ pagina toe

3. **Maand 2:**
   - Image SEO optimalisatie
   - Performance optimalisatie
   - A/B testen van URL structuren

## 📞 Vragen?

Dit document is een complete analyse van de huidige URL structuur. Voor implementatie hulp of vragen, neem contact op met het development team.

---

**Laatst bijgewerkt:** 3 november 2025  
**Versie:** 1.0  
**Auteur:** DESKNA Development Team






