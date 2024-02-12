// src/Login.js
import React from "react";

const Login = ({ onLogin, accessToken }) => {
  const handleLogin = () => {
    // Your Spotify login logic here
    const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with your actual access token
    onLogin(accessToken); // Call the provided onLogin callback
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Login;
