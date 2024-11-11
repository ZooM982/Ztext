// routes/registerRoutes.js
const express = require('express');
const { registerUser } = require('../controllers/registerController');

const router = express.Router();

// Route pour l'inscription
router.post('/register', registerUser);

module.exports = router;
