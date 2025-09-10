import { NextResponse } from 'next/server';

export const revalidate = 0; // disable cache for debugging media
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Use edge runtime for faster response

const SHOPIFY_DOMAIN = 'shaa16-zi.myshopify.com';
const SHOPIFY_TOKEN = 'b1f59b8d8c3532330b6de85a4c728d59';

const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          media(first: 5) {
            edges {
              node {
                __typename
                ... on Video {
                  sources { url mimeType }
                  previewImage { url }
                }
                ... on ExternalVideo {
                  host
                  embeddedUrl
                  previewImage { url }
                }
              }
            }
          }
          options(first: 3) {
            name
            values
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount }
                compareAtPrice { amount }
                image { url }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  try {
    console.log('🛍️ Testing products with working domain...');
    
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/unstable/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { first: 10 }
      }),
    });

    console.log('📡 Products API status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Products API error:', errorText);
      return NextResponse.json({ 
        success: false,
        status: response.status,
        error: errorText,
        message: 'Products query failed - check if you have products in your store'
      });
    }

    const data = await response.json();
    console.log('📦 Products response:', data);

    if (data.errors) {
      console.log('❌ GraphQL errors:', data.errors);
      return NextResponse.json({ 
        success: false,
        error: 'GraphQL errors', 
        details: data.errors
      });
    }

    const products = data.data?.products?.edges || [];
    console.log(`✅ Found ${products.length} products`);

    return NextResponse.json({ 
      success: true,
      products: products.map((edge: any) => {
        const productImages = edge.node.images.edges.map((e: any) => ({ url: e.node.url, altText: e.node.altText || undefined }));
        const mediaEdges = edge.node.media?.edges || [];
        const videoEdge = mediaEdges.find((m: any) => m.node.__typename === 'Video');
        const externalEdge = mediaEdges.find((m: any) => m.node.__typename === 'ExternalVideo');
        const videoUrl = videoEdge?.node?.sources?.[0]?.url 
          || externalEdge?.node?.embeddedUrl 
          || undefined;
        const videoPoster = videoEdge?.node?.previewImage?.url 
          || externalEdge?.node?.previewImage?.url 
          || undefined;
        const variants = edge.node.variants?.edges?.map((ve: any) => ({
          id: ve.node.id,
          title: ve.node.title,
          price: parseFloat(ve.node.price.amount),
          compareAtPrice: ve.node.compareAtPrice ? parseFloat(ve.node.compareAtPrice.amount) : null,
          available: !!ve.node.availableForSale,
          selectedOptions: ve.node.selectedOptions,
          imageUrl: ve.node.image?.url || undefined,
        })) || [];
        // Get compareAtPrice from the first variant if available
        const firstVariantCompareAt = variants[0]?.compareAtPrice;
        
        return {
          id: edge.node.id,
          name: edge.node.title,
          description: edge.node.description || 'Geen beschrijving',
          image: productImages[0]?.url || '/stoel-wit.png',
          images: productImages,
          videoUrl,
          videoPoster,
          price: parseFloat(edge.node.priceRange.minVariantPrice.amount),
          compareAtPrice: firstVariantCompareAt || undefined,
          handle: edge.node.handle,
          options: edge.node.options?.map((o: any) => ({ name: o.name, values: o.values })) || [],
          variants,
        };
      }),
      count: products.length,
      message: products.length > 0 ? 'Products loaded successfully!' : 'No products found - add products in Shopify Admin'
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
