import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY || 'pk_0b2172e78c2e76b2a397f2e587d3673428';

export async function GET(request: NextRequest) {
  try {
    if (!KLAVIYO_API_KEY) {
      return NextResponse.json({ error: 'Klaviyo API key not configured' }, { status: 500 });
    }

    console.log('🔍 Fetching Klaviyo lists...');

    // Fetch all lists from Klaviyo
    const response = await fetch('https://a.klaviyo.com/api/lists/', {
      method: 'GET',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-05-15'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Klaviyo lists fetch failed:', errorText);
      return NextResponse.json({ 
        error: 'Failed to fetch lists', 
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Format the response for easy reading
    const lists = data.data?.map((list: any) => ({
      id: list.id,
      name: list.attributes.name,
      created: list.attributes.created,
      updated: list.attributes.updated
    })) || [];

    console.log('✅ Successfully fetched Klaviyo lists:', lists.length);

    return NextResponse.json({ 
      success: true,
      lists: lists,
      total: lists.length
    });

  } catch (error) {
    console.error('❌ Klaviyo lists API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
