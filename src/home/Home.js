// Updated Home.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useChat from "../hooks/useChat";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import "./Home.css";

function Home() {
  const [question, setQuestion] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { messages, sendQuery } = useChat();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const usernameFromUrl = params.get("username");

    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (tokenFromUrl && usernameFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      localStorage.setItem("username", usernameFromUrl);
      setUsername(usernameFromUrl);
    } else if (storedUsername && token) {
      setUsername(storedUsername);
    } else {
      navigate("/");
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
    setIsLoading(true);
    sendQuery(question, token, () => setIsLoading(false));
    setQuestion("");
  };

  return (
    <div className="App">
      <Sidebar username={username} />

      <main className="chat-container">
        <Header
          username={username}
          token={localStorage.getItem("token")} // Pass the token to Header
        />
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
                {message.sender === "user" ? (
                  <span>{username.charAt(0)}</span>
                ) : (
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

        <div>
          <form className="input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={question}
              onChange={handleInputChange}
              placeholder="Type your question here..."
              autoFocus
            />
            <button className="chat-button" type="submit">
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Home;
