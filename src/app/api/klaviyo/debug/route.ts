import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY || 'pk_0b2172e78c2e76b2a397f2e587d3673428';

export async function POST(request: NextRequest) {
  try {
    const { email = 'debug@test.com' } = await request.json();

    console.log('🔍 Debug: Testing Klaviyo API with email:', email);

    // Test 1: Simple profile creation
    console.log('📝 Test 1: Simple profile creation');
    const simpleResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-05-15'
      },
      body: JSON.stringify({
        data: {
          type: 'profile',
          attributes: {
            email,
            properties: {
              debug_test: true,
              timestamp: new Date().toISOString()
            }
          }
        }
      })
    });

    const simpleResult = {
      status: simpleResponse.status,
      statusText: simpleResponse.statusText,
      ok: simpleResponse.ok,
      body: await simpleResponse.text()
    };

    console.log('📝 Simple profile result:', simpleResult);

    // Test 2: Profile search
    console.log('🔍 Test 2: Profile search');
    const searchResponse = await fetch(`https://a.klaviyo.com/api/profiles/?filter=equals(email,"${encodeURIComponent(email)}")`, {
      method: 'GET',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-05-15'
      }
    });

    const searchResult = {
      status: searchResponse.status,
      statusText: searchResponse.statusText,
      ok: searchResponse.ok,
      body: await searchResponse.text()
    };

    console.log('🔍 Search result:', searchResult);

    // Test 3: API Key validation
    console.log('🔑 Test 3: API Key validation');
    const accountResponse = await fetch('https://a.klaviyo.com/api/accounts/', {
      method: 'GET',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-05-15'
      }
    });

    const accountResult = {
      status: accountResponse.status,
      statusText: accountResponse.statusText,
      ok: accountResponse.ok,
      body: await accountResponse.text()
    };

    console.log('🔑 Account result:', accountResult);

    return NextResponse.json({
      success: true,
      debug: {
        email,
        apiKey: `${KLAVIYO_API_KEY.substring(0, 10)}...${KLAVIYO_API_KEY.substring(KLAVIYO_API_KEY.length - 4)}`,
        tests: {
          simpleProfileCreation: simpleResult,
          profileSearch: searchResult,
          apiKeyValidation: accountResult
        }
      }
    });

  } catch (error) {
    console.error('❌ Debug API error:', error);
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
