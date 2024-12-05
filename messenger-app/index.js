const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const cors = require("cors");
const Message = require("./models/Message");
const axios = require("axios");
require("dotenv").config();

const messageRoutes = require("./routes/messageRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");
const Conversation = require("./models/Conversation");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://ztext-front.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware CORS et JSON
app.use(
  cors({ origin: "https://ztext-front.onrender.com", 
    methods: ["GET", "POST"],
    credentials: true
   })
);
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

// Routes
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api", userRoutes);
app.use("/api", loginRoutes);
app.use("/api", registerRoutes);

// Route de test
app.get("/", (req, res) => {
  res.send("API de messagerie instantanée en cours de fonctionnement");
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("Nouvelle connexion Socket.IO");

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`Utilisateur ${userId} a rejoint le room ${userId}`);
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, content, conversationId }) => {
      try {
        // Créer un nouveau message
        const newMessage = new Message({
          sender: senderId,
          receiver: receiverId,
          content,
          conversation: conversationId,
          createdAt: new Date(),
        });

        // Sauvegarder le message dans la base de données
        const savedMessage = await newMessage.save();

        // Mettre à jour la conversation avec le dernier message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: savedMessage.content,
        });

        // Émettre le message aux utilisateurs
        io.to(receiverId).emit("receiveMessage", savedMessage);
        io.to(senderId).emit("receiveMessage", savedMessage);
        console.log(
          `Message envoyé à l'utilisateur ${receiverId}:`,
          savedMessage
        );
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté de Socket.IO", socket.id);
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
