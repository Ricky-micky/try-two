import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/login";
import Register from "./Pages/Register";
import Book from "./Pages/Book";
import PaymentPage from "./Pages/PaymentPage";
import Navbar from "./Components/Navbar";
import Logout from "./Pages/logout";
import AddHotels from "./Pages/AddHotels";
import Header from "./Components/Header";
import Other from "./Pages/Other";
import "./App.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated by looking for an access token
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <Header />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/book"
          element={isAuthenticated ? <Book /> : <Navigate to="/" />}
        />
        <Route
          path="/hotel"
          element={isAuthenticated ? <AddHotels /> : <Navigate to="/" />}
        />
        <Route
          path="/paymentpage"
          element={isAuthenticated ? <PaymentPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/logout"
          element={<Logout setIsAuthenticated={setIsAuthenticated} />}
        />
      </Routes>

      <Link
        to="/Other"
        className="hover:text-blue-200 transition duration-300 font-semibold"
      >
        Other
      </Link>
    </>
  );
}
