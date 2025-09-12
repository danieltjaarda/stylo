'use client';

import { useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

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

  const getRecommendation = () => {
    // Simple recommendation logic based on answers
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    
    if (totalScore <= 5) {
      return {
        title: "SitOne Ergonomische Bureustoel",
        description: "Perfect voor basis comfort en kortere werkdagen. Goede prijs-kwaliteit verhouding.",
        price: "€299"
      };
    } else if (totalScore <= 10) {
      return {
        title: "SitPro Ergonomische Bureustoel", 
        description: "Ideaal voor lange werkdagen met uitgebreide ergonomische ondersteuning.",
        price: "€499"
      };
    } else {
      return {
        title: "SitPro Premium met Ligfunctie",
        description: "De ultieme bureustoel voor professionals die het beste willen. Met ligfunctie en voetensteun.",
        price: "€699"
      };
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    const recommendation = getRecommendation();
    
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Jouw Perfecte Match!</h1>
            <p className="text-xl text-gray-600">
              Op basis van jouw antwoorden raden wij dit product aan:
            </p>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 text-center mb-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{recommendation.title}</h2>
              <p className="text-lg text-gray-600 mb-6">{recommendation.description}</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">{recommendation.price}</div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/products"
                  className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Bekijk product
                </a>
                <button
                  onClick={resetQuiz}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Quiz opnieuw doen
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Niet helemaal wat je zocht? Bekijk al onze producten of neem contact op voor persoonlijk advies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/products" 
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

