import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8003",
});

// Télécharger un document PDF
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await API.post(
    "/api/v1/documents/upload",
    formData
  );

  return response.data;
};

// Récupérer tous les documents
export const getDocuments = async () => {
  const response = await API.get("/api/v1/documents");
  return response.data;
};

// Poser une question sur un document
export const askQuestion = async (documentId, question) => {
  const response = await API.post(
    `/api/v1/documents/${documentId}/ask`,
    { question }
  );

  return response.data;
};

// Récupérer l'historique des questions
export const getQuestions = async (documentId) => {
  const response = await API.get(
    `/api/v1/documents/${documentId}/questions`
  );

  return response.data;
};

// Supprimer un document
export const deleteDocument = async (documentId) => {
  const response = await API.delete(
    `/api/v1/documents/${documentId}`
  );

  return response.data;
};

export default API;