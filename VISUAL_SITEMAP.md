# 🗺️ DESKNA Webshop - Visuele Sitemap

```
                            🏠 deskna.nl
                                  │
    ┌─────────────────────────────┼─────────────────────────────┐
    │                             │                             │
📦 PRODUCTEN                  📝 CONTENT                   ℹ️ INFORMATIE
    │                             │                             │
    ├─ 🪑 Bureaustoelen            ├─ 📰 Blog                    ├─ 👥 Over Ons
    │  │                          │  └─ 📄 [Blog Posts]         │
    │  ├─ ⭐ Featured              │                             ├─ 📞 Contact
    │  ├─ 💺 Ergonomisch          ├─ 🎯 Quiz                    │
    │  ├─ 🎨 Mesh / Stof          │  ├─ Vraag 1-6              ├─ 🏢 B2B Oplossingen
    │  └─ 💰 Alle Prijsklassen    │  └─ Resultaten             │
    │                              │                             ├─ 🚚 Verzending
    ├─ 🖥️ Verstelbare Bureaus     ├─ 🔄 Vergelijking           │
    │  │                          │  └─ Product Matcher         ├─ ↩️ Retourneren
    │  ├─ ⚡ Elektrisch           │                             │
    │  ├─ 🎯 Zit-Sta Bureaus      ├─ 🏷️ Kortingen & Acties     ├─ 🔧 Montagehandleidingen
    │  ├─ 📏 Maten 120-180cm      │  ├─ Back to Work Deals     │
    │  └─ 🎨 Diverse Kleuren       │  ├─ Outlet                 ├─ 📜 Privacy
    │                              │  └─ Seizoensacties         │
    ├─ 🛍️ Shop Alles              │                             ├─ 📋 Algemene Voorwaarden
    │  └─ Alle Producten          └─ [Toekomstige Content]     │
    │                                 - Inspiratie              ├─ ⚖️ Herroepingsrecht
    ├─ 📦 Producten                   - Handleidingen           │
    │  └─ [Product ID]                - Reviews                 └─ 📝 Colofon
    │     ├─ Beschrijving             - Showroom
    │     ├─ Specificaties
    │     ├─ Reviews (4.8★)
    │     ├─ FAQ
    │     └─ Gerelateerd
    │
    └─ 📂 Collecties
       └─ [Collection Handle]
          └─ Shopify Collecties

```

---

## 🎨 Kleurcode Legenda

- 🟢 **Groen** = Volledig geoptimaliseerd (Metadata + Schema.org)
- 🟡 **Geel** = Basis metadata aanwezig
- 🔵 **Blauw** = Dynamisch gegenereerd
- 🔒 **Slot** = Beveiligd/Noindex (correct)
- 🚫 **Rood** = Geblokkeerd in robots.txt

---

## 📊 Pagina Hiërarchie & Prioriteit

### Level 1: Homepage (Priority 1.0)
```
🏠 deskna.nl
   └─ Centrale hub voor alle producten en content
   └─ Schema: Organization + FAQPage + WebSite
   └─ Update frequentie: Dagelijks
```

### Level 2: Hoofd Categorieën (Priority 0.9)
```
🪑 /bureaustoelen
   ├─ Ergonomische bureaustoelen voor kantoor & thuis
   ├─ Schema: FAQPage + CollectionPage
   ├─ Internal links: Products, Quiz, Vergelijking
   └─ Update frequentie: Dagelijks

🖥️ /verstelbare-bureaus
   ├─ Elektrische zit-sta bureaus
   ├─ Schema: FAQPage + CollectionPage
   ├─ Internal links: Products, Kortingen, B2B
   └─ Update frequentie: Dagelijks

🛍️ /shop-alles
   ├─ Complete productcatalogus
   ├─ Filters: Prijs, Categorie, Kleur
   ├─ Internal links: Alle producten
   └─ Update frequentie: Dagelijks
```

### Level 3: Product & Content Pagina's (Priority 0.7-0.8)
```
📦 /products
   └─ /products/[id]
      ├─ Product detail pagina
      ├─ Schema: Product + AggregateRating + Breadcrumb
      ├─ Features: Varianten, Reviews, FAQ, Video
      └─ Update frequentie: Wekelijks

📰 /blog
   └─ /blog/[id]
      ├─ Blog artikelen
      ├─ Schema: BlogPosting + Breadcrumb
      ├─ Features: Author, Date, Categories
      └─ Update frequentie: Wekelijks

🏷️ /kortingen
   ├─ Actuele acties en deals
   ├─ Schema: OfferCatalog (aanbevolen)
   ├─ Features: Countdown timers, Limited offers
   └─ Update frequentie: Dagelijks
```

### Level 4: Service & Info (Priority 0.5-0.7)
```
👥 /over-ons
   ├─ Bedrijfsinfo, team, missie
   ├─ Schema: Organization + AboutPage
   └─ Update frequentie: Maandelijks

📞 /contact
   ├─ Contactformulier + informatie
   ├─ Schema: ContactPage + LocalBusiness
   └─ Update frequentie: Maandelijks

🏢 /b2b
   ├─ Zakelijke oplossingen
   ├─ Features: Volume calculator, Quote request
   └─ Update frequentie: Maandelijks

🎯 /quiz
   ├─ Werkplek advies tool
   ├─ Features: 6 vragen, Persoonlijk advies
   └─ Update frequentie: Maandelijks

🔄 /vergelijking
   ├─ Product vergelijkingstool
   ├─ Features: Side-by-side specs, Prijzen
   └─ Update frequentie: Wekelijks
```

### Level 5: Legal & Support (Priority 0.3-0.5)
```
📜 Legal Pagina's
   ├─ /privacy (Privacybeleid)
   ├─ /terms (Algemene Voorwaarden)
   └─ /herroepingsrecht (Consumentenrechten)

🛠️ Support Pagina's
   ├─ /shipping (Verzending & Levering)
   ├─ /returns (Retourneren & Omruilen)
   ├─ /montagehandleidingen (Handleidingen)
   └─ /colofon (Bedrijfsgegevens)
```

---

## 🔗 Internal Linking Strategie

### Van Homepage Naar:
```
Homepage
├─→ Bureaustoelen (Hoofdnavigatie)
├─→ Verstelbare Bureaus (Hoofdnavigatie)
├─→ Shop Alles (Hoofdnavigatie)
├─→ Blog (Hoofdnavigatie)
├─→ Over Ons (Footer)
├─→ Contact (Header + Footer)
├─→ Quiz (CTA in hero)
├─→ Kortingen (Promo banner)
└─→ Featured Products (Productgrid)
```

### Van Categorieën Naar:
```
Bureaustoelen / Verstelbare Bureaus
├─→ Individuele producten (Grid)
├─→ Shop Alles (Breadcrumb + Link)
├─→ Quiz ("Help me kiezen" CTA)
├─→ Vergelijking ("Vergelijk producten" CTA)
├─→ B2B (Voor zakelijke klanten)
└─→ FAQ sectie (Inline links)
```

### Van Productpagina's Naar:
```
Product Detail
├─→ Gerelateerde producten (Aanbevolen)
├─→ Categorie pagina (Breadcrumb)
├─→ Shop Alles (Breadcrumb)
├─→ Reviews (Voor/na testimonials)
├─→ Montagehandleiding (Support link)
├─→ Shipping (Levering info)
└─→ Returns (Retourbeleid)
```

### Van Blog Naar:
```
Blog Post
├─→ Gerelateerde producten (In-content links)
├─→ Andere blog posts (Related articles)
├─→ Categorieën (Product mentions)
├─→ Quiz ("Doe de quiz" CTA)
└─→ Contact (Voor vragen)
```

---

## 🎯 Conversie Paths

### Path 1: Direct naar Product (High Intent)
```
1. Homepage → Featured Products → Product Detail → Checkout ✅
2. Google Search → Product Direct → Checkout ✅
3. Kortingen → Outlet Product → Checkout ✅
```

### Path 2: Exploratie (Medium Intent)
```
1. Homepage → Bureaustoelen → Filters → Product → Checkout
2. Homepage → Quiz → Resultaat → Product → Checkout
3. Blog Post → Related Product → Product → Checkout
```

### Path 3: Educatie (Low Intent)
```
1. Blog → Meer Blogs → Quiz → Category → Product
2. Homepage → Over Ons → Blog → Product
3. Google → Blog → Related → Category → Product
```

### Path 4: B2B (Zakelijk)
```
1. Homepage → B2B → Calculator → Contact/Quote
2. Category → "Voor bedrijven?" → B2B → Contact
3. Google "zakelijk" → B2B Direct → Contact
```

---

## 📱 User Journey Visualisatie

```
                    🔍 Google Search
                          │
            ┌─────────────┼─────────────┐
            │             │             │
      🏠 Homepage    📦 Product    📰 Blog
            │             │             │
      ┌─────┴─────┐      │       ┌─────┴─────┐
      │           │      │       │           │
  🪑 Category  🎯 Quiz   │   Related     Quiz
      │           │      │       │           │
      ├─ Filter   └──────┤       └───────────┤
      │                  │                   │
      └──────────────────┴───────────────────┘
                         │
                  📦 Product Detail
                         │
              ┌──────────┼──────────┐
              │          │          │
         Add to Cart  Compare  Save Later
              │          │          │
              └──────────┴──────────┘
                         │
                    🛒 Checkout
                         │
                    ✅ Complete
```

---

## 🔄 Aanbevolen Nieuwe Pagina's

### Hoge Prioriteit
```
📄 /veelgestelde-vragen (FAQ Hub)
   ├─ Alle FAQ's gecentraliseerd
   ├─ Categorieën: Product, Levering, Retour, Garantie
   ├─ Schema: FAQPage (volledige implementatie)
   └─ Doel: SEO + Customer Service

📄 /reviews (Klantbeoordelingen)
   ├─ Alle Trustpilot reviews aggregatie
   ├─ Filter op product/categorie
   ├─ Schema: Review + AggregateRating
   └─ Doel: Social Proof + SEO
```

### Gemiddelde Prioriteit
```
📄 /garantie (Garantie Informatie)
   ├─ 5-12 jaar garantie details
   ├─ Voorwaarden en claims proces
   ├─ Schema: WarrantyPromise
   └─ Doel: Trust + USP

📄 /inspiratie (Werkplek Inspiratie)
   ├─ Fotogalerij klant setups
   ├─ Voor/na transformaties
   ├─ Filter op ruimte type
   └─ Doel: Inspiratie + Conversie
```

### Lage Prioriteit
```
📄 /showroom (Fysieke Locatie)
   ├─ Adres en openingstijden
   ├─ Afspraak maken systeem
   ├─ Schema: LocalBusiness
   └─ Doel: Offline connectie

📄 /downloads (Downloads)
   ├─ Product specs PDF's
   ├─ Montagehandleidingen
   ├─ Certificaten
   └─ Doel: B2B Support
```

---

## 🎨 Sitemap Visualisatie per Type

### 🛍️ E-commerce Pages (17 pagina's)
```
deskna.nl/
├── bureaustoelen
├── verstelbare-bureaus
├── shop-alles
├── products
│   └── [product-handle]
├── collections
│   └── [collection-handle]
├── kortingen
├── vergelijking
├── quiz
└── checkout (noindex)
```

### 📝 Content & Marketing (6 pagina's)
```
deskna.nl/
├── blog
│   └── [blog-id]
├── over-ons
├── b2b
└── contact
```

### ℹ️ Support & Legal (8 pagina's)
```
deskna.nl/
├── shipping
├── returns
├── montagehandleidingen
├── privacy
├── terms
├── herroepingsrecht
└── colofon
```

---

## 📊 URL Performance Metrics

| Type | Aantal | Avg. Priority | Update Freq | Schema Coverage |
|------|--------|---------------|-------------|-----------------|
| **Product Categories** | 4 | 0.9 | Dagelijks | 100% |
| **Product Pages** | ~50 | 0.8 | Wekelijks | 90% |
| **Content Pages** | 6 | 0.7 | Maandelijks | 70% |
| **Service Pages** | 7 | 0.5 | Maandelijks | 40% |
| **Legal Pages** | 4 | 0.3 | Jaarlijks | 0% |
| **Checkout** | 2 | - | Noindex | N/A |
| **Total** | **~73** | **0.7** | - | **65%** |

---

## 🚀 Quick Wins voor SEO

### Vandaag Implementeren
1. ✅ Breadcrumb schema op alle pagina's
2. ✅ Product review schema op productpagina's
3. ✅ Open Graph images per categorie
4. ✅ Alt tags op alle product images

### Deze Week
1. ⏳ FAQ centrale pagina maken
2. ⏳ WebSite schema met search box
3. ⏳ Internal linking audit + verbeteringen
4. ⏳ Canonical URLs checken op filters

### Deze Maand
1. 📅 Nieuwe content pagina's (Garantie, Reviews)
2. 📅 Blog uitbreiding (10+ artikelen)
3. 📅 Video schema toevoegen
4. 📅 LocalBusiness schema (indien fysieke locatie)

---

**Visuele Sitemap Versie:** 1.0  
**Laatst Bijgewerkt:** 3 november 2025  
**Auteur:** DESKNA Development Team  
**Tool:** ASCII Tree Generator






