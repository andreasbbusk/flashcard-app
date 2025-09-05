import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  // If we're on the server side, use the full URL
  if (typeof window === 'undefined') {
    return process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/api`
      : 'http://localhost:3000/api';
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
