import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/login"
import Register from "./Pages/Register";
import Book from "./Pages/Book"
import PaymentPage from "./Pages/PaymentPage";
import Navbar from "./Components/Navbar";
import Logout from "./Pages/logout";
import Header from "./Components/Header";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Header/>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Register />} />{" "}
          {/* Redirect to Register page */}
          <Route path="/home" element={<Home />} />
          <Route path="/book" element={<Book />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/paymentpage" element={<PaymentPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
     
    </Router>
  );
}
