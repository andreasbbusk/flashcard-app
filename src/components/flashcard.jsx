'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Flashcard = ({ 
  flashcard, 
  isFlipped = false, 
  onFlip, 
  className,
  showEditButton = false,
  onEdit,
  onDelete,
  editMode = false 
}) => {
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
    if (cardElement && !editMode) {
      cardElement.focus();
      cardElement.addEventListener('keydown', handleKeyDown);
      
      return () => {
        cardElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [editMode, setFlipped]);

  const handleClick = () => {
    if (!editMode) {
      setFlipped(prev => !prev);
    }
  };

  if (!flashcard) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "bg-gradient-to-br from-muted/50 to-muted rounded-xl shadow-lg p-8 w-full max-w-md mx-auto border border-border",
          className
        )}
      >
        <p className="text-muted-foreground text-center font-medium">
          Ingen flashcard data tilgængelig
        </p>
      </motion.div>
    );
  }

  const cardVariants = {
    enter: { opacity: 0, scale: 0.8, rotateY: -180 },
    center: { opacity: 1, scale: 1, rotateY: 0 },
    exit: { opacity: 0, scale: 0.8, rotateY: 180 }
  };

  return (
    <div className={cn("perspective-1000 w-full max-w-md mx-auto", className)}>
      <motion.div
        ref={cardRef}
        tabIndex={editMode ? -1 : 0}
        onClick={handleClick}
        whileHover={!editMode ? { scale: 1.02 } : {}}
        whileTap={!editMode ? { scale: 0.98 } : {}}
        className={cn(
          "relative w-full h-64 outline-none focus:outline-none rounded-xl transform-style-preserve-3d transition-transform duration-700 ease-in-out",
          !editMode && "cursor-pointer",
          flipped ? 'rotate-x-180' : 'rotate-x-0'
        )}
      >
        {/* Front Side */}
        <motion.div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl border border-blue-200 p-6 flex flex-col justify-between",
            flipped ? 'rotate-x-180' : 'rotate-x-0'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with set badge and edit buttons */}
          <div className="flex justify-between items-start">
            <div className="flex justify-start">
              {flashcard.set && (
                <Badge 
                  variant="secondary" 
                  className="bg-white bg-opacity-20 backdrop-blur-sm text-white border-white border-opacity-30"
                >
                  {flashcard.set}
                </Badge>
              )}
            </div>
            
            {editMode && (showEditButton || onEdit || onDelete) && (
              <motion.div 
                className="flex space-x-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(flashcard);
                    }}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-1 transition-all duration-200"
                    title="Rediger kort"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(flashcard);
                    }}
                    className="bg-red-500 bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-1 transition-all duration-200"
                    title="Slet kort"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v.5A1.5 1.5 0 017.5 5h5A1.5 1.5 0 0114 3.5V3a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3.5 3a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </motion.div>
            )}
          </div>
          
          <motion.div 
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-white text-lg font-semibold text-center leading-relaxed drop-shadow-sm">
              {flashcard.front}
            </p>
          </motion.div>
          
          {!editMode && (
            <motion.div 
              className="flex justify-center items-center space-x-2 text-white text-opacity-70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-sm">Click or use ↑ ↓ to flip</span>
            </motion.div>
          )}
        </motion.div>

        {/* Back Side */}
        <motion.div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl border border-emerald-200 p-6 flex flex-col justify-between rotate-x-180"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with set badge and edit buttons */}
          <div className="flex justify-between items-start">
            <div className="flex justify-start">
              {flashcard.set && (
                <Badge 
                  variant="secondary" 
                  className="bg-white bg-opacity-20 backdrop-blur-sm text-white border-white border-opacity-30"
                >
                  {flashcard.set}
                </Badge>
              )}
            </div>
            
            {editMode && (showEditButton || onEdit || onDelete) && (
              <motion.div 
                className="flex space-x-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(flashcard);
                    }}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-1 transition-all duration-200"
                    title="Rediger kort"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(flashcard);
                    }}
                    className="bg-red-500 bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-1 transition-all duration-200"
                    title="Slet kort"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2v.5A1.5 1.5 0 017.5 5h5A1.5 1.5 0 0114 3.5V3a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3.5 3a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </motion.div>
            )}
          </div>
          
          <motion.div 
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-white text-lg font-semibold text-center leading-relaxed drop-shadow-sm">
              {flashcard.back}
            </p>
          </motion.div>
          
          {!editMode && (
            <motion.div 
              className="flex justify-center items-center space-x-2 text-white text-opacity-70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-sm">Click or use ↑ ↓ to flip</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Flashcard;