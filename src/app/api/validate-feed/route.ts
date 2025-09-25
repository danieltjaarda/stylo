import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Beveiligingscheck: alleen toegankelijk in development of vanaf lokale IP's
  if (process.env.NODE_ENV === 'production') {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const remoteIP = forwardedFor?.split(',')[0] || realIP;
    
    // Alleen lokale IP's toestaan in productie
    const allowedIPs = ['127.0.0.1', '::1', 'localhost'];
    const isLocalhost = request.nextUrl.hostname === 'localhost' || 
                       request.nextUrl.hostname === '127.0.0.1' ||
                       allowedIPs.includes(remoteIP || '');
    
    if (!isLocalhost) {
      return NextResponse.json(
        { error: 'Access denied' },
        { 
          status: 403,
          headers: {
            'X-Robots-Tag': 'noindex, nofollow'
          }
        }
      );
    }
  }

  try {
    // Haal de feed op
    const feedResponse = await fetch(`${request.nextUrl.origin}/api/google-feed`);
    const xmlText = await feedResponse.text();
    
    // Basic XML validatie met regex (eenvoudiger dan XML parser)
    const isValidXml = xmlText.includes('<?xml version="1.0" encoding="UTF-8"?>') && 
                       xmlText.includes('<rss version="2.0"') && 
                       xmlText.includes('xmlns:g="http://base.google.com/ns/1.0"') &&
                       xmlText.includes('</rss>');
    
    if (!isValidXml) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid XML structure',
        details: 'Feed does not contain proper RSS structure'
      });
    }
    
    // Extract items met regex
    const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];
    const channelTitle = xmlText.match(/<title>(.*?)<\/title>/)?.[1] || '';
    const channelLink = xmlText.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const channelDescription = xmlText.match(/<description>(.*?)<\/description>/)?.[1] || '';
    
    // Validatie resultaten
    const validationResults = {
      valid: true,
      summary: {
        totalItems: itemMatches.length,
        validItems: 0,
        invalidItems: 0,
        warnings: 0
      },
      checks: [] as any[],
      feedStats: {} as any
    };
    
    // Check RSS structuur
    validationResults.checks.push({
      name: 'RSS 2.0 structuur',
      status: 'pass',
      message: 'Geldige RSS 2.0 structuur gevonden'
    });
    
    validationResults.checks.push({
      name: 'Google Merchant namespace',
      status: 'pass', 
      message: 'Correcte Google namespace (xmlns:g) gevonden'
    });
    
    // Check channel metadata
    validationResults.checks.push({
      name: 'Channel metadata',
      status: channelTitle && channelLink && channelDescription ? 'pass' : 'fail',
      message: `Title: ${channelTitle ? '✓' : '✗'}, Link: ${channelLink ? '✓' : '✗'}, Description: ${channelDescription ? '✓' : '✗'}`
    });
    
    // Check verplichte velden in eerste paar items
    const requiredFields = ['<g:id>', '<title>', '<description>', '<link>', '<g:image_link>', '<g:price>', '<g:availability>', '<g:condition>', '<g:brand>'];
    const recommendedFields = ['<g:google_product_category>', '<g:product_type>', '<g:identifier_exists>'];
    
    let validItemCount = 0;
    let warningCount = 0;
    
    // Check eerste 5 items
    const itemsToCheck = itemMatches.slice(0, 5);
    itemsToCheck.forEach((item, index) => {
      let itemValid = true;
      
      // Check verplichte velden
      requiredFields.forEach(field => {
        if (!item.includes(field)) {
          itemValid = false;
        }
      });
      
      // Check aanbevolen velden
      recommendedFields.forEach(field => {
        if (!item.includes(field)) {
          warningCount++;
        }
      });
      
      // Check prijsformaat
      const priceMatch = item.match(/<g:price><!\[CDATA\[(.*?)\]\]><\/g:price>/);
      if (priceMatch) {
        const priceText = priceMatch[1];
        const validPrice = /^\d+\.\d{2}\s+EUR$/i.test(priceText);
        if (!validPrice) {
          itemValid = false;
        }
      }
      
      // Check HTTPS afbeeldingen
      const imageMatch = item.match(/<g:image_link><!\[CDATA\[(.*?)\]\]><\/g:image_link>/);
      if (imageMatch && !imageMatch[1].startsWith('https://')) {
        warningCount++;
      }
      
      if (itemValid) {
        validItemCount++;
      }
    });
    
    // Update summary
    validationResults.summary.validItems = validItemCount;
    validationResults.summary.invalidItems = itemsToCheck.length - validItemCount;
    validationResults.summary.warnings = warningCount;
    
    // Feed statistieken
    const priceMatches = xmlText.match(/<g:price><!\[CDATA\[(\d+\.\d{2})\s+EUR\]\]><\/g:price>/g) || [];
    const prices = priceMatches.map(match => {
      const priceMatch = match.match(/(\d+\.\d{2})/);
      return priceMatch ? parseFloat(priceMatch[1]) : 0;
    });
    
    const brandMatches = xmlText.match(/<g:brand><!\[CDATA\[(.*?)\]\]><\/g:brand>/g) || [];
    const brands = [...new Set(brandMatches.map(match => {
      const brandMatch = match.match(/<g:brand><!\[CDATA\[(.*?)\]\]><\/g:brand>/);
      return brandMatch ? brandMatch[1] : '';
    }))];
    
    const categoryMatches = xmlText.match(/<g:google_product_category><!\[CDATA\[(.*?)\]\]><\/g:google_product_category>/g) || [];
    const categories = [...new Set(categoryMatches.map(match => {
      const categoryMatch = match.match(/<g:google_product_category><!\[CDATA\[(.*?)\]\]><\/g:google_product_category>/);
      return categoryMatch ? categoryMatch[1] : '';
    }))];
    
    validationResults.feedStats = {
      feedSize: Math.round(xmlText.length / 1024), // KB
      totalItems: itemMatches.length,
      uniqueBrands: brands,
      uniqueCategories: categories,
      priceRange: prices.length > 0 ? {
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: Math.round((prices.reduce((sum, price) => sum + price, 0) / prices.length) * 100) / 100
      } : { min: 0, max: 0, avg: 0 }
    };
    
    // Check belangrijke verbeteringen
    const improvements = [];
    
    if (!xmlText.includes('<g:identifier_exists>false</g:identifier_exists>')) {
      improvements.push('Voeg <g:identifier_exists>false</g:identifier_exists> toe voor producten zonder GTIN/MPN');
    }
    
    if (!xmlText.includes('<g:google_product_category>')) {
      improvements.push('Voeg Google productcategorieën toe voor betere classificatie');
    }
    
    if (!xmlText.includes('<g:additional_image_link>')) {
      improvements.push('Overweeg extra productafbeeldingen toe te voegen');
    }
    
    if (!xmlText.includes('<g:shipping>')) {
      improvements.push('Voeg verzendingsinformatie toe');
    }
    
    // Overall validatie
    const hasErrors = validationResults.summary.invalidItems > 0 || 
                     validationResults.checks.some(check => check.status === 'fail');
    validationResults.valid = !hasErrors;
    
    return NextResponse.json({
      ...validationResults,
      improvements,
      timestamp: new Date().toISOString(),
      feedUrl: `${request.nextUrl.origin}/api/google-feed`
    }, {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet'
      }
    });
    
  } catch (error) {
    console.error('Feed validation error:', error);
    return NextResponse.json({
      valid: false,
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet'
      }
    });
  }
}
