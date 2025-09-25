import { NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN || 'shaa16-zi.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'b1f59b8d8c3532330b6de85a4c728d59';

export async function GET() {
  try {
    console.log('🔍 Fetching all collections from Shopify...');

    const query = `
      query getCollections {
        collections(first: 20) {
          edges {
            node {
              id
              title
              handle
              description
            }
          }
        }
      }
    `;

    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query
      }),
    });

    if (!response.ok) {
      console.error('❌ Shopify API error:', response.status, response.statusText);
      return NextResponse.json({ 
        error: 'Failed to fetch collections', 
        details: `HTTP ${response.status}` 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('📦 Raw Shopify collections response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      return NextResponse.json({ 
        error: 'GraphQL errors', 
        details: data.errors 
      }, { status: 400 });
    }

    const collections = data.data?.collections?.edges?.map((edge: any) => edge.node) || [];
    
    console.log(`✅ Found ${collections.length} collections`);
    
    return NextResponse.json({ 
      success: true,
      collections: collections
    });

  } catch (error) {
    console.error('❌ Error fetching collections:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
