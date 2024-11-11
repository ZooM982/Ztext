const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Accès refusé : Aucun token fourni' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Ajoute l'objet utilisateur décodé (id, etc.)
        next();
    } catch (error) {
        console.error('Erreur de vérification du token :', error);
        res.status(400).json({ message: 'Token invalide' });
    }
};

module.exports = authMiddleware;
