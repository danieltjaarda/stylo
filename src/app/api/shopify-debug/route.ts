import { NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = 'shaa16-zi.myshopify.com';
const SHOPIFY_TOKEN = 'b1f59b8d8c3532330b6de85a4c728d59';

export async function GET() {
  try {
    console.log('🧪 Testing Shopify with unstable API...');

    // Test verschillende API versies
    const versions = ['unstable', '2025-01', '2024-10', '2024-07', '2024-04'];
    
    for (const version of versions) {
      console.log(`🔍 Testing API version: ${version}`);
      
      const shopQuery = `{ shop { name } }`;
      
      const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/${version}/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
        },
        body: JSON.stringify({ query: shopQuery }),
      });

      console.log(`📡 ${version}: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${version} works!`, data);
        return NextResponse.json({ 
          success: true,
          workingVersion: version,
          shopInfo: data.data?.shop,
          message: `API version ${version} works!`
        });
      }
    }

    return NextResponse.json({ 
      success: false,
      error: 'No API version works',
      testedVersions: versions
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
