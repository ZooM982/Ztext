import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { socket, api } from "./api";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Chat from "./components/chat/Chat";
import NewConversation from "./components/chat/NewConversation";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token récupéré :", token);
    setIsAuthenticated(!!token);

    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.get("/currentUser", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Utilisateur récupéré :", response.data);
          setUser(response.data);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de l'utilisateur:",
            error
          );
          setError(
            "Impossible de récupérer l'utilisateur. Veuillez réessayer."
          );
          setIsAuthenticated(false); 
        }
      }
      setLoadingUser(false);
    };

    fetchUser();
  }, []);

  const handleLogin = (token) => {
    if (token) {
      socket.connect();
      setIsAuthenticated(true);
      navigate("/chat");
    }
    window.location.reload();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    socket.disconnect();
    localStorage.clear();
    navigate("/login");
  };

  const ProtectedRoute = ({ children }) => {
    if (loadingUser) {
      return <div>Chargement de l'hôte...</div>; 
    }

    if (error) {
      return <div>{error}</div>; 
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              {user ? (
                <Chat user={user} onLogout={handleLogout} />
              ) : (
                <div>Chargement de l'hôte pour Afficher le chat...</div>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-conversation"
          element={
            <ProtectedRoute>
              {user ? (
                <NewConversation user={user} />
              ) : (
                <div>Chargement...</div> 
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/chat" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
