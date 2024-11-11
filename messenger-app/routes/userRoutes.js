// routes/userRoutes.js
const express = require('express');
const { getAllUsers, getCurrentUser, loginUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authenticateToken');

const router = express.Router();

// Route pour récupérer tous les utilisateurs
router.get('/users', getAllUsers); // Utilisation de la fonction getAllUsers

// Route pour la connexion
router.post('/login', loginUser);

// Route pour récupérer l'utilisateur actuel
router.get('/currentUser', authMiddleware, getCurrentUser);

module.exports = router;
