import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
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
