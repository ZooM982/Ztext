const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const authMiddleware = require("../middleware/authenticateToken");

// Route pour récupérer les messages d'une conversation
router.get("/:conversationId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .populate("sender", "username") // Pour obtenir le nom d'utilisateur de l'expéditeur
      .populate("receiver", "username") // Pour obtenir le nom d'utilisateur du récepteur
      .sort({ createdAt: 1 }); // Trier les messages par date

    res.status(200).json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des messages" });
  }
});

// Route pour marquer les messages comme lus dans une conversation
router.put("/markAsRead/:conversationId", authMiddleware, async (req, res) => {
  try {
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        receiver: req.user.id,
        isRead: false,
      },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: "Messages marqués comme lus" });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des messages comme lus:",
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour des messages" });
  }
});

module.exports = router;
