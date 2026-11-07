import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8002",
  headers: {
    "Content-Type": "application/json",
  },
});

// Envoyer un message
export const sendMessage = async (message, conversationId = null) => {
  const response = await API.post("/api/v1/chat", {
    message,
    conversation_id: conversationId,
  });

  return response.data;
};

// Récupérer toutes les conversations
export const getConversations = async () => {
  const response = await API.get("/api/v1/conversations");
  return response.data;
};

// Récupérer les messages d'une conversation
export const getMessages = async (conversationId) => {
  const response = await API.get(
    `/api/v1/conversations/${conversationId}/messages`
  );

  return response.data;
};

// Supprimer une conversation
export const deleteConversation = async (conversationId) => {
  const response = await API.delete(
    `/api/v1/conversations/${conversationId}`
  );

  return response.data;
};
// Renommer une conversation
export const renameConversation = async (conversationId, title) => {
  const response = await API.put(
    `/api/v1/conversations/${conversationId}`,
    { title }
  );

  return response.data;
};

export default API;