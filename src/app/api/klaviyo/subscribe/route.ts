import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

// Klaviyo API credentials - add these to your .env.local file
const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY || 'pk_0b2172e78c2e76b2a397f2e587d3673428';
const KLAVIYO_NEWSLETTER_LIST_ID = process.env.KLAVIYO_NEWSLETTER_LIST_ID || 'TqanL7'; // Email List
const KLAVIYO_DOUBLE_OPT_IN = process.env.KLAVIYO_DOUBLE_OPT_IN === 'true';

// In-memory store for idempotency (in production, use Redis or database)
const processedEmails = new Map<string, { discountCode: string; timestamp: number; expiresAt: Date }>();

// Clean up old entries (older than 24 hours)
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of processedEmails.entries()) {
    if (now - data.timestamp > 24 * 60 * 60 * 1000) {
      processedEmails.delete(email);
    }
  }
}, 60 * 60 * 1000); // Clean every hour

function generateDiscountCode(): string {
  return `DESKNA${randomBytes(3).toString('hex').toUpperCase()}`;
}

function logServerSide(email: string, discountCode: string, expiresAt: Date) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    email,
    discount_code: discountCode,
    expires_at: expiresAt.toISOString(),
    source: 'newsletter_signup'
  };
  console.log('📊 Newsletter signup logged:', JSON.stringify(logEntry));
}

export async function POST(request: NextRequest) {
  let email: string | undefined;
  try {
    const requestData = await request.json();
    email = requestData.email;
    const { newsletterListId, properties = {} } = requestData;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!KLAVIYO_API_KEY) {
      console.warn('⚠️ Klaviyo API key not configured - running in demo mode');
      
      // Demo mode: generate discount code without Klaviyo integration
      const discountCode = generateDiscountCode();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      // Store in idempotency cache
      processedEmails.set(email, {
        discountCode,
        timestamp: Date.now(),
        expiresAt
      });
      
      // Server-side logging
      logServerSide(email, discountCode, expiresAt);
      
      return NextResponse.json({
        success: true,
        message: 'Demo mode: Discount code generated (Klaviyo integration disabled)',
        discountCode,
        expiresAt: expiresAt.toISOString(),
        subscriptionStatus: 'demo_mode',
        doubleOptInEnabled: false,
        listSubscriptionSuccess: false,
        demoMode: true
      });
    }

    const finalListId = newsletterListId || KLAVIYO_NEWSLETTER_LIST_ID;
    
    if (!finalListId) {
      console.warn('⚠️ Newsletter List ID not configured - profile will be created without list subscription');
      // Continue without failing - we can still create the profile and generate discount code
    }

    // Idempotency check
    const existingEntry = processedEmails.get(email);
    if (existingEntry) {
      console.log('🔄 Idempotent request detected for:', email);
      return NextResponse.json({
        success: true,
        message: 'Already processed',
        discountCode: existingEntry.discountCode,
        expiresAt: existingEntry.expiresAt.toISOString(),
        isIdempotent: true
      });
    }

    console.log('📧 Processing newsletter signup for:', email);

    // Generate discount code and expiry
    const discountCode = generateDiscountCode();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const now = new Date().toISOString();

    // Store in idempotency cache
    processedEmails.set(email, {
      discountCode,
      timestamp: Date.now(),
      expiresAt
    });

    // 1. Upsert Klaviyo profile with GDPR-compliant consent
    const profileResponse = await fetch('https://a.klaviyo.com/api/profile-import/', {
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
            // 2. Set email marketing consent to subscribed with timestamp (GDPR-proof)
            subscriptions: {
              email: {
                marketing: {
                  consent: 'subscribed',
                  consent_timestamp: now
                }
              }
            },
            properties: {
              source: 'deskna_newsletter_popup',
              signup_date: now,
              last_newsletter_signup: now,
              consent_method: 'popup_signup',
              consent_ip: request.headers.get('x-forwarded-for') || 'unknown',
              consent_user_agent: request.headers.get('user-agent') || 'unknown',
              discount_code_generated: discountCode,
              discount_expires_at: expiresAt.toISOString(),
              ...properties
            }
          }
        }
      })
    });

    let profileId = null;

    if (!profileResponse.ok) {
      const profileError = await profileResponse.text();
      console.log('⚠️ Profile import failed, trying alternative approach:', profileError);
      
      // Alternative approach: Try to create profile with simpler payload
      try {
        console.log('🔄 Trying simplified profile creation...');
        const simpleProfileResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
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
                  source: 'deskna_newsletter_popup',
                  signup_date: now,
                  discount_code_generated: discountCode,
                  discount_expires_at: expiresAt.toISOString()
                }
              }
            }
          })
        });

        if (simpleProfileResponse.ok) {
          const simpleProfileData = await simpleProfileResponse.json();
          profileId = simpleProfileData.data.id;
          console.log('✅ Created profile with simple payload:', profileId);
        } else {
          // Last resort: try to find existing profile by email
          console.log('🔍 Trying to find existing profile by email...');
          const searchResponse = await fetch(`https://a.klaviyo.com/api/profiles/?filter=equals(email,"${encodeURIComponent(email)}")`, {
            method: 'GET',
            headers: {
              'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
              'Content-Type': 'application/json',
              'revision': '2024-05-15'
            }
          });
          
          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            if (searchData.data && searchData.data.length > 0) {
              profileId = searchData.data[0].id;
              console.log('✅ Found existing Klaviyo profile:', profileId);
            }
          }
        }
      } catch (alternativeError) {
        console.error('❌ Alternative profile creation also failed:', alternativeError);
      }
    } else {
      const profileData = await profileResponse.json();
      profileId = profileData.data.id;
      console.log('✅ Klaviyo profile created/updated:', profileId);
    }

    if (!profileId) {
      console.warn('⚠️ Could not create Klaviyo profile, but continuing with discount generation');
      // Continue without profile - we can still provide discount functionality
      
      // Server-side logging
      logServerSide(email, discountCode, expiresAt);

      return NextResponse.json({ 
        success: true, 
        message: 'Kortingscode gegenereerd (Klaviyo profiel kon niet worden aangemaakt)',
        discountCode,
        expiresAt: expiresAt.toISOString(),
        subscriptionStatus: 'profile_creation_failed',
        doubleOptInEnabled: KLAVIYO_DOUBLE_OPT_IN,
        listSubscriptionSuccess: false,
        profileCreated: false
      });
    }

    // 3. Add profile to newsletter list with DOI support (only if list ID is configured)
    let subscriptionStatus = 'pending';
    let listSubscriptionSuccess = false;
    
    if (finalListId) {
      if (KLAVIYO_DOUBLE_OPT_IN) {
        // With DOI, subscription is pending until confirmed
        console.log('📧 Double opt-in enabled - subscription will be pending until confirmed');
        subscriptionStatus = 'pending';
      } else {
        // Without DOI, subscription is immediate
        subscriptionStatus = 'subscribed';
      }

      const subscribeResponse = await fetch(`https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`, {
        method: 'POST',
        headers: {
          'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          'Content-Type': 'application/json',
          'revision': '2024-05-15'
        },
        body: JSON.stringify({
          data: {
            type: 'profile-subscription-bulk-create-job',
            attributes: {
              profiles: {
                data: [
                  {
                    type: 'profile',
                    attributes: {
                      email,
                      subscriptions: {
                        email: {
                          marketing: {
                            consent: subscriptionStatus,
                            consent_timestamp: now
                          }
                        }
                      }
                    }
                  }
                ]
              },
              list: {
                data: {
                  type: 'list',
                  id: finalListId
                }
              }
            }
          }
        })
      });

      if (!subscribeResponse.ok) {
        const subscribeError = await subscribeResponse.text();
        console.error('❌ Klaviyo list subscription failed:', subscribeError);
        
        // Fallback to simple list relationship API
        try {
          const fallbackResponse = await fetch(`https://a.klaviyo.com/api/lists/${finalListId}/relationships/profiles/`, {
            method: 'POST',
            headers: {
              'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
              'Content-Type': 'application/json',
              'revision': '2024-05-15'
            },
            body: JSON.stringify({
              data: [
                {
                  type: 'profile',
                  id: profileId
                }
              ]
            })
          });
          
          if (fallbackResponse.ok) {
            listSubscriptionSuccess = true;
            console.log('✅ Successfully subscribed to newsletter list (fallback method)');
          }
        } catch (fallbackError) {
          console.error('❌ Fallback subscription also failed:', fallbackError);
        }
      } else {
        listSubscriptionSuccess = true;
        console.log(`✅ Successfully ${KLAVIYO_DOUBLE_OPT_IN ? 'initiated DOI subscription' : 'subscribed'} to newsletter list`);
      }
    } else {
      console.log('⚠️ No Newsletter List ID configured - skipping list subscription');
      subscriptionStatus = 'not_subscribed_to_list';
    }

    // Track the custom event for discount code generation (for coupon email flow)
    try {
      await fetch('/api/klaviyo/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          eventName: 'Discount Code Generated',
          properties: {
            discount_percentage: 5,
            discount_code: discountCode,
            popup_type: 'email_capture',
            discount_value: '5%',
            discount_type: 'percentage',
            expires_days: 30,
            expires_at: expiresAt.toISOString(),
            minimum_order_amount: null,
            newsletter_subscription_status: subscriptionStatus,
            double_opt_in_enabled: KLAVIYO_DOUBLE_OPT_IN
          }
        })
      });
    } catch (trackError) {
      console.error('❌ Failed to track discount code event:', trackError);
      // Don't fail the main request for tracking errors
    }

    // Server-side logging
    logServerSide(email, discountCode, expiresAt);

    return NextResponse.json({ 
      success: true, 
      message: KLAVIYO_DOUBLE_OPT_IN 
        ? 'Newsletter signup initiated - please check your email to confirm subscription'
        : 'Successfully subscribed to newsletter',
      profileId,
      discountCode,
      expiresAt: expiresAt.toISOString(),
      subscriptionStatus,
      doubleOptInEnabled: KLAVIYO_DOUBLE_OPT_IN,
      listSubscriptionSuccess
    });

  } catch (error) {
    console.error('❌ Newsletter signup error:', error);
    
    // Remove from idempotency cache on error
    if (typeof email === 'string') {
      processedEmails.delete(email);
    }
    
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
