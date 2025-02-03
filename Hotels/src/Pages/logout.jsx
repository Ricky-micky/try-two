import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Logout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      localStorage.removeItem("access_token");
      setIsAuthenticated(false); // Update authentication state
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => navigate("/login"), 1000); // Redirect after 1 second
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while logging out.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-black">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center transform transition-all hover:scale-105">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">Logout</h2>
        <p className="text-gray-600 mb-8">Are you sure you want to log out?</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
