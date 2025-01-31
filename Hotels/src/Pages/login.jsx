// src/components/login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);

        // Fetch current user details after login
        await fetchCurrentUser(data.id);

        alert("Login successful! Redirecting to home...");
        navigate("/home"); // Redirect to home or user dashboard
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while logging in.");
    }
  };

  const fetchCurrentUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/users/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      } else {
        alert("Failed to fetch current user details.");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {currentUser && (
        <div>
          <h3>Welcome, {currentUser.email}!</h3>
          <p>Role: {currentUser.role}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
