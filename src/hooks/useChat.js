// hooks/useChat.js
import { useState } from "react";

const useChat = () => {
    const [messages, setMessages] = useState([]);

    const sendQuery = (query, token, callback) => {
        if (!query.trim()) return;

        // Add the user's query to messages immediately
        setMessages(currentMessages => [...currentMessages, { text: query, sender: "user", avatar: "/logo192.png" }]);

        // Add a loading message
        const loadingMessage = { text: "Loading...", sender: "bot", avatar: "/qut.png" };
        setMessages(currentMessages => [...currentMessages, loadingMessage]);

        fetch('http://127.0.0.1:5005/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(data => {
            // Remove the loading message
            setMessages(currentMessages => currentMessages.filter(msg => msg !== loadingMessage));

            if (data.code === 200) {
                setMessages(currentMessages => [...currentMessages, { text: data.response, sender: "bot", avatar: "/qut.png" }]);
            } else {
                console.error("Failed to fetch chat response:", data);
                setMessages(currentMessages => [...currentMessages, { text: "Failed to get response.", sender: "bot", avatar: "/qut.png" }]);
            }
            if (callback) callback();
        })
        .catch(error => {
            console.error("Error fetching chat:", error);
            setMessages(currentMessages => currentMessages.filter(msg => msg !== loadingMessage).concat({ text: "Error loading response.", sender: "bot", avatar: "/qut.png" }));
            if (callback) callback();
        });
    };

    return { messages, sendQuery };
};

export default useChat;
