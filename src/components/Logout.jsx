// src/Logout.js
import React from "react";

const Logout = ({ onLogout }) => {
  const handleLogout = () => {
    // Your logout logic here
    onLogout();
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
