'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { getShopifyCollection } from '@/services/shopifyService';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [bureauStoelen, setBureauStoelen] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bureau-stoelen collection from Shopify
  useEffect(() => {
    const loadBureauStoelen = async () => {
      try {
        console.log('🔍 Loading bureau-stoelen collection for quiz...');
        const products = await getShopifyCollection('bureau-stoelen');
        setBureauStoelen(products);
        console.log(`✅ Loaded ${products.length} bureau stoelen for quiz`);
      } catch (error) {
        console.error('❌ Failed to load bureau-stoelen collection:', error);
        setBureauStoelen([]);
      } finally {
        setLoading(false);
      }
    };

    loadBureauStoelen();
  }, []);

  const questions = [
    {
      question: "Hoeveel uren per dag werk je gemiddeld achter je bureau?",
      options: [
        "Minder dan 4 uur",
        "4-6 uur", 
        "6-8 uur",
        "Meer dan 8 uur"
      ]
    },
    {
      question: "Heb je vaak last van rugpijn tijdens of na het werken?",
      options: [
        "Nooit",
        "Soms",
        "Regelmatig", 
        "Altijd"
      ]
    },
    {
      question: "Hoe groot is je werkruimte?",
      options: [
        "Klein (thuiskantoor)",
        "Gemiddeld (kantoorruimte)",
        "Groot (open kantoor)",
        "Zeer groot (directiekantoor)"
      ]
    },
    {
      question: "Wat is je budget voor een nieuwe bureustoel?",
      options: [
        "Tot €300",
        "€300 - €500",
        "€500 - €800",
        "€800 of meer"
      ]
    },
    {
      question: "Welke functie is het belangrijkst voor jou?",
      options: [
        "Comfort voor lange werkdagen",
        "Moderne uitstraling",
        "Veel verstelmogelijkheden",
        "Duurzaamheid en garantie"
      ]
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getRecommendedProduct = () => {
    // If no products loaded, return null
    if (bureauStoelen.length === 0) return null;

    // Simple recommendation logic based on answers
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    
    // Try to find SeatPro product first (most common recommendation)
    const seatProProduct = bureauStoelen.find(product => 
      product.name.toLowerCase().includes('seatpro')
    );

    // If SeatPro found, return it for most cases
    if (seatProProduct && totalScore >= 3) {
      return seatProProduct;
    }

    // Otherwise return the first available product or SeatPro as fallback
    return seatProProduct || bureauStoelen[0];
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    const recommendedProduct = getRecommendedProduct();
    
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Jouw Perfecte Match!</h1>
            <p className="text-xl text-gray-600">
              Op basis van jouw antwoorden raden wij dit product aan:
            </p>
          </div>

          {loading ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center mb-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 max-w-md mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded mb-6 max-w-xs mx-auto"></div>
              </div>
            </div>
          ) : recommendedProduct ? (
            <div className="mb-8">
              <div className="max-w-sm mx-auto">
                <ProductCard product={recommendedProduct} />
              </div>
              
              <div className="text-center mt-8">
                <button
                  onClick={resetQuiz}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Quiz opnieuw doen
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Geen producten beschikbaar</h2>
              <p className="text-gray-600 mb-6">
                Er konden geen producten worden geladen. Probeer het later opnieuw.
              </p>
              <button
                onClick={resetQuiz}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Quiz opnieuw doen
              </button>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Niet helemaal wat je zocht? Bekijk al onze producten of neem contact op voor persoonlijk advies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/shop-alles" 
                className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Alle producten
              </a>
              <a 
                href="/contact" 
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Persoonlijk advies
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Bureustoel Quiz</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Vind in 2 minuten de perfecte bureustoel voor jouw situatie
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Vraag {currentQuestion + 1} van {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {questions[currentQuestion].question}
          </h2>
          
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full p-4 text-left bg-white border border-gray-200 rounded-xl hover:border-gray-900 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{option}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Back button */}
        {currentQuestion > 0 && (
          <div className="text-center">
            <button
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1);
                setAnswers(answers.slice(0, -1));
              }}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Vorige vraag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}




