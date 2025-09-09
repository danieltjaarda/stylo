import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import { createCheckout, addToCheckout, updateCheckout, getCheckoutUrl, cartItemsToLineItems } from '@/services/checkoutService';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  checkoutId: string | null;
  checkout: any;
  addItem: (product: Product) => void;
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
      
      addItem: (product: Product) => {
        const items = get().items;
        const existingItem = items.find(item => item.product.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
        
        // Note: Shopify sync will happen during checkout
      },
      
      removeItem: (productId: string) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        });
        
        // Note: Shopify sync will happen during checkout
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
        
        // Note: Shopify sync will happen during checkout
      },
      
      clearCart: () => {
        set({ items: [] });
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

      // Sync cart with Shopify checkout
      syncWithShopify: async () => {
        const { items, checkoutId } = get();
        
        try {
          let checkout;
          
          if (!checkoutId) {
            // Create new checkout
            checkout = await createCheckout();
            set({ checkoutId: checkout.id, checkout });
          }
          
          if (items.length > 0) {
            const lineItems = cartItemsToLineItems(items);
            const currentCheckoutId = checkoutId || get().checkoutId;
            
            if (currentCheckoutId) {
              checkout = await updateCheckout(currentCheckoutId, lineItems);
              set({ checkout });
            }
          }
        } catch (error) {
          console.error('❌ Error syncing with Shopify:', error);
        }
      },

      // Get Shopify checkout URL
      getCheckoutUrl: () => {
        const { checkout } = get();
        return checkout ? getCheckoutUrl(checkout) : null;
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items,
        checkoutId: state.checkoutId,
        checkout: state.checkout
      })
    }
  )
);
