import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  // If we're on the server side, use the full URL
  if (typeof window === 'undefined') {
    // In production (Vercel), use the deployment URL
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api`;
    }
    // Local development
    return 'http://localhost:3000/api';
  }
  // On the client side, use relative URL
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

export const getFlashcards = async () => {
  const response = await api.get("/flashcards");
  return response.data.data; // Access the 'data' property from the API response
};

export const getSets = async () => {
  console.log('getSets called with baseURL:', api.defaults.baseURL);
  try {
    const response = await api.get("/sets");
    console.log('getSets response:', response);
    console.log('getSets response.data:', response.data);
    console.log('getSets response.data.data:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('getSets error:', error);
    throw error;
  }
};

export const getFlashcardsBySet = async (setName) => {
  console.log('getFlashcardsBySet called with setName:', setName);
  console.log('getFlashcardsBySet baseURL:', api.defaults.baseURL);
  try {
    const response = await api.get(`/sets/${encodeURIComponent(setName)}/flashcards`);
    console.log('getFlashcardsBySet response:', response);
    console.log('getFlashcardsBySet response.data:', response.data);
    console.log('getFlashcardsBySet response.data.data:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('getFlashcardsBySet error:', error);
    throw error;
  }
};

export const createFlashcard = async (flashcard) => {
  const response = await api.post("/flashcards", flashcard);
  return response.data;
};

export default api;
