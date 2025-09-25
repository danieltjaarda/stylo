'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function SeatProFAQ() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "Wat maakt de SeatPro stoel zo bijzonder?",
      answer: "De SeatPro is uitgeroepen tot beste bureausstoel in onafhankelijke tests. Met zijn geavanceerde ergonomische ondersteuning, premium materialen en 300kg draagkracht biedt hij ongeëvenaard comfort voor lange werkdagen."
    },
    {
      question: "Hoelang is de garantie op de SeatPro?",
      answer: "Op de SeatPro geven we 5 jaar volledige garantie op het mechanisme en 2 jaar op de bekleding. Dit toont ons vertrouwen in de uitzonderlijke kwaliteit en duurzaamheid van deze stoel."
    },
    {
      question: "Is de SeatPro geschikt voor mensen met rugklachten?",
      answer: "Absoluut! De SeatPro is speciaal ontworpen met ergonomische principes die rugklachten helpen voorkomen en verminderen. De verstelbare lendensteunen en hoofdsteun bieden optimale ondersteuning voor uw rug en nek."
    },
    {
      question: "Kan ik de SeatPro aanpassen aan mijn lichaamslengte?",
      answer: "Ja, de SeatPro is volledig verstelbaar. U kunt de zithoogte, armleggers, lendensteunen, hoofdsteun en zelfs de zitdiepte aanpassen. Dit maakt hem geschikt voor mensen van 1.50m tot 2.00m."
    },
    {
      question: "Wat is het maximale gewicht dat de SeatPro kan dragen?",
      answer: "De SeatPro heeft een indrukwekkende draagkracht van 300kg, wat hem tot een van de sterkste bureaustoelen op de markt maakt. Dit garandeert stabiliteit en duurzaamheid, ongeacht uw lichaamsgewicht."
    },
    {
      question: "Hoe onderhoud ik mijn SeatPro stoel?",
      answer: "Het onderhoud is eenvoudig: stofzuig de bekleding regelmatig en reinig vlekken met een vochtige doek. De hoogwaardige materialen zijn bestand tegen dagelijks gebruik en behouden hun kwaliteit jarenlang."
    },
    {
      question: "Is montage van de SeatPro inbegrepen?",
      answer: "De SeatPro wordt geleverd met duidelijke montage-instructies en alle benodigde gereedschappen. Optioneel bieden we ook een professionele montageservice aan voor €49, waarbij onze specialisten de stoel bij u thuis installeren."
    },
    {
      question: "Kan ik de SeatPro uitproberen voordat ik definitief koop?",
      answer: "Ja! We bieden 30 dagen bedenktijd. U kunt de SeatPro thuis uitproberen en als u niet 100% tevreden bent, kunt u hem kosteloos retourneren voor volledige terugbetaling."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Veelgestelde vragen over SeatPro
          </h2>
          <p className="text-lg text-gray-600">
            Alles wat je wilt weten over onze beste geteste bureausstoel
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <div className="flex-shrink-0">
                  {openFaqIndex === index ? (
                    <Minus className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              {openFaqIndex === index && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            Heb je nog andere vragen over de SeatPro?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Neem contact op
            </button>
            <a 
              href="tel:0850602482"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Bel ons: 085 060 2482
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
