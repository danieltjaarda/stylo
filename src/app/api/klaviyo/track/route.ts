import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY || 'pk_0b2172e78c2e76b2a397f2e587d3673428';

export async function POST(request: NextRequest) {
  try {
    const { email, eventName, properties } = await request.json();

    if (!email || !eventName) {
      return NextResponse.json({ error: 'Email and event name are required' }, { status: 400 });
    }

    if (!KLAVIYO_API_KEY) {
      console.error('❌ Klaviyo API key not configured');
      return NextResponse.json({ error: 'Klaviyo not configured' }, { status: 500 });
    }

    console.log('📊 Tracking Klaviyo event:', eventName, 'for:', email);

    // Track event in Klaviyo
    const response = await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-05-15'
      },
      body: JSON.stringify({
        data: {
          type: 'event',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email
                }
              }
            },
            metric: {
              data: {
                type: 'metric',
                attributes: {
                  name: eventName
                }
              }
            },
            properties: {
              source: 'deskna_website',
              timestamp: new Date().toISOString(),
              ...properties
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Klaviyo event tracking failed:', errorText);
      return NextResponse.json({ 
        error: 'Failed to track event', 
        details: errorText 
      }, { status: 500 });
    }

    console.log('✅ Successfully tracked Klaviyo event');

    return NextResponse.json({ 
      success: true, 
      message: 'Event tracked successfully' 
    });

  } catch (error) {
    console.error('❌ Klaviyo tracking error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
