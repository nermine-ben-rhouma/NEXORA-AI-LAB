
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Analyser un texte
export const analyzeSentiment = async (text) => {
  const response = await API.post("/api/v1/analyze", {
    text,
  });

  return response.data;
};

// Récupérer l'historique
export const getHistory = async () => {
  const response = await API.get("/api/v1/history");
  return response.data;
};

export default API;
