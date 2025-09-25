'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  className?: string;
}

const faqData: FAQItem[] = [
  {
    question: "Wat is de levertijd van jullie producten?",
    answer: "De meeste producten worden binnen 3-5 werkdagen geleverd. Voor op maat gemaakte producten kan dit 1-2 weken duren. Je ontvangt altijd een track & trace code om je bestelling te volgen."
  },
  {
    question: "Bieden jullie montageservice aan?",
    answer: "Ja, we bieden professionele montageservice aan voor al onze producten. Dit kan bij het bestellen worden toegevoegd. Onze monteurs zorgen voor een vakkundige installatie op de gewenste locatie."
  },
  {
    question: "Wat is jullie retourbeleid?",
    answer: "Je hebt 30 dagen bedenktijd vanaf de leverdatum. Producten kunnen kosteloos worden geretourneerd in originele staat. We regelen de ophaalservice en zorgen voor een snelle terugbetaling."
  },
  {
    question: "Zijn jullie producten ergonomisch gecertificeerd?",
    answer: "Ja, al onze bureaus en stoelen voldoen aan de nieuwste ergonomische standaarden en zijn gecertificeerd. We werken samen met ergonomische specialisten om optimaal zitcomfort te garanderen."
  },
  {
    question: "Bieden jullie garantie op jullie producten?",
    answer: "We bieden 2-5 jaar garantie afhankelijk van het product. Op mechanische onderdelen zoals motoren geven we 5 jaar garantie, op andere onderdelen 2 jaar. Defecte onderdelen worden kosteloos vervangen."
  },
  {
    question: "Kunnen jullie producten worden aangepast aan specifieke wensen?",
    answer: "Ja, veel van onze producten kunnen worden aangepast. Denk aan afmetingen, kleuren, materialen en extra functies. Neem contact op voor de mogelijkheden en een persoonlijke offerte."
  },
  {
    question: "Werken jullie ook met bedrijven (B2B)?",
    answer: "Absoluut! We hebben speciale B2B tarieven en services. We leveren complete kantoorinrichtingen, bieden projectbegeleiding en hebben flexibele betalingsmogelijkheden voor bedrijven."
  },
  {
    question: "Hoe onderhoud ik mijn zit-sta bureau?",
    answer: "Onze bureaus zijn onderhoudsarm. Regelmatig schoonmaken met een vochtige doek is voldoende. Voor de mechanische onderdelen raden we jaarlijks een kleine service aan, dit verlengt de levensduur aanzienlijk."
  }
];

export default function FAQ({ className = "" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Veelgestelde Vragen
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hier vind je antwoorden op de meest gestelde vragen over onze producten en services. 
            Staat jouw vraag er niet bij? Neem gerust contact met ons op!
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900 pr-4">
                  {item.question}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
