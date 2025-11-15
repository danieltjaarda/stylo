'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface CursorMovement {
  x: number;
  y: number;
  timestamp: number;
  action?: 'click' | 'move';
  quantity?: number;
}

// Voeg keyframe animaties toe voor de cursor
const cursorStyles = `
  @keyframes cursor-glow {
    0% { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }
    50% { filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.5)); }
    100% { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }
  }
`;

const MacOSCalculator = () => {
  const [quantity, setQuantity] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ x: 280, y: 140 });
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [movements, setMovements] = useState<CursorMovement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const recordingStartTime = useRef<number>(0);
  const basePrice = 399;

  // Calculate discount percentage based on quantity
  const getDiscountPercentage = (qty: number) => {
    if (qty >= 50) return 25;
    if (qty >= 25) return 20;
    if (qty >= 10) return 15;
    if (qty >= 5) return 10;
    return 0;
  };

  // Calculate final price
  const calculatePrice = (qty: number) => {
    const discount = getDiscountPercentage(qty);
    const discountedPrice = basePrice * (1 - discount / 100);
    return discountedPrice.toFixed(2);
  };

  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    setMovements([]);
    recordingStartTime.current = Date.now();
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
  };

  // Play recorded movements
  const playRecording = async () => {
    if (movements.length === 0) return;
    
    setIsPlaying(true);
    setQuantity(1); // Reset quantity at start

    const startTime = Date.now();
    const firstTimestamp = movements[0].timestamp;
    
    for (let i = 0; i < movements.length; i++) {
      const movement = movements[i];
      const nextMovement = movements[i + 1];
      
      // Update cursor position
      setCursorPosition({ x: movement.x, y: movement.y });
      
      // Handle clicks and quantity changes
      if (movement.action === 'click' && movement.quantity !== undefined) {
        setQuantity(movement.quantity);
      }
      
      // Wait for the appropriate time before next movement
      if (nextMovement) {
        const currentTime = Date.now() - startTime;
        const targetTime = nextMovement.timestamp - firstTimestamp;
        const waitTime = Math.max(0, targetTime - currentTime);
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    setIsPlaying(false);
  };

  // Handle mouse movement during recording
  useEffect(() => {
    if (!isRecording || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);

      // Voeg alleen een nieuwe positie toe als die verschilt van de vorige
      setMovements(prev => {
        const lastMovement = prev[prev.length - 1];
        if (!lastMovement || lastMovement.x !== x || lastMovement.y !== y) {
          return [...prev, {
            x,
            y,
            timestamp: Date.now() - recordingStartTime.current,
            action: 'move'
          }];
        }
        return prev;
      });
      
      setCursorPosition({ x, y });
    };

    const handleClick = (e: MouseEvent) => {
      const container = containerRef.current!;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if click is near quantity controls
      const isPlusButtonClick = 
        e.target instanceof HTMLButtonElement && 
        e.target.textContent === '+';

      if (isPlusButtonClick) {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        setMovements(prev => [...prev, {
          x,
          y,
          timestamp: Date.now() - recordingStartTime.current,
          action: 'click',
          quantity: newQuantity
        }]);
      } else {
        setMovements(prev => [...prev, {
          x,
          y,
          timestamp: Date.now() - recordingStartTime.current,
          action: 'click'
        }]);
      }
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
    };
  }, [isRecording, quantity]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <style>{cursorStyles}</style>
      {/* Recording Controls */}
      <div className="absolute -top-12 left-0 flex gap-2">
        {!isRecording && !isPlaying && (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Start Opname
          </button>
        )}
        {isRecording && (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Stop Opname
          </button>
        )}
        {!isRecording && movements.length > 0 && !isPlaying && (
          <button
            onClick={playRecording}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Afspelen
          </button>
        )}
      </div>

      {/* Cursor */}
      {(isRecording || isPlaying) && (
        <div 
          className="absolute z-50 pointer-events-none"
          style={{ 
            left: `${cursorPosition.x - 20}px`,
            top: `${cursorPosition.y - 20}px`,
            width: '80px',
            height: '80px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M0,0 L0,16 L4,12 L8,16 L10,14 L6,10 L10,10 L0,0' fill='white' stroke='%234a5568' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            transform: 'rotate(-45deg)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            transition: isPlaying ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            willChange: 'transform, left, top',
            animation: isPlaying ? 'cursor-glow 2s ease-in-out infinite' : 'none'
          }}
        />
      )}

      {/* Calculator Container */}
      <div 
        ref={containerRef}
        className="relative bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200"
      >
        {/* Window Header */}
        <div className="bg-gray-100 px-4 py-2 flex items-center border-b border-gray-200">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-center flex-1 text-sm text-gray-600 font-medium">
            Staffel Korting Calculator
          </div>
        </div>

        {/* Calculator Content */}
        <div className="p-6">
          {/* Product Section */}
          <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src="/stoel-wit.png"
                alt="Ergonomische Bureaustoel"
                fill
                className="object-contain"
              />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Ergonomische Bureaustoel</h3>
              <p className="text-sm text-gray-600">Basis prijs: €{basePrice}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aantal stoelen
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 border border-gray-300 rounded-l-md hover:bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center border-y border-gray-300 py-2"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 border border-gray-300 rounded-r-md hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Calculation Results */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Basis prijs per stoel:</span>
                  <span className="font-medium">€{basePrice}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Staffel korting ({getDiscountPercentage(quantity)}%):</span>
                  <span className="font-medium">
                    -€{(basePrice - parseFloat(calculatePrice(quantity))).toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Prijs per stoel:</span>
                  <span>€{calculatePrice(quantity)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Totaal ({quantity} stoelen):</span>
                  <span>€{(parseFloat(calculatePrice(quantity)) * quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Staffel Levels */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={`p-2 rounded ${quantity >= 5 && quantity < 10 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                <div className="font-medium">5-9 stuks</div>
                <div className="text-green-600">10% korting</div>
              </div>
              <div className={`p-2 rounded ${quantity >= 10 && quantity < 25 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                <div className="font-medium">10-24 stuks</div>
                <div className="text-green-600">15% korting</div>
              </div>
              <div className={`p-2 rounded ${quantity >= 25 && quantity < 50 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                <div className="font-medium">25-49 stuks</div>
                <div className="text-green-600">20% korting</div>
              </div>
              <div className={`p-2 rounded ${quantity >= 50 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                <div className="font-medium">50+ stuks</div>
                <div className="text-green-600">25% korting</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacOSCalculator;