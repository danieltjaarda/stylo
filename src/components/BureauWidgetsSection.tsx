'use client';

import AssemblyTimer from './AssemblyTimer';
import VideoWidget from './VideoWidget';

interface BureauWidgetsSectionProps {
  className?: string;
}

export default function BureauWidgetsSection({ className = "" }: BureauWidgetsSectionProps) {
  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Waarom kiezen voor DESKNA?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ontdek wat ons onderscheidt: van snelle montage tot uitstekende service, 
            wij zorgen voor de perfecte werkplek ervaring.
          </p>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Widget 1: Assembly Timer - Same as chairs */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm min-h-[400px] flex items-center">
              <AssemblyTimer 
                className="py-0 w-full" 
                targetMinutes={25}
                title="Gemiddelde montagetijd"
              />
            </div>
          </div>

          {/* Widget 2: Video - Pressure Bureau */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm min-h-[400px] flex items-center">
              <VideoWidget
                videoSrc="/svg icons/pressure bureau.mp4"
                title="Drukvermindering Bureau"
                description="Vermindert druk en belasting voor een comfortabele werkhouding. Tot 170kg draagkracht."
                className="w-full"
              />
            </div>
          </div>

          {/* Widget 3: Video - Bureau omhoog */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm min-h-[400px] flex items-center">
              <VideoWidget
                videoSrc="/svg icons/Bureau omhoog 2.0.mp4"
                title="Bureau Hoogteverstelling"
                description="Soepele en stille hoogteverstelling voor de perfecte werkhouding."
                className="w-full"
              />
            </div>
          </div>

          {/* Widget 4: GS Certificaat */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm min-h-[400px] flex items-center">
              <div className="w-full bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 text-center border border-green-200 shadow-sm">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <img 
                      src="/svg icons/certificaat 1.svg.png" 
                      alt="GS Geprüfte Sicherheit Certificaat" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Geprüfte Sicherheit</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Officieel GS-certificaat voor gegarandeerde veiligheid en kwaliteit. Getest volgens Duitse veiligheidsnormen.
                  </p>
                </div>
                <div className="flex items-center justify-center text-xs text-green-600 font-medium">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Officieel Gecertificeerd
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
