// controllers/loginController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Assurez-vous d'avoir installé jsonwebtoken

// Fonction de connexion
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    console.log('Tentative de connexion avec username:', username); // Log du nom d'utilisateur

    // Validation des données entrantes
    if (!username || !password) {
        return res.status(400).json({ message: 'Nom d utilisateur et mot de passe requis' });
    }

    try {
        // Recherchez l'utilisateur par nom d'utilisateur
        const user = await User.findOne({ username });
        console.log('Utilisateur trouvé:', user); // Log de l'utilisateur trouvé
        
        if (!user) {
            return res.status(401).json({ message: 'Nom d utilisateur ou mot de passe incorrect' });
        }

        // Vérifiez le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Match de mot de passe:', isMatch); // Log du match de mot de passe
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Nom d utilisateur ou mot de passe incorrect' });
        }

        // Créez un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token généré:', token); // Log du token généré

        res.json({ token });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur lors de la connexion', error });
    }
};
