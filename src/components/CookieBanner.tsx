'use client';

import React, { useState } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { X, Settings, Shield, BarChart3, Target } from 'lucide-react';

export default function CookieBanner() {
  const { hasConsent, acceptAll, acceptNecessaryOnly, updateConsent, consent } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [tempConsent, setTempConsent] = useState({
    statistics: consent?.statistics ?? false,
    marketing: consent?.marketing ?? false,
  });

  // Don't show banner if user already has consent
  if (hasConsent) {
    return null;
  }

  const handleSaveSettings = () => {
    updateConsent(tempConsent);
    setShowSettings(false);
  };

  const handleToggleStatistics = () => {
    setTempConsent(prev => ({ ...prev, statistics: !prev.statistics }));
  };

  const handleToggleMarketing = () => {
    setTempConsent(prev => ({ ...prev, marketing: !prev.marketing }));
  };

  if (showSettings) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Cookie Instellingen</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Sluit instellingen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <p className="text-gray-600">
              We gebruiken cookies om je ervaring op onze website te verbeteren. 
              Je kunt hieronder aangeven welke cookies je wilt accepteren.
            </p>

            {/* Necessary Cookies */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-900">Noodzakelijke Cookies</h3>
                </div>
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  Altijd actief
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Deze cookies zijn essentieel voor het functioneren van de website. 
                Ze kunnen niet worden uitgeschakeld.
              </p>
            </div>

            {/* Statistics Cookies */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Statistiek Cookies</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempConsent.statistics}
                    onChange={handleToggleStatistics}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600">
                Deze cookies helpen ons begrijpen hoe bezoekers onze website gebruiken. 
                Bijvoorbeeld Google Analytics.
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-gray-900">Marketing Cookies</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempConsent.marketing}
                    onChange={handleToggleMarketing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <p className="text-sm text-gray-600">
                Deze cookies worden gebruikt voor gepersonaliseerde advertenties. 
                Bijvoorbeeld Meta Pixel (Facebook).
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleSaveSettings}
              className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Instellingen Opslaan
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Annuleren
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🍪 We gebruiken cookies
            </h3>
            <p className="text-gray-600 text-sm lg:text-base">
              We gebruiken cookies om je ervaring te verbeteren en onze website te analyseren. 
              Door verder te gaan, ga je akkoord met ons cookiebeleid.{' '}
              <a 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meer informatie
              </a>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Settings className="w-4 h-4" />
              <span>Instellingen</span>
            </button>
            <button
              onClick={acceptNecessaryOnly}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Alleen Noodzakelijk
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Alles Accepteren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
