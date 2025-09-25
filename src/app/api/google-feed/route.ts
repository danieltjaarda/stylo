import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';

// GraphQL query om alle producten op te halen voor Google Merchant feed
const GET_ALL_PRODUCTS_FOR_FEED = `
  query getAllProductsForFeed($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          productType
          vendor
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 3) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                sku
                title
                availableForSale
                weight
                weightUnit
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        sku?: string;
        title: string;
        availableForSale: boolean;
        weight?: number;
        weightUnit?: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
}

interface ShopifyResponse {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

// Functie om alle producten op te halen (met paginatie)
async function getAllProducts(): Promise<ShopifyProduct[]> {
  let allProducts: ShopifyProduct[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const variables: { first: number; after?: string } = { first: 250 };
    if (cursor) {
      variables.after = cursor;
    }

    try {
      const response = await shopifyFetch<ShopifyResponse>({
        query: GET_ALL_PRODUCTS_FOR_FEED,
        variables,
      });

      const products = response.data.products.edges.map(edge => edge.node);
      allProducts = [...allProducts, ...products];

      hasNextPage = response.data.products.pageInfo.hasNextPage;
      cursor = response.data.products.pageInfo.endCursor;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  return allProducts;
}

// Functie om officiële Google productcategorie ID te bepalen
function getGoogleProductCategory(product: ShopifyProduct): string {
  const productType = product.productType.toLowerCase();
  const tags = product.tags.map(tag => tag.toLowerCase());
  const title = product.title.toLowerCase();
  
  // Gebruik officiële Google categorie ID's
  if (productType.includes('bureau') || productType.includes('desk') || 
      tags.some(tag => tag.includes('bureau') || tag.includes('desk')) ||
      title.includes('bureau') || title.includes('desk')) {
    return '6194'; // Furniture > Office Furniture > Desks
  }
  
  if (productType.includes('stoel') || productType.includes('chair') || 
      tags.some(tag => tag.includes('stoel') || tag.includes('chair')) ||
      title.includes('stoel') || title.includes('chair')) {
    return '6045'; // Furniture > Chairs > Office Chairs
  }
  
  if (productType.includes('monitor') || productType.includes('arm') || 
      tags.some(tag => tag.includes('monitor') || tag.includes('arm')) ||
      title.includes('monitor') || title.includes('arm')) {
    return '4735'; // Electronics > Computers > Computer Accessories > Monitor Mounts & Stands
  }
  
  // Standaard kantoor furniture categorie
  return '6194'; // Furniture > Office Furniture > Desks
}

// Functie om GTIN/SKU te controleren en verwerken
function processProductIdentifier(variant: any): { gtin?: string; mpn?: string; identifierExists: boolean } {
  // Check of er een geldige SKU is die als GTIN/MPN kan dienen
  const sku = variant.sku?.trim();
  
  if (sku && sku.length >= 8) {
    // Als SKU lang genoeg is, behandel als MPN
    return {
      mpn: sku,
      identifierExists: true
    };
  }
  
  // Geen geldige identifier gevonden
  return {
    identifierExists: false
  };
}

// Functie om SEO-geoptimaliseerde titel te maken
function generateSEOTitle(product: ShopifyProduct, variant: any): string {
  let title = product.title;
  
  // Voeg variant specificaties toe als ze nuttig zijn
  if (variant.title && variant.title !== 'Default Title') {
    title += ` - ${variant.title}`;
  }
  
  // Voeg belangrijke kenmerken toe uit variant opties
  const sizeOption = variant.selectedOptions.find((opt: any) => 
    opt.name.toLowerCase().includes('size') || 
    opt.name.toLowerCase().includes('grootte') ||
    opt.name.toLowerCase().includes('tafelblad')
  );
  
  const colorOption = variant.selectedOptions.find((opt: any) => 
    opt.name.toLowerCase().includes('color') || 
    opt.name.toLowerCase().includes('kleur')
  );
  
  if (sizeOption && !title.includes(sizeOption.value)) {
    title += ` ${sizeOption.value}`;
  }
  
  if (colorOption && !title.includes(colorOption.value)) {
    title += ` ${colorOption.value}`;
  }
  
  // Voeg merkspecifieke termen toe voor SEO
  if (!title.toLowerCase().includes('ergonomisch') && product.tags.some(tag => tag.toLowerCase().includes('ergonomisch'))) {
    title = `Ergonomische ${title}`;
  }
  
  return title.substring(0, 150); // Google limiet
}

// Functie om SEO-geoptimaliseerde beschrijving te maken
function generateSEODescription(product: ShopifyProduct, variant: any): string {
  let description = product.description
    .replace(/<[^>]*>/g, '') // Strip HTML
    .replace(/\n/g, ' ')
    .trim();
  
  // Voeg variant specificaties toe aan het begin
  if (variant.title && variant.title !== 'Default Title') {
    description = `${variant.title} variant. ${description}`;
  }
  
  // Voeg belangrijke SEO termen toe als ze ontbreken
  const seoTerms = ['ergonomisch', 'kantoor', 'thuiswerk', 'kwaliteit'];
  seoTerms.forEach(term => {
    if (!description.toLowerCase().includes(term)) {
      if (product.tags.some(tag => tag.toLowerCase().includes(term))) {
        description = `${term.charAt(0).toUpperCase() + term.slice(1)} ${description}`;
      }
    }
  });
  
  return description.substring(0, 5000); // Google limiet
}

// Functie om producten om te zetten naar Google Merchant XML
function generateGoogleMerchantXML(products: ShopifyProduct[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://deskna.nl';
  const brandName = 'DESKNA'; // Correcte merknaam
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>DESKNA - Ergonomische Kantoormeubels</title>
    <link>${baseUrl}</link>
    <description>Hoogwaardige ergonomische bureaustoelen, zit-sta bureaus en kantooraccessoires van DESKNA. Gratis verzending, 5 jaar garantie.</description>`;

  products.forEach(product => {
    // Item group ID voor alle varianten van dit product
    const itemGroupId = product.id.split('/').pop() || product.handle;
    
    // Voor elk product, maak items voor alle varianten
    product.variants.edges.forEach(variantEdge => {
      const variant = variantEdge.node;
      
      // Gebruik SKU als ID, anders stabiele ID gebaseerd op product+variant
      const productId = variant.sku || `DESKNA-${product.id.split('/').pop()}-${variant.id.split('/').pop()}`;
      
      // SEO-geoptimaliseerde titel en beschrijving
      const title = generateSEOTitle(product, variant);
      const description = generateSEODescription(product, variant);
      
      // Product URL met correct geformatteerde variant ID (Shopify numeriek format)
      const variantId = variant.id.split('/').pop(); // Extract numeric ID from GraphQL ID
      const productUrl = `${baseUrl}/products/${product.handle}?variant=${variantId}`;
      
      // Prijs formatteren (2 decimalen)
      const priceAmount = parseFloat(variant.price.amount).toFixed(2);
      const price = `${priceAmount} ${variant.price.currencyCode}`;
      
      // Availability
      const availability = variant.availableForSale ? 'in stock' : 'out of stock';
      
      // Afbeeldingen
      const imageUrl = product.images.edges.length > 0 ? product.images.edges[0].node.url : '';
      const additionalImageUrls = product.images.edges.slice(1, 3).map(edge => edge.node.url);
      
      // Google productcategorie (officiële ID)
      const googleCategory = getGoogleProductCategory(product);
      
      // Product identifier info
      const identifierInfo = processProductIdentifier(variant);
      
      // Kleur en materiaal uit variant opties
      const colorOption = variant.selectedOptions.find((opt: any) => 
        opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('kleur')
      );
      const materialOption = variant.selectedOptions.find((opt: any) => 
        opt.name.toLowerCase().includes('material') || opt.name.toLowerCase().includes('materiaal')
      );
      const sizeOption = variant.selectedOptions.find((opt: any) => 
        opt.name.toLowerCase().includes('size') || opt.name.toLowerCase().includes('grootte') ||
        opt.name.toLowerCase().includes('tafelblad')
      );

      xml += `
    <item>
      <g:id><![CDATA[${productId}]]></g:id>
      <g:item_group_id><![CDATA[${itemGroupId}]]></g:item_group_id>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link><![CDATA[${productUrl}]]></link>
      <g:image_link><![CDATA[${imageUrl}]]></g:image_link>`;
      
      // Extra afbeeldingen
      additionalImageUrls.forEach((url, index) => {
        xml += `
      <g:additional_image_link><![CDATA[${url}]]></g:additional_image_link>`;
      });
      
      xml += `
      <g:price><![CDATA[${price}]]></g:price>
      <g:availability><![CDATA[${availability}]]></g:availability>
      <g:condition><![CDATA[new]]></g:condition>
      <g:brand><![CDATA[${brandName}]]></g:brand>
      <g:google_product_category><![CDATA[${googleCategory}]]></g:google_product_category>
      <g:product_type><![CDATA[${product.productType}]]></g:product_type>`;
      
      // GTIN/MPN handling
      if (identifierInfo.gtin) {
        xml += `
      <g:gtin><![CDATA[${identifierInfo.gtin}]]></g:gtin>`;
      }
      
      if (identifierInfo.mpn) {
        xml += `
      <g:mpn><![CDATA[${identifierInfo.mpn}]]></g:mpn>`;
      }
      
      xml += `
      <g:identifier_exists><![CDATA[${identifierInfo.identifierExists}]]></g:identifier_exists>`;
      
      // Optionele velden
      if (colorOption) {
        xml += `
      <g:color><![CDATA[${colorOption.value}]]></g:color>`;
      }
      
      if (materialOption) {
        xml += `
      <g:material><![CDATA[${materialOption.value}]]></g:material>`;
      }
      
      if (sizeOption) {
        xml += `
      <g:size><![CDATA[${sizeOption.value}]]></g:size>`;
      }
      
      // Gewicht (indien beschikbaar)
      if (variant.weight && variant.weightUnit) {
        xml += `
      <g:shipping_weight><![CDATA[${variant.weight} ${variant.weightUnit}]]></g:shipping_weight>`;
      }
      
      // Standaard verzending info
      xml += `
      <g:shipping>
        <g:country><![CDATA[NL]]></g:country>
        <g:service><![CDATA[Standard]]></g:service>
        <g:price><![CDATA[0.00 EUR]]></g:price>
      </g:shipping>`;
      
      xml += `
    </item>`;
    });
  });

  xml += `
  </channel>
</rss>`;

  return xml;
}

export async function GET(request: NextRequest) {
  try {
    console.log('Starting Google Merchant feed generation...');
    
    // Haal alle producten op
    const products = await getAllProducts();
    console.log(`Fetched ${products.length} products from Shopify`);
    
    // Genereer XML feed
    const xmlFeed = generateGoogleMerchantXML(products);
    
    console.log('Google Merchant feed generated successfully');
    
    // Return XML response
    return new NextResponse(xmlFeed, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache voor 1 uur
      },
    });
    
  } catch (error) {
    console.error('Error generating Google Merchant feed:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate Google Merchant feed' },
      { status: 500 }
    );
  }
}
