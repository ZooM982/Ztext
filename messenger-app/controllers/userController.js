// controllers/userController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Fonction pour récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Récupère tous les utilisateurs
    res.status(200).json(users); // Renvoie la liste des utilisateurs
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des utilisateurs",
        error,
      });
  }
};

// Fonction pour authentifier un utilisateur et renvoyer un token
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérification de l'utilisateur
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Création du token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, message: "Authentification réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error });
  }
};

// Fonction pour récupérer l'utilisateur actuel
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclut le mot de passe
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération de l'utilisateur",
        error,
      });
  }
};
