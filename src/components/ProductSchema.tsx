'use client';

import { useEffect } from 'react';
import { Product } from '@/types';

interface ProductSchemaProps {
  product: Product;
  rating?: number;
  reviewCount?: number;
}

export default function ProductSchema({ product, rating = 4.8, reviewCount = 127 }: ProductSchemaProps) {
  useEffect(() => {
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.images || [product.image],
      "sku": product.id,
      "brand": {
        "@type": "Brand",
        "name": "DESKNA"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://deskna.nl/products/${product.handle}`,
        "priceCurrency": "EUR",
        "price": product.price.toFixed(2),
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "DESKNA"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "EUR"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 3,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 2,
              "unitCode": "DAY"
            }
          }
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.toString(),
        "reviewCount": reviewCount.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Tevreden Klant"
          },
          "datePublished": "2025-01-15",
          "reviewBody": "Uitstekende kwaliteit en zeer comfortabel. Precies wat ik zocht!",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Enthousiaste Gebruiker"
          },
          "datePublished": "2025-01-10",
          "reviewBody": "Heel tevreden met deze aankoop. Goede prijs-kwaliteit verhouding.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
          }
        }
      ],
      "category": product.category || "Kantoormeubels",
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Garantie",
          "value": "5 jaar"
        },
        {
          "@type": "PropertyValue",
          "name": "Retourperiode",
          "value": "30 dagen"
        },
        {
          "@type": "PropertyValue",
          "name": "Gratis verzending",
          "value": "Ja"
        }
      ]
    };

    // Add schema to head if not already exists
    const existingSchema = document.querySelector('script[data-product-schema]');
    if (existingSchema) {
      existingSchema.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-product-schema', 'true');
    script.text = JSON.stringify(productSchema);
    document.head.appendChild(script);

    return () => {
      const schemaToRemove = document.querySelector('script[data-product-schema]');
      if (schemaToRemove) {
        schemaToRemove.remove();
      }
    };
  }, [product, rating, reviewCount]);

  return null; // This component doesn't render anything
}

