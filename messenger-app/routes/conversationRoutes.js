const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// Route pour créer une conversation
router.post('/', async (req, res) => {
    const { participants } = req.body; // participants should be an array of user IDs
    const newConversation = new Conversation({ participants });

    try {
        const savedConversation = await newConversation.save();
        res.status(201).json(savedConversation);
    } catch (error) {
        console.error('Erreur lors de la création de la conversation:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la conversation' });
    }
});

// Route pour récupérer les conversations d'un utilisateur
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const conversations = await Conversation.find({ participants: userId })
            .populate('participants', 'username phoneNumber'); // Peupler les informations des participants
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Erreur lors de la récupération des conversations:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des conversations' });
    }
});

module.exports = router;
