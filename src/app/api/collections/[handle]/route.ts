import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN || 'shaa16-zi.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'b1f59b8d8c3532330b6de85a4c728d59';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;
    console.log(`🔍 Fetching collection: ${handle}`);

    const query = `
      query getCollection($handle: String!) {
        collection(handle: $handle) {
          id
          title
          handle
          description
          products(first: 20) {
            edges {
              node {
                id
                title
                handle
                description
                tags
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
                images(first: 5) {
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
                    }
                  }
                }
                options {
                  name
                  values
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      availableForSale
                      price {
                        amount
                      }
                      compareAtPrice {
                        amount
                      }
                      image {
                        url
                      }
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                }
                metafield(namespace: "custom", key: "is_desk_one") {
                  value
                }
                seatproMetafield: metafield(namespace: "custom", key: "is_seatpro") {
                  value
                }
                addOnsMetafield: metafield(namespace: "custom", key: "add_ons") {
                  value
                  references(first: 10) {
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
                          variants(first: 1) {
                            edges {
                              node {
                                id
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
      }
    `;

    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { handle }
      }),
    });

    if (!response.ok) {
      console.error('❌ Shopify API error:', response.status, response.statusText);
      return NextResponse.json({ 
        error: 'Failed to fetch collection', 
        details: `HTTP ${response.status}` 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('📦 Raw Shopify collection response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      return NextResponse.json({ 
        error: 'GraphQL errors', 
        details: data.errors 
      }, { status: 400 });
    }

    if (!data.data?.collection) {
      console.log('❌ Collection not found');
      return NextResponse.json({ 
        error: 'Collection not found',
        details: `Collection '${handle}' does not exist`
      }, { status: 404 });
    }

    const collection = data.data.collection;
    const products = collection.products.edges.map((edge: any) => {
      const product = edge.node;
      
      // Transform variants
      const variants = product.variants.edges.map((vEdge: any) => ({
        id: vEdge.node.id,
        title: vEdge.node.title,
        price: parseFloat(vEdge.node.price.amount),
        compareAtPrice: vEdge.node.compareAtPrice ? parseFloat(vEdge.node.compareAtPrice.amount) : null,
        available: vEdge.node.availableForSale,
        selectedOptions: vEdge.node.selectedOptions,
        imageUrl: vEdge.node.image?.url,
      }));

      // Transform options
      const options = product.options.map((option: any) => ({
        name: option.name,
        values: option.values,
      }));

      // Get first image
      const firstImage = product.images.edges[0]?.node?.url || '/placeholder.jpg';
      
      // Transform add-ons
      let addOns: any[] = [];
      if (product.addOnsMetafield?.references?.edges) {
        addOns = product.addOnsMetafield.references.edges.map((edge: any) => {
          const addOn = edge.node;
          return {
            id: addOn.id,
            variantId: addOn.variants?.edges[0]?.node?.id, // Add variant ID for add-ons
            name: addOn.title,
            handle: addOn.handle,
            description: addOn.description,
            price: parseFloat(addOn.priceRange.minVariantPrice.amount),
            compareAtPrice: addOn.compareAtPriceRange?.minVariantPrice ? 
              parseFloat(addOn.compareAtPriceRange.minVariantPrice.amount) : null,
            image: addOn.images.edges[0]?.node?.url || '/placeholder.jpg',
            rating: 4.5, // Default rating
            discount: addOn.compareAtPriceRange?.minVariantPrice ? 
              Math.round(((parseFloat(addOn.compareAtPriceRange.minVariantPrice.amount) - 
                         parseFloat(addOn.priceRange.minVariantPrice.amount)) / 
                         parseFloat(addOn.compareAtPriceRange.minVariantPrice.amount)) * 100) : null,
          };
        });
      }

      return {
        id: product.id,
        handle: product.handle,
        variantId: variants[0]?.id, // Add the first variant ID for checkout
        name: product.title,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
        compareAtPrice: product.compareAtPriceRange?.minVariantPrice ? 
          parseFloat(product.compareAtPriceRange.minVariantPrice.amount) : undefined,
        description: product.description || 'Geen beschrijving beschikbaar',
        image: firstImage,
        images: product.images.edges.map((edge: any) => ({
          url: edge.node.url,
          altText: edge.node.altText || product.title,
        })),
        tags: product.tags || [], // Add tags from Shopify
        category: 'ergonomische-bureaustoelen', // Default for this collection
        stock: variants.reduce((total: number, v: any) => total + (v.available ? 10 : 0), 0),
        rating: 4.5, // Default rating
        reviews: Math.floor(Math.random() * 100) + 20, // Random reviews for demo
        variants,
        options,
        isDeskOne: product.metafield?.value === 'true',
        isSeatPro: product.seatproMetafield?.value === 'true',
        addOns: addOns.length > 0 ? addOns : undefined,
      };
    });

    console.log(`✅ Found ${products.length} products in collection '${handle}'`);
    products.forEach((product: any) => {
      if (product.addOns && product.addOns.length > 0) {
        console.log(`📦 Product ${product.name} has ${product.addOns.length} add-ons`);
      }
    });

    return NextResponse.json({ 
      success: true, 
      collection: {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
        description: collection.description,
      },
      products 
    });

  } catch (error) {
    console.error('❌ Collection API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
