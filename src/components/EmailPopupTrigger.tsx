'use client';

import { Gift } from 'lucide-react';

interface EmailPopupTriggerProps {
  onOpenPopup: () => void;
}

export default function EmailPopupTrigger({ onOpenPopup }: EmailPopupTriggerProps) {
  return (
    <button
      onClick={onOpenPopup}
      className="fixed bottom-6 left-6 z-40 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 p-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group border border-gray-200"
      aria-label="Open korting popup"
    >
      <div className="relative">
        {/* Gift icon */}
        <Gift className="w-6 h-6" />
        
        {/* Subtle pulse animation */}
        <div className="absolute inset-0 bg-gray-100 rounded-2xl animate-ping opacity-10"></div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
          5% korting!
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </button>
  );
}

