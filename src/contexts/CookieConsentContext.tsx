'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { 
  CookieConsent, 
  CookieConsentContextType, 
  DEFAULT_CONSENT, 
  COOKIE_NAME, 
  COOKIE_EXPIRY_DAYS 
} from '@/types/cookies';

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load consent from cookie on mount
  useEffect(() => {
    try {
      const savedConsent = Cookies.get(COOKIE_NAME);
      if (savedConsent) {
        const parsedConsent = JSON.parse(savedConsent) as CookieConsent;
        // Validate the consent object
        if (parsedConsent && typeof parsedConsent === 'object' && 'necessary' in parsedConsent) {
          setConsent(parsedConsent);
        }
      }
    } catch (error) {
      console.error('Error loading cookie consent:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    setConsent(newConsent);
    Cookies.set(COOKIE_NAME, JSON.stringify(newConsent), { 
      expires: COOKIE_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  };

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    const updatedConsent: CookieConsent = {
      ...DEFAULT_CONSENT,
      ...consent,
      ...newConsent,
      necessary: true, // Always true
      timestamp: Date.now(),
    };
    saveConsent(updatedConsent);
  };

  const acceptAll = () => {
    const allAcceptedConsent: CookieConsent = {
      necessary: true,
      statistics: true,
      marketing: true,
      timestamp: Date.now(),
    };
    saveConsent(allAcceptedConsent);
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnlyConsent: CookieConsent = {
      necessary: true,
      statistics: false,
      marketing: false,
      timestamp: Date.now(),
    };
    saveConsent(necessaryOnlyConsent);
  };

  const contextValue: CookieConsentContextType = {
    consent,
    updateConsent,
    acceptAll,
    acceptNecessaryOnly,
    hasConsent: consent !== null,
    isLoading,
  };

  return (
    <CookieConsentContext.Provider value={contextValue}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

// Helper hooks for specific consent checks
export function useStatisticsConsent() {
  const { consent } = useCookieConsent();
  return consent?.statistics ?? false;
}

export function useMarketingConsent() {
  const { consent } = useCookieConsent();
  return consent?.marketing ?? false;
}
