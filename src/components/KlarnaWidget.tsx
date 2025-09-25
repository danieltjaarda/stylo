import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface KlarnaWidgetProps {
  price: number;
  className?: string;
}

export default function KlarnaWidget({ price, className = "" }: KlarnaWidgetProps) {
  const installmentAmount = (price / 3).toFixed(2);
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <>
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/svg icons/klarna.svg" 
              alt="Klarna" 
              className="h-5 w-auto"
            />
            <span className="text-sm text-gray-700">
              Betaal in 3 delen
            </span>
            <button
              onClick={() => setShowInfo(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Meer informatie over Klarna"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-sm font-medium text-gray-900">
            3x €{installmentAmount}
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/svg icons/klarna.svg" 
                alt="Klarna" 
                className="h-8 w-auto"
              />
              <h2 className="text-xl font-bold text-gray-900">
                Hoe werkt Klarna?
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="bg-pink-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Betaal in 3 gelijke delen
                </h3>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div>
                    <div className="font-medium text-gray-900">Vandaag</div>
                    <div className="text-gray-600">€{installmentAmount}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">30 dagen</div>
                    <div className="text-gray-600">€{installmentAmount}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">60 dagen</div>
                    <div className="text-gray-600">€{installmentAmount}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Geen rente</p>
                    <p className="text-xs text-gray-600">0% rente bij tijdige betaling</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Geen extra kosten</p>
                    <p className="text-xs text-gray-600">Geen opstartkosten of verborgen kosten</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Automatische incasso</p>
                    <p className="text-xs text-gray-600">Betalingen worden automatisch afgeschreven</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 text-center">
                  Bij Klarna koop je veilig online en betaal je achteraf. 
                  Meer informatie vind je op klarna.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
