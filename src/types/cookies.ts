export interface CookieConsent {
  necessary: boolean;
  statistics: boolean;
  marketing: boolean;
  timestamp: number;
}

export interface CookieConsentContextType {
  consent: CookieConsent | null;
  updateConsent: (newConsent: Partial<CookieConsent>) => void;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  hasConsent: boolean;
  isLoading: boolean;
}

export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  statistics: false,
  marketing: false,
  timestamp: Date.now(),
};

export const COOKIE_NAME = 'deskna-cookie-consent';
export const COOKIE_EXPIRY_DAYS = 365;
