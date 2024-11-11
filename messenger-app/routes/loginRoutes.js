// routes/loginRoutes.js
const express = require('express');
const { loginUser } = require('../controllers/loginController');

const router = express.Router();

// Route pour la connexion
router.post('/login', loginUser);

module.exports = router;
