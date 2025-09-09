import { NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = 'shaa16-zi.myshopify.com';
const SHOPIFY_TOKEN = 'b1f59b8d8c3532330b6de85a4c728d59';

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
          variants(first: 1) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
              }
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
    console.log('🛍️ Testing products with working domain...');
    
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/unstable/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { first: 10 }
      }),
    });

    console.log('📡 Products API status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Products API error:', errorText);
      return NextResponse.json({ 
        success: false,
        status: response.status,
        error: errorText,
        message: 'Products query failed - check if you have products in your store'
      });
    }

    const data = await response.json();
    console.log('📦 Products response:', data);

    if (data.errors) {
      console.log('❌ GraphQL errors:', data.errors);
      return NextResponse.json({ 
        success: false,
        error: 'GraphQL errors', 
        details: data.errors
      });
    }

    const products = data.data?.products?.edges || [];
    console.log(`✅ Found ${products.length} products`);

    return NextResponse.json({ 
      success: true,
      products: products.map((edge: any) => ({
        id: edge.node.id,
        variantId: edge.node.variants.edges[0]?.node.id || edge.node.id, // Get first variant ID
        name: edge.node.title,
        description: edge.node.description || 'Geen beschrijving',
        image: edge.node.images.edges[0]?.node.url || '/stoel-wit.png',
        price: parseFloat(edge.node.priceRange.minVariantPrice.amount),
        handle: edge.node.handle
      })),
      count: products.length,
      message: products.length > 0 ? 'Products loaded successfully!' : 'No products found - add products in Shopify Admin'
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
