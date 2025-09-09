import { NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  try {
    console.log('🔍 Server-side Shopify API call...');
    console.log('🔑 Domain:', SHOPIFY_DOMAIN);
    console.log('🔑 Token available:', !!SHOPIFY_TOKEN);

    if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
      console.log('❌ Missing Shopify credentials');
      return NextResponse.json({ products: [], error: 'Missing credentials' });
    }

    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { first: 20 }
      }),
    });

    console.log('📡 Shopify API status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Shopify API error:', response.status, errorText);
      return NextResponse.json({ products: [], error: `API Error: ${response.status}` });
    }

    const data = await response.json();
    console.log('📦 Raw Shopify response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.log('❌ GraphQL errors:', data.errors);
      return NextResponse.json({ products: [], error: 'GraphQL errors', details: data.errors });
    }

    const products = data.data?.products?.edges?.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.title,
      description: edge.node.description || 'Geen beschrijving',
      image: edge.node.images.edges[0]?.node.url || '/stoel-wit.png',
      price: parseFloat(edge.node.priceRange.minVariantPrice.amount),
      category: 'Shopify Product',
      stock: edge.node.variants.edges[0]?.node.availableForSale ? 10 : 0,
      rating: 4.5,
      reviews: 150,
      handle: edge.node.handle
    })) || [];

    console.log(`✅ Found ${products.length} products:`, products);
    return NextResponse.json({ products, count: products.length });

  } catch (error) {
    console.error('❌ Server error:', error);
    return NextResponse.json({ products: [], error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
