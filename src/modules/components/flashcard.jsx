'use client';

import { useState, useEffect, useRef } from 'react';

const Flashcard = ({ flashcard, isFlipped = false, onFlip }) => {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const flipped = onFlip !== undefined ? isFlipped : internalFlipped;
  const setFlipped = onFlip !== undefined ? onFlip : setInternalFlipped;
  const cardRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault();
        setFlipped(prev => !prev);
      }
    };

    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.focus();
      cardElement.addEventListener('keydown', handleKeyDown);
      
      return () => {
        cardElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const handleClick = () => {
    setFlipped(prev => !prev);
  };

  if (!flashcard) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-8 w-full max-w-md mx-auto border border-gray-200">
        <p className="text-gray-500 text-center font-medium">
          Ingen flashcard data tilgængelig
        </p>
      </div>
    );
  }

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        ref={cardRef}
        tabIndex={0}
        onClick={handleClick}
        className={`
          relative w-full h-64 cursor-pointer outline-none focus:outline-none rounded-xl
          transform-style-preserve-3d transition-transform duration-700 ease-in-out
          ${flipped ? 'rotate-x-180' : 'rotate-x-0'}
        `}
      >
        {/* Front Side */}
        <div className={`
          absolute inset-0 w-full h-full backface-hidden rounded-xl
          bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl
          border border-blue-200 p-6 flex flex-col justify-between transition-all duration-300
          ${flipped ? 'rotate-x-180' : 'rotate-x-0'}
        `}>
          {flashcard.set && (
            <div className="flex justify-center">
              <span className="inline-block bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white border-opacity-30">
                {flashcard.set}
              </span>
            </div>
          )}
          
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white text-lg font-semibold text-center leading-relaxed drop-shadow-sm">
              {flashcard.front}
            </p>
          </div>
          
          <div className="flex justify-center items-center space-x-2 text-white text-opacity-70">
            <span className="text-sm">Click or use ↑ ↓ to flip</span>
          </div>
        </div>

        {/* Back Side */}
        <div className={`
          absolute inset-0 w-full h-full backface-hidden rounded-xl
          bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl
          border border-emerald-200 p-6 flex flex-col justify-between transition-all duration-300
          rotate-x-180
        `}>
          {flashcard.set && (
            <div className="flex justify-center">
              <span className="inline-block bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white border-opacity-30">
                {flashcard.set}
              </span>
            </div>
          )}
          
          <div className="flex-1 flex items-center justify-center">
            <p className="text-white text-lg font-semibold text-center leading-relaxed drop-shadow-sm">
              {flashcard.back}
            </p>
          </div>
          
          <div className="flex justify-center items-center space-x-2 text-white text-opacity-70">
            <span className="text-sm">Click or use ↑ ↓ to flip</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
