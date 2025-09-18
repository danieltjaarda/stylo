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
          metafield(namespace: "custom", key: "desk_one") {
            value
          }
          seatproMetafield: metafield(namespace: "custom", key: "seatpro") {
            value
          }
          addOnsMetafield: metafield(namespace: "custom", key: "add_ons") {
            value
            references(first: 20) {
              edges {
                node {
                  ... on Product {
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
                    compareAtPriceRange {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
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

    // Custom sorting for homepage top products - SeatPro should be 2nd
    const customProductOrder = [
      'DeskOne Bureau',           // 1st position
      'SeatPro ergonomische bureau stoel', // 2nd position (moved from 4th)
      'DeskPro',                  // 3rd position (moved from 2nd)
      'Monitorarm - Enkel'        // 4th position (moved from 3rd)
    ];

    const transformedProducts = products.map((edge: any) => {
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
          isDeskOne: edge.node.metafield?.value === 'true',
          isSeatPro: edge.node.seatproMetafield?.value === 'true',
          addOns: edge.node.addOnsMetafield?.references?.edges ? 
            (() => {
              const addOnCount = edge.node.addOnsMetafield.references.edges.length;
              console.log(`📦 Product ${edge.node.title} has ${addOnCount} add-ons`);
              return edge.node.addOnsMetafield.references.edges.map((refEdge: any, index: number) => {
              const product = refEdge.node;
              const price = parseFloat(product.priceRange?.minVariantPrice?.amount || 0);
              const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount ? 
                parseFloat(product.compareAtPriceRange.minVariantPrice.amount) : null;
              
              // Verschillende ratings voor verschillende add-ons
              const ratings = [4.7, 4.8, 4.6, 4.5, 4.9]; // Voor de eerste 5 add-ons
              const rating = ratings[index] || 4.5;
              
              return {
                id: product.id,
                name: product.title,
                price: price,
                compareAtPrice: compareAtPrice,
                image: product.images?.edges?.[0]?.node?.url || '/stoel-wit.png',
                rating: rating,
                discount: compareAtPrice && compareAtPrice > price ? 
                  Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : null,
                handle: product.handle,
                description: product.description
              };
            });
            })() : null,
        };
      });

    // Apply custom sorting based on product names
    const sortedProducts = transformedProducts.sort((a: any, b: any) => {
      const indexA = customProductOrder.indexOf(a.name);
      const indexB = customProductOrder.indexOf(b.name);
      
      // If both products are in the custom order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one product is in the custom order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither product is in the custom order, keep original order
      return 0;
    });

    return NextResponse.json({ 
      success: true,
      products: sortedProducts,
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
