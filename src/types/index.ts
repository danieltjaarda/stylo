export interface ProductVariantOptionValue {
  name: string;
  value: string;
}

export interface ProductImage {
  url: string;
  altText?: string;
}

export interface ProductVariant {
  id: string; // Shopify variant ID (gid)
  title: string;
  price: number;
  compareAtPrice?: number | null;
  available: boolean;
  selectedOptions?: ProductVariantOptionValue[];
  imageUrl?: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface AddOnProduct {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  rating: number;
  discount?: number | null;
  handle?: string;
  description?: string;
}

export interface Product {
  id: string;
  handle?: string; // SEO-friendly slug from Shopify
  name: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  image: string;
  images?: ProductImage[];
  videoUrl?: string;
  videoPoster?: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  // Optional Shopify specifics for variants
  variantId?: string;
  options?: ProductOption[];
  variants?: ProductVariant[];
  isDeskOne?: boolean; // For showing extended product sections
  isSeatPro?: boolean; // For showing SeatPro extended sections
  addOns?: AddOnProduct[]; // Add-ons metafield data
}

export interface CartItem {
  product: Product;
  quantity: number;
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


