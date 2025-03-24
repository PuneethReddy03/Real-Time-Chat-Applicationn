import React from "react";
import ChatBox from "./components/ChatBox";
import "./styles.css";

const App = () => {
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Chat App</h2>
      <ChatBox />
    </div>
  );
};

export default App;
