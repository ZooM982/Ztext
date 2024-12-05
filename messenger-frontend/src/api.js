import axios from "axios";
import { io } from "socket.io-client";

const api = axios.create({
  baseURL: "https://ztext.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Configuration du socket
const socket = io("https://ztext.onrender.com", {
  transports: ["websocket"],
  autoConnect: true, // Connecte automatiquement le socket
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export { api, socket };
