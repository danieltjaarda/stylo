'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface StickyCartContextType {
  isStickyCartVisible: boolean;
  setStickyCartVisible: (visible: boolean) => void;
}

const StickyCartContext = createContext<StickyCartContextType | undefined>(undefined);

export function StickyCartProvider({ children }: { children: ReactNode }) {
  const [isStickyCartVisible, setStickyCartVisible] = useState(false);

  return (
    <StickyCartContext.Provider value={{ isStickyCartVisible, setStickyCartVisible }}>
      {children}
    </StickyCartContext.Provider>
  );
}

export function useStickyCart() {
  const context = useContext(StickyCartContext);
  if (context === undefined) {
    throw new Error('useStickyCart must be used within a StickyCartProvider');
  }
  return context;
}
