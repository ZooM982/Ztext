// controllers/registerController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Fonction d'inscription
exports.registerUser = async (req, res) => {
    const { username, password, phoneNumber } = req.body;

    try {
        // Vérifiez si l'utilisateur existe déjà
        const existingUser = await User.findOne({ $or: [{ username }, { phoneNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Nom d utilisateur ou numéro de téléphone déjà pris' });
        }

        // Hachez le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créez un nouvel utilisateur
        const newUser = new User({
            username,
            password: hashedPassword,
            phoneNumber,
        });

        // Sauvegardez l'utilisateur dans la base de données
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l inscription', error });
    }
};
