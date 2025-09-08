// Shopify Types
export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductOption {
  name: string;
  value: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifyProductOption[];
  price: ShopifyPrice;
  compareAtPrice?: ShopifyPrice;
  image?: ShopifyImage;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  updatedAt: string;
  createdAt: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  description: string;
  handle: string;
  updatedAt: string;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

// Legacy Product interface for backward compatibility
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  // Shopify fields
  shopifyId?: string;
  handle?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  variants?: ShopifyVariant[];
  images?: ShopifyImage[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  shopifyVariantId?: string;
  variant?: ShopifyVariant;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Shopify GraphQL Response Types
export interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

export interface ShopifyProductResponse {
  productByHandle: ShopifyProduct;
}

export interface ShopifyCollectionResponse {
  collectionByHandle: ShopifyCollection;
}

