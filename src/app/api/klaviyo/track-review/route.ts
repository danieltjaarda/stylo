import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      productId, 
      productTitle,
      rating, 
      reviewText,
      customerName,
      orderId 
    } = await request.json();

    if (!email || !productId || !rating) {
      return NextResponse.json({ 
        error: 'Email, product ID, and rating are required' 
      }, { status: 400 });
    }

    if (!KLAVIYO_API_KEY) {
      console.error('❌ Klaviyo API key not configured');
      return NextResponse.json({ error: 'Klaviyo not configured' }, { status: 500 });
    }

    console.log('⭐ Tracking review submission for:', email, 'Product:', productTitle);

    // Track review submission event in Klaviyo
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
                  email,
                  first_name: customerName?.split(' ')[0] || '',
                  last_name: customerName?.split(' ').slice(1).join(' ') || ''
                }
              }
            },
            metric: {
              data: {
                type: 'metric',
                attributes: {
                  name: 'Submitted review'
                }
              }
            },
            properties: {
              // Review details
              review_rating: rating,
              review_text: reviewText || '',
              
              // Product details
              product_id: productId,
              product_title: productTitle || '',
              
              // Order details
              order_id: orderId || '',
              
              // Metadata
              source: 'deskna_website',
              timestamp: new Date().toISOString(),
              review_date: new Date().toISOString(),
              
              // For flow conditions
              is_positive_review: rating >= 4,
              is_negative_review: rating <= 2,
              review_category: rating >= 4 ? 'positive' : rating >= 3 ? 'neutral' : 'negative'
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Klaviyo review tracking failed:', errorText);
      return NextResponse.json({ 
        error: 'Failed to track review', 
        details: errorText 
      }, { status: 500 });
    }

    console.log('✅ Successfully tracked review submission');

    return NextResponse.json({ 
      success: true,
      message: 'Review tracked successfully' 
    });

  } catch (error) {
    console.error('❌ Klaviyo review tracking error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
