import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product, ShopifyVariant } from '@/types';
import { 
  createCheckout, 
  addToCheckout, 
  updateCheckout, 
  removeFromCheckout,
  cartItemsToLineItems,
  ShopifyCheckout 
} from '@/services/checkoutService';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  checkoutId: string | null;
  checkout: ShopifyCheckout | null;
  addItem: (product: Product, variant?: ShopifyVariant) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  syncWithShopify: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      checkoutId: null,
      checkout: null,
      
      addItem: (product: Product, variant?: ShopifyVariant) => {
        const items = get().items;
        const existingItem = items.find(item => 
          item.product.id === product.id && 
          (!variant || item.shopifyVariantId === variant.id)
        );
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id && 
              (!variant || item.shopifyVariantId === variant.id)
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          const newItem: CartItem = {
            product,
            quantity: 1,
            shopifyVariantId: variant?.id,
            variant
          };
          set({ items: [...items, newItem] });
        }
        
        // Sync with Shopify if configured
        get().syncWithShopify();
      },
      
      removeItem: (productId: string) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        });
        get().syncWithShopify();
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        });
        get().syncWithShopify();
      },
      
      clearCart: () => {
        set({ items: [], checkoutId: null, checkout: null });
      },
      
      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },

      syncWithShopify: async () => {
        try {
          const state = get();
          const items = state.items;
          
          // Skip if no Shopify variants
          const shopifyItems = items.filter(item => item.shopifyVariantId);
          if (shopifyItems.length === 0) return;

          let checkoutId = state.checkoutId;
          
          // Create checkout if it doesn't exist
          if (!checkoutId) {
            const newCheckout = await createCheckout();
            if (newCheckout) {
              checkoutId = newCheckout.id;
              set({ checkoutId, checkout: newCheckout });
            }
          }
          
          if (checkoutId) {
            const lineItems = cartItemsToLineItems(shopifyItems);
            const updatedCheckout = await addToCheckout(checkoutId, lineItems);
            if (updatedCheckout) {
              set({ checkout: updatedCheckout });
            }
          }
        } catch (error) {
          console.error('Error syncing with Shopify:', error);
        }
      },

      getCheckoutUrl: () => {
        const checkout = get().checkout;
        return checkout ? checkout.webUrl : null;
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items, 
        checkoutId: state.checkoutId 
      })
    }
  )
);
