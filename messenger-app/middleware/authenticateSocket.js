const jwt = require('jsonwebtoken');

// Middleware pour authentifier le socket
const authenticateSocket = (socket, next) => {
    const token = socket.handshake.auth.token; // Récupérer le token de la connexion socket

    if (!token) {
        return next(new Error("Authentification requise"));
    }

    // Vérifier et décoder le token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error("Token invalide"));
        }

        // Ajouter l'ID de l'utilisateur dans le socket pour l'utiliser plus tard
        socket.userId = decoded._id;
        next(); // Passer à la suite si l'authentification réussit
    });
};

module.exports = authenticateSocket;
