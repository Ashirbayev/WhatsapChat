import React, { useEffect, useState } from "react";
import './WhatsAppChat.css';
import axios from "axios";

const WhatsAppChat = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");


    const idInstance = localStorage.getItem("idInstance");
    const apiTokenInstance = localStorage.getItem("apiTokenInstance");

    // Функция для получения списка чатов
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await fetch(
                    `https://7103.api.greenapi.com/waInstance${idInstance}/lastOutgoingMessages/${apiTokenInstance}?minutes=1440`
                );
                const data = await response.json();
                setChats(data);
            } catch (error) {
                console.error("Ошибка при загрузке чатов:", error);
            }
        };

        fetchChats();
    }, [idInstance, apiTokenInstance]);

    // Функция для получения истории чата
    const fetchChatHistory = async (chatId) => {
        try {
            const outgoingResponse = await fetch(
                `https://7103.api.greenapi.com/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chatId }),
                }
            );
            const incomingResponse = await fetch(
                `https://7103.api.greenapi.com/waInstance${idInstance}/lastIncomingMessages/${apiTokenInstance}?minutes=1440`
            );

            const outgoingMessages = await outgoingResponse.json();
            const incomingMessages = await incomingResponse.json();

            // Объединение отправленных и полученных сообщений
            const combinedMessages = [...outgoingMessages, ...incomingMessages].sort(
                (a, b) => a.timestamp - b.timestamp
            );

            setChatHistory(combinedMessages);
        } catch (error) {
            console.error("Ошибка при загрузке истории чата:", error);
        }
    };

    // Обработчик выбора чата
    const handleChatSelect = (chat) => {
        setSelectedChat(chat.chatId);
        fetchChatHistory(chat.chatId);
    };


    const sendNewMessage = async () => {
        try {
            const url = `https://7103.api.greenapi.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
            const data = {
                chatId: `${phoneNumber}@c.us`,
                message: messageInput
            };
            await axios.post(url, data);
            setMessageInput("");


        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    // Обработчик отправки сообщения
    const handleSendMessage = async () => {
        if (messageInput.trim() === "") return;

        try {
            await fetch(
                `https://7103.api.greenapi.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chatId: selectedChat,
                        message: messageInput,
                    }),
                }
            );
            setChatHistory((prev) => [
                ...prev,
                {
                    type: "outgoing",
                    textMessage: messageInput,
                    timestamp: Date.now(),
                },
            ]);
            setMessageInput(""); // Очистить инпут
        } catch (error) {
            console.error("Ошибка при отправке сообщения:", error);
        }
    };

    // Обработчик кнопки "Назад"
    const handleBack = () => {
        setSelectedChat(null);
        setChatHistory([]);
    };

    return (
        <div className="whatsapp-chat-container">
            {!selectedChat ? (
                <div className="chat-list">
                    <h2>Chats</h2>
                    {chats.map((chat, index) => (
                        <div
                            key={index}
                            className="chat-item"
                            onClick={() => handleChatSelect(chat)}
                        >
                            <div className="chat-avatar"></div>
                            <div className="chat-info">
                                <p className="chat-id">{chat.chatId.split("@")[0]}</p>
                                <p className="chat-message">{chat.textMessage}</p>
                            </div>
                        </div>
                    ))}
                    <div className="message-input-container">

                        <input
                            type="text"
                            placeholder="Recipient's Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="message-input-container">
                        <input
                            type="text"
                            placeholder="Type a message"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />

                        <button onClick={sendNewMessage}>Start New Chat</button>
                    </div>

                </div>
            ) : (
                <div className="chat-history">
                    <button className="back-button" onClick={handleBack}>
                        Back
                    </button>
                    <h3>Chat with {selectedChat.split("@")[0]}</h3>
                    <div className="messages">
                        {chatHistory.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.type === "outgoing" ? "sent" : "received"}`}
                            >
                                {message.textMessage}
                            </div>
                        ))}
                    </div>
                    <div className="message-input-container">
                        <input
                            type="text"
                            placeholder="Type a message"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatsAppChat;
