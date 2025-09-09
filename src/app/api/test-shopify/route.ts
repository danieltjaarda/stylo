import { NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function GET() {
  try {
    console.log('🧪 Testing basic Shopify connection...');
    console.log('🔑 Domain:', SHOPIFY_DOMAIN);
    console.log('🔑 Token:', SHOPIFY_TOKEN?.substring(0, 10) + '...');

    if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing credentials',
        domain: SHOPIFY_DOMAIN,
        hasToken: !!SHOPIFY_TOKEN
      });
    }

    // Test 1: Simple shop info query
    const shopQuery = `
      query {
        shop {
          name
          description
          primaryDomain {
            host
          }
        }
      }
    `;

    console.log('🏪 Testing shop query...');
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({ query: shopQuery }),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      return NextResponse.json({ 
        success: false,
        status: response.status,
        error: errorText,
        endpoint: `https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`
      });
    }

    const data = await response.json();
    console.log('✅ Shop data:', data);

    return NextResponse.json({ 
      success: true,
      shopInfo: data.data?.shop,
      endpoint: `https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`,
      message: 'Shopify connection successful!'
    });

  } catch (error) {
    console.error('❌ Connection error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
