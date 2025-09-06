import { createClient } from 'redis';

const FLASHCARDS_KEY = 'flashcards';
const SETS_KEY = 'sets';
const COUNTERS_KEY = 'counters';

// Initialize Redis client following Vercel guidelines
let redis = null;

const getRedisConnection = async () => {
  if (!redis && process.env.REDIS_URL) {
    redis = await createClient({ url: process.env.REDIS_URL }).connect();
  }
  return redis;
};

// In-memory storage for fallback
let memoryStorage = {
  flashcards: [],
  sets: [],
  counters: { flashcardId: 1, setId: 1 }
};

// Storage abstraction layer
const storage = {
  async get(key) {
    try {
      if (process.env.REDIS_URL) {
        const redisClient = await getRedisConnection();
        if (redisClient) {
          const data = await redisClient.get(key);
          if (data) {
            return JSON.parse(data);
          }
        }
        // Return default values for each key type
        if (key === COUNTERS_KEY) {
          return { flashcardId: 1, setId: 1 };
        }
        return [];
      }
    } catch (error) {
      console.warn('Redis get failed, falling back to memory:', error);
    }
    
    // Fallback to memory
    const memoryKey = key.replace(':', '');
    return memoryStorage[memoryKey] || (key === COUNTERS_KEY ? { flashcardId: 1, setId: 1 } : []);
  },

  async set(key, value) {
    try {
      if (process.env.REDIS_URL) {
        const redisClient = await getRedisConnection();
        if (redisClient) {
          await redisClient.set(key, JSON.stringify(value));
          return;
        }
      }
    } catch (error) {
      console.warn('Redis set failed, falling back to memory:', error);
    }
    
    // Fallback to memory
    const memoryKey = key.replace(':', '');
    memoryStorage[memoryKey] = value;
  }
};

// Generate unique ID
export const generateId = async (type) => {
  const counters = await storage.get(COUNTERS_KEY);
  const newId = counters[`${type}Id`];
  counters[`${type}Id`] = newId + 1;
  await storage.set(COUNTERS_KEY, counters);
  return newId;
};

// Flashcard operations
export const getFlashcards = async () => {
  return await storage.get(FLASHCARDS_KEY);
};

export const createFlashcard = async (flashcardData) => {
  const flashcards = await storage.get(FLASHCARDS_KEY);
  const newFlashcard = {
    id: await generateId('flashcard'),
    front: flashcardData.front.trim(),
    back: flashcardData.back.trim(),
    set: flashcardData.set || 'General',
    createdAt: new Date().toISOString(),
    reviewCount: 0
  };
  
  flashcards.push(newFlashcard);
  await storage.set(FLASHCARDS_KEY, flashcards);
  return newFlashcard;
};

export const getFlashcardById = async (id) => {
  const flashcards = await storage.get(FLASHCARDS_KEY);
  return flashcards.find(card => card.id === id);
};

export const updateFlashcard = async (id, updateData) => {
  const flashcards = await storage.get(FLASHCARDS_KEY);
  const flashcardIndex = flashcards.findIndex(card => card.id === id);
  
  if (flashcardIndex === -1) {
    throw new Error('Flashcard not found');
  }
  
  const updatedFlashcard = {
    ...flashcards[flashcardIndex],
    front: updateData.front?.trim() || flashcards[flashcardIndex].front,
    back: updateData.back?.trim() || flashcards[flashcardIndex].back,
    set: updateData.set || flashcards[flashcardIndex].set,
    updatedAt: new Date().toISOString()
  };
  
  flashcards[flashcardIndex] = updatedFlashcard;
  await storage.set(FLASHCARDS_KEY, flashcards);
  return updatedFlashcard;
};

export const deleteFlashcard = async (id) => {
  const flashcards = await storage.get(FLASHCARDS_KEY);
  const flashcardIndex = flashcards.findIndex(card => card.id === id);
  
  if (flashcardIndex === -1) {
    throw new Error('Flashcard not found');
  }
  
  const deletedFlashcard = flashcards.splice(flashcardIndex, 1)[0];
  await storage.set(FLASHCARDS_KEY, flashcards);
  return deletedFlashcard;
};

export const getFlashcardsBySet = async (setName) => {
  const flashcards = await storage.get(FLASHCARDS_KEY);
  return flashcards.filter(card => 
    card.set.toLowerCase() === setName.toLowerCase()
  );
};

// Set operations - derive sets from flashcards
export const getSets = async () => {
  const flashcards = await storage.get(FLASHCARDS_KEY);
  const setMap = new Map();
  
  flashcards.forEach(card => {
    const setKey = card.set.toLowerCase();
    if (!setMap.has(setKey)) {
      setMap.set(setKey, {
        id: setMap.size + 1,
        name: card.set,
        description: '',
        createdAt: card.createdAt,
        cardCount: 1
      });
    } else {
      const existingSet = setMap.get(setKey);
      existingSet.cardCount++;
      // Use earliest creation date
      if (card.createdAt < existingSet.createdAt) {
        existingSet.createdAt = card.createdAt;
      }
    }
  });
  
  return Array.from(setMap.values()).sort((a, b) => 
    new Date(a.createdAt) - new Date(b.createdAt)
  );
};

export const createSet = async (setData) => {
  // For this implementation, sets are derived from flashcards
  // We can create an empty set by creating a placeholder flashcard
  const sets = await getSets();
  const existingSet = sets.find(set => 
    set.name.toLowerCase() === setData.name.toLowerCase()
  );
  
  if (existingSet) {
    throw new Error('Set already exists');
  }
  
  // Create a placeholder flashcard to represent the set
  const placeholderFlashcard = await createFlashcard({
    front: 'Welcome to ' + setData.name,
    back: 'This is your new flashcard set. Edit or delete this card and add your own!',
    set: setData.name.trim()
  });
  
  return {
    id: await generateId('set'),
    name: setData.name.trim(),
    description: setData.description?.trim() || '',
    createdAt: new Date().toISOString(),
    cardCount: 1
  };
};

// Initialize data if empty (for first-time setup)
export const initializeData = async () => {
  try {
    const flashcards = await storage.get(FLASHCARDS_KEY);
    
    if (flashcards.length === 0) {
      console.log('Initializing Redis with sample data...');
      // Create some initial sample data
      const sampleFlashcards = [
        {
          id: 1,
          front: 'Hvad er hovedstaden i Danmark?',
          back: 'København',
          set: 'Geografi',
          createdAt: new Date().toISOString(),
          reviewCount: 0
        },
        {
          id: 2,
          front: 'Hvad er 2 + 2?',
          back: '4',
          set: 'Matematik',
          createdAt: new Date().toISOString(),
          reviewCount: 0
        },
        {
          id: 3,
          front: 'Hvem skrev "To be or not to be"?',
          back: 'William Shakespeare',
          set: 'Litteratur',
          createdAt: new Date().toISOString(),
          reviewCount: 0
        }
      ];
      
      await storage.set(FLASHCARDS_KEY, sampleFlashcards);
      await storage.set(COUNTERS_KEY, { flashcardId: 4, setId: 1 });
      console.log('Sample data initialized in Redis');
    }
  } catch (error) {
    console.error('Failed to initialize data:', error);
  }
};

