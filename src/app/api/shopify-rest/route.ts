import { NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = 'shaa16-zi.myshopify.com';
const SHOPIFY_TOKEN = 'b1f59b8d8c3532330b6de85a4c728d59';

export async function GET() {
  try {
    console.log('🧪 Testing Shopify REST API...');

    // Test REST API endpoint (simpler than GraphQL)
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/2024-10/shop.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_TOKEN,
      },
    });

    console.log(`📡 REST API status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ REST API works!', data);
      return NextResponse.json({ 
        success: true,
        api: 'REST',
        shopInfo: data.shop
      });
    } else {
      const errorText = await response.text();
      console.log('❌ REST API failed:', errorText);
      
      // Try Storefront API without GraphQL
      console.log('🔍 Trying direct Storefront API...');
      const storeResponse = await fetch(`https://${SHOPIFY_DOMAIN}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log(`📡 Store check: ${storeResponse.status}`);
      
      return NextResponse.json({ 
        success: false,
        restStatus: response.status,
        storeStatus: storeResponse.status,
        error: errorText,
        message: 'Store exists but API not accessible'
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
