/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { api, socket } from "../../api";
import CloseButton from "../CloseButton";
import { IoSend } from "react-icons/io5";
import { MdAttachFile } from "react-icons/md";

function MessageWindow({ conversation, currentUserId }) {
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!conversation || !conversation._id) return;

    try {
      const response = await api.get(`/messages/${conversation._id}`);
      const fetchedMessages = response.data;
      setMessages(fetchedMessages);

      const unreadMessages = fetchedMessages.filter(
        (msg) => msg.receiver === currentUserId && !msg.isRead
      );
      setHasUnreadMessages(unreadMessages.length > 0);

      if (unreadMessages.length > 0) {
        await api.put(`/messages/markAsRead/${conversation._id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
    }
  };

  const handleSend = () => {
    if (!currentUserId || !conversation) return;

    const receiverId = conversation.participants.find(
      (p) => p._id !== currentUserId
    );
    if (!receiverId) {
      console.error("Destinataire introuvable");
      return;
    }

    if (messageContent.trim()) {
      const newMessage = {
        content: messageContent,
        sender: currentUserId,
        receiver: receiverId._id,
        conversation: conversation._id,
        createdAt: new Date(),
      };

      socket.emit("sendMessage", {
        senderId: currentUserId,
        receiverId: newMessage.receiver,
        content: newMessage.content,
        conversationId: conversation._id,
      });

      setMessageContent("");
      setHasUnreadMessages(false);
    }
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchMessages();

    if (currentUserId) {
      socket.emit("join", currentUserId);
    }

    const handleReceiveMessage = (message) => {
      if (
        message &&
        message.conversation &&
        message.conversation.toString() === conversation._id.toString()
      ) {
        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some(
            (msg) => msg._id === message._id
          );
          if (!isDuplicate) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
        if (message.receiver === currentUserId) {
          setHasUnreadMessages(true);
        }
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("error", (error) => {
      console.error("Erreur Socket.IO:", error);
    });

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [conversation, currentUserId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const groupedMessages = messages.reduce((groups, msg) => {
    if (msg && msg.createdAt) {
      const date = formatDate(msg.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    }
    return groups;
  }, {});

  const insertUnreadIndicator = (messagesGroup) => {
    if (!hasUnreadMessages) return messagesGroup;

    const lastMessage = messagesGroup[messagesGroup.length - 1];
    const unreadIndicator = (
      <div key="unread-indicator" className="unread-indicator">
        Vous avez des messages non lus
      </div>
    );

    return [unreadIndicator, ...messagesGroup];
  };

  return (
    <div className="message-window w-[50%] me-[10px] my-[10px] rounded-[10px] ">
      <div className="h-[40px] bg-blue-200 p-2 flex justify-between content-center rounded-[10px]">
        <h3>{conversation.phoneNumber || "Conversation"}</h3>
        <CloseButton />
      </div>
      <div className="messages px-[20px]">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="message-group">
            <div className="message-date">{date}</div>
            {insertUnreadIndicator(msgs).map((msg) =>
              msg && msg._id ? (
                <div
                  key={msg._id || msg.key}
                  className={
                    msg.sender._id === currentUserId
                      ? "message-sent"
                      : "message-received"
                  }
                >
                  <div>{msg.content}</div>
                  <div className="message-time">
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              ) : null
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border rounded-[20px] my-3 p-2 flex justify-between content-center ">
        <button>
          <span className=" text-[25px] ">
            <MdAttachFile />
          </span>
        </button>
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Écrire un message..."
          className="outline-none ms-2"
        />
        <button onClick={handleSend}>
          <span className="text-blue-400 text-[25px] ">
            <IoSend />
          </span>
        </button>
      </div>
    </div>
  );
}

export default MessageWindow;
