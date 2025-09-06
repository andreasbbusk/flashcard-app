'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Flashcard from '@/modules/components/flashcard';
import { getFlashcardsBySet } from '@/modules/services/api';

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const setName = decodeURIComponent(params.setName);
  
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const goToNext = useCallback(() => {
    if (flashcards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
      setIsFlipped(false); // Reset to front when changing cards
    }
  }, [flashcards.length]);

  const goToPrevious = useCallback(() => {
    if (flashcards.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
      setIsFlipped(false); // Reset to front when changing cards
    }
  }, [flashcards.length]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      console.log('fetchFlashcards called - client side');
      console.log('setName:', setName);
      try {
        setLoading(true);
        console.log('About to call getFlashcardsBySet');
        const cards = await getFlashcardsBySet(setName);
        console.log('getFlashcardsBySet returned:', cards);
        console.log('Cards length:', cards?.length);
        setFlashcards(cards);
        setError(null);
      } catch (err) {
        setError('Kunne ikke hente flashcards for dette set');
        console.error('Error fetching flashcards:', err);
        console.error('Error details:', err.message, err.stack);
      } finally {
        setLoading(false);
      }
    };

    if (setName) {
      console.log('setName exists, calling fetchFlashcards');
      fetchFlashcards();
    } else {
      console.log('No setName provided');
    }
  }, [setName]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        router.push('/dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, flashcards.length, goToNext, goToPrevious, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Henter flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Tilbage til dashboard</span>
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800">
            {setName}
          </h1>
          
          {flashcards.length > 0 && (
            <div className="text-sm text-gray-600">
              {currentIndex + 1} af {flashcards.length}
            </div>
          )}
        </div>

        {/* Content */}
        {error ? (
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block mb-4">
              {error}
            </div>
            <Link 
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Tilbage til dashboard
            </Link>
          </div>
        ) : flashcards.length === 0 ? (
          <div className="text-center">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg inline-block mb-4">
              Ingen flashcards fundet i dette set
            </div>
            <Link 
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Tilbage til dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Flashcard */}
            <div className="flex justify-center">
              <Flashcard 
                flashcard={flashcards[currentIndex]} 
                isFlipped={isFlipped}
                onFlip={setIsFlipped}
              />
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center space-x-6">
              <button
                onClick={goToPrevious}
                className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                disabled={flashcards.length <= 1}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Forrige</span>
              </button>

              <div className="text-center text-gray-600 text-sm">
                <p>Brug ← → pile til at navigere, ↑ ↓ pile til at vende kort</p>
                <p>Tryk Esc for at gå tilbage</p>
              </div>

              <button
                onClick={goToNext}
                className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                disabled={flashcards.length <= 1}
              >
                <span>Næste</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Progress indicator */}
            {flashcards.length > 1 && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  {flashcards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setIsFlipped(false); // Reset to front when jumping to card
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentIndex 
                          ? 'bg-blue-600 scale-110' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}