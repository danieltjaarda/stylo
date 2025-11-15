'use client';

import { useState, useRef } from 'react';

interface AnimatedAddToCartProps {
  onAddToCart: () => void;
  buttonText?: string;
}

export default function AnimatedAddToCart({ 
  onAddToCart,
  buttonText = "In Winkelwagen" 
}: AnimatedAddToCartProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (!buttonRef.current) return;
    
    // Add animation class
    setIsAdded(true);
    setCartCount(prev => prev + 1);
    
    // Trigger haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
    
    // Wait for orange animation, THEN call add to cart
    setTimeout(() => {
      onAddToCart();
    }, 600);
    
    // Remove animation after 1 second
    setTimeout(() => {
      setIsRemoving(true);
      setIsAdded(false);
      
      setTimeout(() => {
        setIsRemoving(false);
      }, 300);
    }, 1000);
  };

  return (
    <button 
      ref={buttonRef}
      onClick={handleClick}
      className={`add-cart-btn ${isAdded ? 'added' : ''} ${isRemoving ? 'removing' : ''}`}
    >
      <div className="btn-text">{buttonText}</div>
      
      <div className="divider divider-1"></div>
      <div className="divider divider-2"></div>
      
      <div className="icon-wrapper">
        <svg className="basket-icon" viewBox="0 0 20.04 19.95" width="18" height="18">
          <path d="M 0 0 L 2 0 L 4.66 12.42 C 4.861 13.358 5.701 14.021 6.66 14 L 16.44 14 C 17.378 13.998 18.188 13.346 18.39 12.43 L 20.04 5 L 3.07 5 M 6.95 18.95 C 6.95 19.502 6.502 19.95 5.95 19.95 C 5.398 19.95 4.95 19.502 4.95 18.95 C 4.95 18.398 5.398 17.95 5.95 17.95 C 6.502 17.95 6.95 18.398 6.95 18.95 Z M 17.95 18.95 C 17.95 19.502 17.502 19.95 16.95 19.95 C 16.398 19.95 15.95 19.502 15.95 18.95 C 15.95 18.398 16.398 17.95 16.95 17.95 C 17.502 17.95 17.95 18.398 17.95 18.95 Z" 
                fill="transparent" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className="badge">
        <span className="badge-text">{cartCount}</span>
      </div>
      
      <div className="icon-wrapper icon-filled">
        <svg className="basket-icon" viewBox="0 0 20.04 19.95" width="18" height="18">
          <path d="M 0 0 L 2 0 L 4.66 12.42 C 4.861 13.358 5.701 14.021 6.66 14 L 16.44 14 C 17.378 13.998 18.188 13.346 18.39 12.43 L 20.04 5 L 3.07 5 M 6.95 18.95 C 6.95 19.502 6.502 19.95 5.95 19.95 C 5.398 19.95 4.95 19.502 4.95 18.95 C 4.95 18.398 5.398 17.95 5.95 17.95 C 6.502 17.95 6.95 18.398 6.95 18.95 Z M 17.95 18.95 C 17.95 19.502 17.502 19.95 16.95 19.95 C 16.398 19.95 15.95 19.502 15.95 18.95 C 15.95 18.398 16.398 17.95 16.95 17.95 C 17.502 17.95 17.95 18.398 17.95 18.95 Z" 
                fill="transparent" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 3 5 L 20 5 L 18 14 L 5 14 Z" fill="white"/>
        </svg>
      </div>
      
      <div className="icon-wrapper icon-checkmark">
        <svg className="checkmark-icon" viewBox="0 0 24 24" width="24" height="24">
          <path d="M 4 12 L 9 17 L 20 6" fill="transparent" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <style jsx>{`
        .add-cart-btn {
          position: relative;
          background: #292f3e;
          color: white;
          border: none;
          border-radius: 24px;
          width: 171px;
          height: 48px;
          cursor: pointer;
          overflow: hidden;
          box-shadow: rgba(0, 0, 0, 0.176) 0px 5.24438px 13.985px 0px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .add-cart-btn:hover {
          box-shadow: rgba(0, 0, 0, 0.25) 0px 8px 20px 0px;
        }

        .btn-text {
          position: absolute;
          top: 50%;
          left: 16px;
          transform: translateY(-50%);
          font-size: 14px;
          font-weight: 500;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .add-cart-btn:hover .btn-text {
          transform: translateY(-50%) translateX(35px);
        }

        .divider {
          display: none;
        }

        .icon-wrapper {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .basket-icon {
          display: block;
        }

        .icon-filled {
          right: auto;
          left: -30px;
          opacity: 0;
        }

        .add-cart-btn:hover .icon-wrapper:not(.icon-filled):not(.icon-checkmark) {
          right: -30px;
          opacity: 0;
        }

        .add-cart-btn:hover .icon-filled {
          left: 16px;
          opacity: 1;
        }

        .icon-checkmark {
          opacity: 0;
          right: 50%;
          transform: translateX(50%) translateY(-50%) scale(0);
        }

        .add-cart-btn.added .icon-checkmark {
          opacity: 1;
          transform: translateX(50%) translateY(-50%) scale(1);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .add-cart-btn.added .btn-text {
          opacity: 0;
        }

        .add-cart-btn.added .icon-filled,
        .add-cart-btn.added .icon-wrapper:not(.icon-checkmark) {
          opacity: 0;
        }

        .badge {
          position: absolute;
          min-width: 12px;
          height: 12px;
          padding: 0 2px;
          background: #ff6c4c;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 30%;
          left: -20px;
          opacity: 0;
          transform: translateY(-50%) scale(0);
          transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          box-shadow: 0 2px 6px rgba(255, 108, 76, 0.4);
        }

        .badge-text {
          font-size: 7px;
          font-weight: 700;
          color: white;
          line-height: 1;
        }

        .add-cart-btn:hover .badge {
          left: 24px;
          opacity: 1;
          transform: translateY(-50%) scale(1);
        }

        .add-cart-btn.added .badge {
          opacity: 0 !important;
          transform: translateY(-50%) scale(0) !important;
        }

        .add-cart-btn.added {
          background: #ff6c4c;
          transition: background 0.4s ease-out;
        }
      `}</style>
    </button>
  );
}

