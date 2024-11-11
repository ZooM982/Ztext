import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './ConversationList.css'; // Assurez-vous d'importer le fichier CSS

const socket = io('http://localhost:5000'); // Connexion au serveur Socket.IO

function ConversationList({ conversations, currentUserId, onSelectConversation }) {
    const [liveConversations, setLiveConversations] = useState(conversations);

    useEffect(() => {
        setLiveConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        const handleConnect = () => {
            console.log('Connecté au serveur Socket.IO');
            if (currentUserId) {
                socket.emit('join', currentUserId);
            }
        };

        const handleConnectError = (error) => {
            console.error('Erreur de connexion à Socket.IO:', error);
        };

        const handleReceiveMessage = (newMessage) => {
            console.log('Nouveau message reçu:', newMessage);

            setLiveConversations((prevConversations) => {
                const conversationExists = prevConversations.find(conv => conv._id === newMessage.conversationId);
                
                if (conversationExists) {
                    return prevConversations.map(conv => {
                        if (conv._id === newMessage.conversationId) {
                            return {
                                ...conv,
                                lastMessage: newMessage.content,
                                lastMessageTime: newMessage.createdAt,
                            };
                        }
                        return conv;
                    });
                } else {
                    const newConv = {
                        _id: newMessage.conversationId,
                        participants: [newMessage.sender, newMessage.receiver],
                        lastMessage: newMessage.content,
                        lastMessageTime: newMessage.createdAt,
                    };
                    return [newConv, ...prevConversations]; // Ajouter la nouvelle conversation en premier
                }
            });
        };

        socket.on('connect', handleConnect);
        socket.on('connect_error', handleConnectError);
        socket.on('receiveMessage', handleReceiveMessage);
        socket.on('error', (error) => {
            console.error('Erreur Socket.IO:', error);
        });

        return () => {
            console.log('Nettoyage des événements Socket.IO');
            socket.off('receiveMessage', handleReceiveMessage);
            socket.off('connect', handleConnect);
            socket.off('connect_error', handleConnectError);
        };
    }, [currentUserId]);

    const safeConversations = Array.isArray(liveConversations) ? liveConversations : [];

    return (
        <div className="conversation-list ms-[10px] my-[10px] ">
            <h3>Conversations</h3>
            {safeConversations.length === 0 ? (
                <p>Aucune conversation disponible. Commencez une nouvelle conversation !</p>
            ) : (
                <ul>
                    {safeConversations.map(conversation => {
                        const otherParticipant = conversation.participants.find(p => p.username !== currentUserId);
                        const participantInfo = otherParticipant ? otherParticipant.username || otherParticipant.phone : 'Utilisateur inconnu';

                        return (
                            <li key={conversation._id} onClick={() => onSelectConversation(conversation)} className="conversation-item">
                                <div className="conversation-info">
                                    <strong>{participantInfo}</strong>
                                    <p>{conversation.lastMessage || 'Aucun message'}</p>
                                </div>
                                <small className="conversation-timestamp">
                                    {conversation.lastMessageTime ? new Date(conversation.lastMessageTime).toLocaleString() : 'Aucune date'}
                                </small>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default ConversationList;
