'use client';

import { useState, useEffect, useRef } from 'react';

interface AssemblyTimerProps {
  className?: string;
  targetMinutes?: number;
  title?: string;
}

export default function AssemblyTimer({ 
  className = "", 
  targetMinutes = 25,
  title = "Gemiddelde montagetijd"
}: AssemblyTimerProps) {
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect when widget is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (timerRef.current) {
      observer.observe(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        observer.unobserve(timerRef.current);
      }
    };
  }, [hasAnimated]);

  // Animation effect when visible
  useEffect(() => {
    if (isVisible) {
      const duration = 3000; // 3 seconds for smoother animation
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const newValue = easedProgress * targetMinutes;
        
        setCurrentMinutes(Math.round(newValue));
        setCurrentProgress(easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, targetMinutes]);

  // Calculate circle progress
  const circumference = 2 * Math.PI * 45; // radius = 45
  const circleProgress = currentProgress * circumference;

  return (
    <div className={`${className}`}>
      <div className="flex flex-col items-center justify-center" ref={timerRef}>
        <div className="relative w-48 h-48 mb-6">
          {/* Background circle */}
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#fe8b51"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - circleProgress}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {currentMinutes}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Min
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 text-center text-sm leading-relaxed">
          Eenvoudige montage met duidelijke instructies en meegeleverd gereedschap.
        </p>
      </div>
    </div>
  );
}