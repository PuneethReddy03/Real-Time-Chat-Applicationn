import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const ChatBox = () => {
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem("users")) || []);
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem("chatMessages")) || []);
  const [newUser, setNewUser] = useState("");
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("currentUser") || "");
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const updatedMessages = storedMessages.map(msg => msg.recipient === currentUser && msg.status === "Sent" ? { ...msg, status: "Delivered" } : msg);
    setMessages(updatedMessages);
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !currentUser || !recipient) return;

    const newMessage = {
      id: uuidv4(),
      text: input,
      sender: currentUser,
      recipient,
      time: new Date().toLocaleTimeString(),
      status: "Sent"
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
  };

  const addUser = () => {
    if (!newUser.trim() || users.includes(newUser)) return;
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setNewUser("");
  };

  const changeUser = (e) => {
    const newUser = e.target.value;
    setCurrentUser(newUser);
    localStorage.setItem("currentUser", newUser);
  };

  return (
    <div className="chat-container">
      {/* Add User */}
      <div className="add-user">
        <input value={newUser} onChange={(e) => setNewUser(e.target.value)} placeholder="Enter new user" />
        <button onClick={addUser}>Add User</button>
      </div>
      {/* User Selection */}
      <div className="user-selector">
        <label>Logged in as: </label>
        <select value={currentUser} onChange={changeUser}>
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      {/* Recipient Selection */}
      <div className="user-selector">
        <label>Chat with: </label>
        <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
          <option value="">-- Select Recipient --</option>
          {users
            .filter((user) => user !== currentUser) // Exclude current user
            .map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
        </select>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        {messages
          .filter(
            (msg) =>
              (msg.sender === currentUser && msg.recipient === recipient) ||
              (msg.sender === recipient && msg.recipient === currentUser)
          )
          .map((msg) => (
            <div key={msg.id} className={`message ${msg.sender === currentUser ? "my-message" : "other-message"}`}>
              <strong>{msg.sender} → {msg.recipient}:</strong>
              <span> {msg.text}</span>
              <small> {msg.time} - {msg.status}</small>
            </div>
          ))}
      </div>

      {/* Input Box */}
      <div className="input-container">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
        <button onClick={sendMessage} disabled={!currentUser || !recipient}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
