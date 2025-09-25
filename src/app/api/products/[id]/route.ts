import { NextResponse } from 'next/server';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'shaa16-zi.myshopify.com';
const SHOPIFY_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'b1f59b8d8c3532330b6de85a4c728d59';

const PRODUCT_DETAILS_QUERY = `
  query getProductDetails($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      tags
      vendor
      productType
      createdAt
      updatedAt
      seo {
        title
        description
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
            weight
            weightUnit
            sku
          }
        }
      }
      options {
        id
        name
        values
      }
      metafields(identifiers: [
        {namespace: "custom", key: "specifications"},
        {namespace: "custom", key: "dimensions"},
        {namespace: "custom", key: "materials"},
        {namespace: "custom", key: "warranty"},
        {namespace: "custom", key: "care_instructions"},
        {namespace: "custom", key: "features"}
      ]) {
        key
        value
        type
      }
    }
  }
`;

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    console.log('🔍 Fetching detailed product info for:', id);

    if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
      console.log('❌ Missing Shopify credentials');
      return NextResponse.json({ 
        success: false, 
        error: 'Missing Shopify credentials' 
      }, { status: 500 });
    }

    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCT_DETAILS_QUERY,
        variables: { handle: id }
      }),
    });

    console.log('📡 Shopify API status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Shopify API error:', response.status, errorText);
      return NextResponse.json({ 
        success: false, 
        error: `API Error: ${response.status}` 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('📦 Shopify product details response received');

    if (data.errors) {
      console.log('❌ GraphQL errors:', data.errors);
      return NextResponse.json({ 
        success: false, 
        error: 'GraphQL errors', 
        details: data.errors 
      }, { status: 400 });
    }

    const product = data.data?.product;
    
    if (!product) {
      console.log('❌ Product not found');
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    // Transform the product data for easier consumption
    const transformedProduct = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      vendor: product.vendor,
      productType: product.productType,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      seo: product.seo,
      priceRange: product.priceRange,
      images: product.images.edges.map((edge: any) => ({
        url: edge.node.url,
        altText: edge.node.altText,
        width: edge.node.width,
        height: edge.node.height,
      })),
      variants: product.variants.edges.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        price: edge.node.price,
        compareAtPrice: edge.node.compareAtPrice,
        availableForSale: edge.node.availableForSale,
        selectedOptions: edge.node.selectedOptions,
        image: edge.node.image,
        weight: edge.node.weight,
        weightUnit: edge.node.weightUnit,
        sku: edge.node.sku,
      })),
      options: product.options,
      metafields: product.metafields.reduce((acc: any, field: any) => {
        if (field && field.key && field.value) {
          acc[field.key] = {
            value: field.value,
            type: field.type
          };
        }
        return acc;
      }, {}),
    };

    console.log(`✅ Product details loaded for: ${product.title}`);
    return NextResponse.json({ 
      success: true, 
      product: transformedProduct 
    });

  } catch (error) {
    console.error('❌ Server error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
