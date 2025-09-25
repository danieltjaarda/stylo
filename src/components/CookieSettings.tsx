'use client';

import React, { useState } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { Settings, Shield, BarChart3, Target, Check, X } from 'lucide-react';

export default function CookieSettings() {
  const { consent, updateConsent, hasConsent } = useCookieConsent();
  const [isOpen, setIsOpen] = useState(false);
  const [tempConsent, setTempConsent] = useState({
    statistics: consent?.statistics ?? false,
    marketing: consent?.marketing ?? false,
  });

  // Don't show if no consent yet (banner will handle initial consent)
  if (!hasConsent) {
    return null;
  }

  const handleSave = () => {
    updateConsent(tempConsent);
    setIsOpen(false);
  };

  const handleToggleStatistics = () => {
    setTempConsent(prev => ({ ...prev, statistics: !prev.statistics }));
  };

  const handleToggleMarketing = () => {
    setTempConsent(prev => ({ ...prev, marketing: !prev.marketing }));
  };

  if (isOpen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Cookie Voorkeuren</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Sluit instellingen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <p className="text-gray-600">
              Beheer je cookie voorkeuren. Je kunt je keuzes op elk moment wijzigen.
            </p>

            {/* Current Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Huidige Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Noodzakelijk</span>
                  <div className="flex items-center space-x-1 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Actief</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Statistieken</span>
                  <div className={`flex items-center space-x-1 ${consent?.statistics ? 'text-green-600' : 'text-red-600'}`}>
                    {consent?.statistics ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span className="text-sm font-medium">{consent?.statistics ? 'Actief' : 'Uitgeschakeld'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Marketing</span>
                  <div className={`flex items-center space-x-1 ${consent?.marketing ? 'text-green-600' : 'text-red-600'}`}>
                    {consent?.marketing ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span className="text-sm font-medium">{consent?.marketing ? 'Actief' : 'Uitgeschakeld'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookie Categories */}
            <div className="space-y-4">
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
                  Deze cookies zijn essentieel voor het functioneren van de website en kunnen niet worden uitgeschakeld.
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
                  Deze cookies helpen ons begrijpen hoe bezoekers onze website gebruiken (Google Analytics).
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
                  Deze cookies worden gebruikt voor gepersonaliseerde advertenties (Meta Pixel).
                </p>
              </div>
            </div>

            {/* Consent Date */}
            {consent?.timestamp && (
              <div className="text-xs text-gray-500">
                Laatste wijziging: {new Date(consent.timestamp).toLocaleDateString('nl-NL')}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Voorkeuren Opslaan
            </button>
            <button
              onClick={() => setIsOpen(false)}
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
    <button
      onClick={() => setIsOpen(true)}
      className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      <Settings className="w-4 h-4" />
      <span>Cookie Instellingen</span>
    </button>
  );
}
