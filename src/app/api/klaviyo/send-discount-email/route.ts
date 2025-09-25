import { NextRequest, NextResponse } from 'next/server';

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { email, discountCode, discountPercentage = 5 } = await request.json();

    if (!email || !discountCode) {
      return NextResponse.json({ error: 'Email and discount code are required' }, { status: 400 });
    }

    if (!KLAVIYO_API_KEY) {
      console.error('❌ Klaviyo API key not configured');
      return NextResponse.json({ error: 'Klaviyo not configured' }, { status: 500 });
    }

    console.log('📧 Sending discount email to:', email, 'with code:', discountCode);

    // Send email via Klaviyo's campaign API
    const response = await fetch('https://a.klaviyo.com/api/campaigns/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-05-15'
      },
      body: JSON.stringify({
        data: {
          type: 'campaign',
          attributes: {
            name: `Discount Email - ${discountCode}`,
            subject: `🔥 Je ${discountPercentage}% korting is hier!`,
            from_email: 'hello@deskna.nl',
            from_label: 'DESKNA',
            template_id: 'YOUR_TEMPLATE_ID', // You'll need to create this in Klaviyo
            send_options: {
              use_smart_sending: false,
              is_transactional: true
            },
            tracking_options: {
              is_add_utm: true,
              utm_params: [
                {
                  name: 'utm_source',
                  value: 'klaviyo'
                },
                {
                  name: 'utm_medium', 
                  value: 'email'
                },
                {
                  name: 'utm_campaign',
                  value: 'discount_popup'
                }
              ]
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Klaviyo email send failed:', errorText);
      return NextResponse.json({ 
        error: 'Failed to send email', 
        details: errorText 
      }, { status: 500 });
    }

    const campaignData = await response.json();
    const campaignId = campaignData.data.id;

    // Send the campaign to the specific email
    const sendResponse = await fetch(`https://a.klaviyo.com/api/campaigns/${campaignId}/send/`, {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-05-15'
      },
      body: JSON.stringify({
        data: {
          type: 'campaign-send-job',
          attributes: {
            send_strategy: {
              method: 'immediate',
              options_static: {
                datetime: new Date().toISOString(),
                is_local: false,
                send_past_recipients_immediately: false
              }
            }
          }
        }
      })
    });

    if (!sendResponse.ok) {
      const sendError = await sendResponse.text();
      console.error('❌ Klaviyo campaign send failed:', sendError);
      return NextResponse.json({ 
        error: 'Failed to send campaign', 
        details: sendError 
      }, { status: 500 });
    }

    console.log('✅ Successfully sent discount email');

    return NextResponse.json({ 
      success: true,
      message: 'Discount email sent successfully',
      campaignId
    });

  } catch (error) {
    console.error('❌ Klaviyo email send error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
