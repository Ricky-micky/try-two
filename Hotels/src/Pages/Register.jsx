import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("guest"); // Default role
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      const response = await fetch("https://try-two-5.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (response.ok) {
        toast.success("Registration successful! Redirecting to login...", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Registration failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while registering.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-black-">
      <div className="bg-white shadow-lg rounded-xl p-8 w-96 border-t-4 border-orange-500">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg text-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg text-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="guest">Guest</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg text-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg text-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
