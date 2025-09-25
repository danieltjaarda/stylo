// Klaviyo API service for email marketing

interface KlaviyoProfile {
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  properties?: {
    [key: string]: any;
  };
}

interface KlaviyoSubscribeResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Subscribe user to Klaviyo list
export async function subscribeToKlaviyo(
  email: string, 
  newsletterListId?: string,
  additionalProperties: Record<string, any> = {}
): Promise<KlaviyoSubscribeResponse & { 
  discountCode?: string; 
  expiresAt?: string; 
  subscriptionStatus?: string;
  doubleOptInEnabled?: boolean;
  isIdempotent?: boolean;
  demoMode?: boolean;
}> {
  try {
    console.log('📧 Subscribing to Klaviyo newsletter:', email);

    // Call our API route that handles Klaviyo integration
    const response = await fetch('/api/klaviyo/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        newsletterListId,
        properties: {
          source: 'popup_discount',
          discount_claimed: '5%',
          timestamp: new Date().toISOString(),
          ...additionalProperties
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Newsletter subscription failed:', data);
      return { success: false, error: data.error || 'Subscription failed' };
    }

    console.log('✅ Successfully subscribed to newsletter');
    return { 
      success: true, 
      message: data.message || 'Successfully subscribed',
      discountCode: data.discountCode,
      expiresAt: data.expiresAt,
      subscriptionStatus: data.subscriptionStatus,
      doubleOptInEnabled: data.doubleOptInEnabled,
      isIdempotent: data.isIdempotent
    };

  } catch (error) {
    console.error('❌ Newsletter service error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Track event in Klaviyo
export async function trackKlaviyoEvent(
  email: string,
  eventName: string,
  properties: Record<string, any> = {}
): Promise<KlaviyoSubscribeResponse> {
  try {
    console.log('📊 Tracking Klaviyo event:', eventName, email);

    const response = await fetch('/api/klaviyo/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        eventName,
        properties: {
          timestamp: new Date().toISOString(),
          ...properties
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Klaviyo tracking failed:', data);
      return { success: false, error: data.error || 'Tracking failed' };
    }

    console.log('✅ Successfully tracked Klaviyo event');
    return { success: true };

  } catch (error) {
    console.error('❌ Klaviyo tracking error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Send discount email via Klaviyo
export async function sendDiscountEmail(
  email: string,
  discountCode: string,
  discountPercentage: number = 5
): Promise<KlaviyoSubscribeResponse> {
  try {
    console.log('📧 Sending discount email to:', email);

    const response = await fetch('/api/klaviyo/send-discount-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        discountCode,
        discountPercentage
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Discount email failed:', data);
      return { success: false, error: data.error || 'Email send failed' };
    }

    console.log('✅ Successfully sent discount email');
    return { success: true, message: 'Discount email sent' };

  } catch (error) {
    console.error('❌ Discount email service error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Track review submission
export async function trackReviewSubmission(
  email: string,
  productId: string,
  productTitle: string,
  rating: number,
  reviewText?: string,
  customerName?: string,
  orderId?: string
): Promise<KlaviyoSubscribeResponse> {
  try {
    console.log('⭐ Tracking review submission for:', email);

    const response = await fetch('/api/klaviyo/track-review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        productId,
        productTitle,
        rating,
        reviewText,
        customerName,
        orderId
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Review tracking failed:', data);
      return { success: false, error: data.error || 'Review tracking failed' };
    }

    console.log('✅ Successfully tracked review submission');
    return { success: true, message: 'Review tracked successfully' };

  } catch (error) {
    console.error('❌ Review tracking service error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
