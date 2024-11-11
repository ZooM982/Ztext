import React, { useState, useEffect } from 'react';
import { api, socket } from '../../api'; // Assurez-vous que le socket est correctement importé
import ConversationList from './ConversationList';
import MessageWindow from './MessageWindow';
import UserList from './UserList';
import LogoutButton from '../auth/LogoutButton';

function Chat({ user, onLogout }) {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [users, setUsers] = useState([]);
    const [showUserList, setShowUserList] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    

    useEffect(() => {
        if (!user || !user._id) {
            console.error("L'utilisateur n'est pas défini ou n'a pas d'ID.");
            return;
        }

        const fetchConversations = async () => {
            try {
                const response = await api.get(`/conversations/${user._id}`);
                setConversations(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des conversations:", error);
            } finally {
                setLoadingConversations(false);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
            } finally {
                setLoadingUsers(false);
            }
        };

        // Appels API en parallèle
        Promise.all([fetchConversations(), fetchUsers()]);

        socket.emit('join', user._id);

        socket.on('receiveMessage', (message) => {
            setConversations((prev) => {
                const existingConversation = prev.find(conv => conv._id === message.conversation.toString());
                if (existingConversation) {
                    return prev.map(conv => (conv._id === message.conversation.toString() ? { ...conv, lastMessage: message.content } : conv));
                } else {
                    return [...prev, { _id: message.conversation.toString(), lastMessage: message.content }];
                }
            });

            // Mettre à jour les messages si la conversation sélectionnée est celle-ci
            if (selectedConversation && selectedConversation._id === message.conversation.toString()) {
                setMessages(prevMessages => [...prevMessages, message]);
            }
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [user, selectedConversation]);

    const handleNewConversation = async (receiver) => {
        if (!user || !user._id) return;

        try {
            const response = await api.post('/conversations', { participants: [user._id, receiver._id] });
            setSelectedConversation(response.data);
            setShowUserList(false);
        } catch (error) {
            console.error("Erreur lors de la création d'une nouvelle conversation:", error);
        }
    };

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
    };

    const handleSendMessage = (content) => {
        if (!selectedConversation || !user || !user._id) return;

        const message = {
            content,
            senderId: user._id,
            receiverId: selectedConversation.participants.find(id => id !== user._id),
            conversationId: selectedConversation._id,
        };

        // Émettre le message via Socket.IO
        socket.emit('sendMessage', message);

        // Ajouter le message localement (sans appel API)
        setMessages(prevMessages => [...prevMessages, { ...message, createdAt: new Date() }]);
    };

    return (
        <div className="chat">
            <header>
                <h2>Bienvenue dans votre chat {user.username}</h2>
                <div className='h-[50px] content-center'>
                    <LogoutButton onLogout={onLogout} />
                    <button onClick={() => setShowUserList(true)}>Nouvelle Conversation</button>
                </div>
            </header>
            {loadingUsers || loadingConversations ? (
                <div>Chargement...</div>
            ) : showUserList ? (
                <UserList users={users} onSelectUser={handleNewConversation} />
            ) : (
                <div className='flex'>
                    <ConversationList
                        conversations={conversations}
                        onSelectConversation={handleSelectConversation}
                    />
                    {selectedConversation && (
                        <MessageWindow
                            conversation={selectedConversation}
                            currentUserId={user._id}
                            messages={messages}
                            onSendMessage={handleSendMessage} 
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default Chat;
