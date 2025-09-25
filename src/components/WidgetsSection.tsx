'use client';

import AssemblyTimer from './AssemblyTimer';
import VideoWidget from './VideoWidget';

interface WidgetsSectionProps {
  className?: string;
}

export default function WidgetsSection({ className = "" }: WidgetsSectionProps) {
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
          
          {/* Widget 1: Assembly Timer */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm min-h-[400px] flex items-center">
              <AssemblyTimer 
                className="py-0 w-full" 
                targetMinutes={25}
                title="Gemiddelde montagetijd"
              />
            </div>
          </div>

          {/* Widget 2: Video - Op 1 lijn met je lichaam */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm min-h-[400px] flex items-center">
              <VideoWidget
                videoSrc="/Op 1 lijn met je lichaam.mp4"
                title="Op 1 lijn met je lichaam"
                description="Perfecte ergonomische ondersteuning voor een gezonde werkhouding."
                className="w-full"
              />
            </div>
          </div>

          {/* Widget 3: Video - Vermindert druk op benen */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm min-h-[400px] flex items-center">
              <VideoWidget
                videoSrc="/vermindert druk op benen.mp4"
                title="Vermindert druk op benen"
                description="Ontlast je benen en verbeter je doorbloeding tijdens het werken."
                className="w-full"
              />
            </div>
          </div>

          {/* Widget 4: Video - Pressure Bureau */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm min-h-[400px] flex items-center">
              <VideoWidget
                videoSrc="/svg icons/pressure bureau.m4v"
                title="Drukvermindering"
                description="Vermindert druk op je lichaam voor optimaal zitcomfort."
                className="w-full"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
