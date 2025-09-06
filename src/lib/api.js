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

export const updateFlashcard = async (id, flashcard) => {
  const response = await api.put(`/flashcards/${id}`, flashcard);
  return response.data;
};

export const deleteFlashcard = async (id) => {
  const response = await api.delete(`/flashcards/${id}`);
  return response.data;
};

export const createSet = async (setData) => {
  const response = await api.post("/sets", setData);
  return response.data;
};

export const updateSet = async (id, setData) => {
  const response = await api.put(`/sets/${id}`, setData);
  return response.data;
};

export const deleteSet = async (id) => {
  const response = await api.delete(`/sets/${id}`);
  return response.data;
};

export default api;