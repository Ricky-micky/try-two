import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name (optional) */}
        <div className="text-2xl font-bold">
          <Link to="/">MyWebsite</Link>
        </div>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link
            to="/home"
            className="hover:text-blue-200 transition duration-300 font-semibold"
          >
            Home
          </Link>
          <Link
            to="/book"
            className="hover:text-blue-200 transition duration-300 font-semibold"
          >
            Book
          </Link>
          <Link
            to="/hotel"
            className="hover:text-blue-200 transition duration-300 font-semibold"
          >
            Hotel
          </Link>
          <Link
            to="/register"
            className="hover:text-blue-200 transition duration-300 font-semibold"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="hover:text-blue-200 transition duration-300 font-semibold"
          >
            Login
          </Link>
          <Link
            to="/logout"
            className="hover:text-blue-200 transition duration-300 font-semibold"
          >
            Logout
          </Link>
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
