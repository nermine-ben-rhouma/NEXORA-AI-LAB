
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Traduire un texte
export const translateText = async (data) => {
  const response = await API.post("/translate", data);
  return response.data;
};

// Récupérer tout l'historique
export const getTranslationHistory = async () => {
  const response = await API.get("/translations");
  return response.data;
};

// Supprimer une traduction
export const deleteTranslation = async (id) => {
  const response = await API.delete(`/translations/${id}`);
  return response.data;
};

// Récupérer les statistiques
export const getTranslationStatistics = async () => {
  const response = await API.get("/statistics");
  return response.data;
};

export default API;
