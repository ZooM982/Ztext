// src/components/NewConversation.js
import React, { useState, useEffect } from 'react';
import { api } from '../../api';

function NewConversation({ onStartConversation }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Récupération de la liste des utilisateurs disponibles pour démarrer une conversation
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users'); // Remplace '/users' par l'endpoint adéquat
                setUsers(response.data);
            } catch (error) {
                setError('Erreur lors du chargement des utilisateurs.');
            }
        };
        fetchUsers();
    }, []);

    const handleStartConversation = (userId) => {
        onStartConversation(userId);
    };

    return (
        <div>
            <h2>Nouvelle Conversation</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <button onClick={() => handleStartConversation(user.id)}>
                            {user.username}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NewConversation;
