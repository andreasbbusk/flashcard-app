import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  // If we're on the server side, use the full URL
  if (typeof window === 'undefined') {
    // In production (Vercel), use the deployment URL
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api`;
    }
    // In development or if VERCEL_URL is not set, construct from known host
    if (process.env.NODE_ENV === 'production') {
      return 'https://flashcard-app-lilac-zeta.vercel.app/api';
    }
    // Local development
    return 'http://localhost:3001/api';
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
  const response = await api.get("/sets");
  return response.data.data;
};

export const getFlashcardsBySet = async (setName) => {
  const response = await api.get(`/sets/${encodeURIComponent(setName)}/flashcards`);
  return response.data.data;
};

export const createFlashcard = async (flashcard) => {
  const response = await api.post("/flashcards", flashcard);
  return response.data;
};

export default api;
