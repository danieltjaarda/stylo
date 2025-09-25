'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { trackReviewSubmission } from '@/services/klaviyoService';

interface ReviewFormProps {
  productId: string;
  productTitle: string;
  onSubmitSuccess?: () => void;
}

export default function ReviewForm({ productId, productTitle, onSubmitSuccess }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !rating) return;

    setIsSubmitting(true);

    try {
      // Track review in Klaviyo (this will trigger your flow!)
      const result = await trackReviewSubmission(
        email,
        productId,
        productTitle,
        rating,
        reviewText,
        name
      );

      if (result.success) {
        setIsSubmitted(true);
        onSubmitSuccess?.();
        
        // Hide form after success
        setTimeout(() => {
          setIsOpen(false);
          setIsSubmitted(false);
          // Reset form
          setEmail('');
          setName('');
          setRating(0);
          setReviewText('');
        }, 3000);
      } else {
        alert('Er ging iets mis bij het versturen van je review. Probeer het opnieuw.');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      alert('Er ging iets mis bij het versturen van je review. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Deel je ervaring</h3>
        <p className="text-gray-600 mb-4">Help andere klanten met jouw review</p>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Review schrijven
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-green-800">Bedankt voor je review!</h3>
        <p className="text-green-600">
          {rating >= 4 
            ? "We zijn blij dat je tevreden bent! Als dank ontvang je binnenkort een speciale korting."
            : "Bedankt voor je feedback. We nemen contact met je op om je ervaring te verbeteren."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Review schrijven</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beoordeling *
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mailadres *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Naam (optioneel)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Review text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Je review (optioneel)
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Vertel over je ervaring met dit product..."
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || !email || !rating}
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Versturen...' : 'Review versturen'}
        </button>
      </form>
    </div>
  );
}
