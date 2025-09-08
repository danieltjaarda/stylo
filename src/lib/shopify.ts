import Client from 'shopify-buy';

// Shopify client configuratie
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = (Client as any).buildClient({
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'shaafs-2r.myshopify.com',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'b1f59b8d8c3532330b6de85a4c728d59'
});

export default client;

// Helper functie voor GraphQL requests
export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<{ data: T }> {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;
  
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    return await result.json();
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

// GraphQL query om alle producten op te halen
export const GET_PRODUCTS_QUERY = `
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
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;
