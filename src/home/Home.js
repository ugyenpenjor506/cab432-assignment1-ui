import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useChat from "../hooks/useChat";
import "../home/Home.css";

function Home() {
  const [question, setQuestion] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { messages, sendQuery } = useChat();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!storedUsername || !token) {
      navigate("/");
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/");
      return;
    }
    setIsLoading(true); // Start loading
    sendQuery(question, token, () => setIsLoading(false)); // Stop loading when the query completes
    setQuestion("");
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="App">
      <aside className="sidebar">
        <img src="/logo.jpeg" alt="Profile" className="profile-pic" />
        <h1>TechNova Assistant</h1>
        <p>
          I'm a friendly AI here to help you with any queries regarding our
          company.
        </p>
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </aside>
      <main className="chat-container">
        <div className="chat-header">
          <div
            className="header-avatar"
            style={{
              backgroundColor: "#666",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
            }}
          >
            {getInitials(username)}
          </div>
          <h3>{username}</h3>
        </div>
        <div className="chat-box">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div
                className="avatar"
                style={{
                  backgroundColor: message.sender === "user" ? "#ccc" : "none",
                  color: message.sender === "user" ? "white" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                }}
              >
                {message.sender === "user" ? getInitials(username) : (
                  <img
                    src="/avatar.jpeg"
                    alt="Chat Avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </div>
              <p>{message.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="typing-indicator">
              <div className="avatar" style={{ backgroundColor: "#ccc" }}></div>
              <div className="typing-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
        </div>

        <form className="input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={handleInputChange}
            placeholder="Type your question here..."
            autoFocus
          />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default Home;
